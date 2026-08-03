import assert from "node:assert/strict";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4178";
const chromeCandidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
].filter(Boolean);

async function findChrome() {
  for (const candidate of chromeCandidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next known local browser path.
    }
  }
  throw new Error("Chrome not found; set CHROME_PATH to a Chromium executable");
}

function monitorChild(child) {
  const state = { spawnError: null, exit: null };
  let settle;
  const stopped = new Promise((resolve) => { settle = resolve; });

  child.once("error", (error) => {
    state.spawnError = error;
    settle();
  });
  child.once("exit", (code, signal) => {
    state.exit = { code, signal };
    settle();
  });

  return {
    assertRunning() {
      if (state.spawnError) throw state.spawnError;
      if (state.exit) {
        throw new Error(
          `Chrome exited before DevTools was ready (${state.exit.code ?? state.exit.signal})`,
        );
      }
    },
    get spawnError() {
      return state.spawnError;
    },
    waitForStop() {
      return state.exit || state.spawnError ? Promise.resolve() : stopped;
    },
  };
}

function parseDevToolsActivePort(contents) {
  const [portLine, browserPath] = contents.trim().split(/\r?\n/);
  const port = Number(portLine);
  assert.ok(Number.isInteger(port) && port > 0 && port <= 65535, "invalid DevTools port");
  assert.match(browserPath || "", /^\/devtools\/browser\/[A-Za-z0-9-]+$/);
  return {
    port,
    browserWebSocketUrl: `ws://127.0.0.1:${port}${browserPath}`,
  };
}

async function waitForOwnedDevTools(profile, childMonitor, attempts = 200) {
  const activePortFile = join(profile, "DevToolsActivePort");
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    childMonitor.assertRunning();
    try {
      return parseDevToolsActivePort(await readFile(activePortFile, "utf8"));
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw lastError || new Error(`Timed out waiting for ${activePortFile}`);
}

async function waitForJson(url, attempts = 100) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw lastError || new Error(`Timed out waiting for ${url}`);
}

async function waitForUrl(url, attempts = 100) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw lastError || new Error(`Timed out waiting for ${url}`);
}

class CdpConnection {
  constructor(webSocketUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.socket = new WebSocket(webSocketUrl);
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || "Browser evaluation failed");
    }
    return result.result.value;
  }

  close() {
    this.socket.close();
  }
}

class CdpPage extends CdpConnection {
  async connect() {
    await super.connect();
    await this.send("Page.enable");
    await this.send("Runtime.enable");
  }

  async emulate({ width, height, touch }) {
    await this.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: touch,
      screenWidth: width,
      screenHeight: height,
    });
    await this.send("Emulation.setTouchEmulationEnabled", {
      enabled: touch,
      maxTouchPoints: touch ? 5 : 1,
    });
  }

  async navigate(path) {
    const expectedUrl = new URL(path, baseUrl).href;
    const navigation = await this.send("Page.navigate", { url: expectedUrl });
    if (navigation.errorText) throw new Error(`Navigation failed: ${navigation.errorText}`);

    let lastState;
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const state = await this.evaluate(`({
        url: location.href,
        ready: document.readyState === "complete",
        rendered: document.querySelector("#root")?.children.length > 0,
      })`).catch(() => null);
      if (state) lastState = state;
      if (state?.url === expectedUrl && state.ready && state.rendered) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw new Error(
      `Timed out rendering ${expectedUrl}; last URL was ${lastState?.url || "unavailable"}`,
    );
  }
}

const roundRectScript = `(element) => {
  const rect = element.getBoundingClientRect();
  return Object.fromEntries(
    ["left", "top", "right", "bottom", "width", "height"]
      .map((key) => [key, Math.round(rect[key] * 100) / 100]),
  );
}`;

async function measureSelectors(page, path, selectors) {
  await page.navigate(path);
  return page.evaluate(`(() => {
    const roundRect = ${roundRectScript};
    return Object.fromEntries(${JSON.stringify(selectors)}.map((selector) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error("Missing selector: " + selector);
      return [selector, roundRect(element)];
    }));
  })()`);
}

async function main() {
  const chromePath = await findChrome();
  const profile = await mkdtemp(join(tmpdir(), "portfolio-responsive-chrome-"));
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--enable-automation",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-address=127.0.0.1",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ], { stdio: "ignore" });
  const childMonitor = monitorChild(chrome);

  let browser;
  let page;
  let targetId;
  try {
    const devTools = await waitForOwnedDevTools(profile, childMonitor);
    browser = new CdpConnection(devTools.browserWebSocketUrl);
    await browser.connect();
    const commandLine = await browser.send("Browser.getBrowserCommandLine");
    assert.ok(
      commandLine.arguments.includes(`--user-data-dir=${profile}`),
      "DevTools endpoint does not belong to the Chrome child profile",
    );

    ({ targetId } = await browser.send("Target.createTarget", { url: "about:blank" }));
    const targetList = await waitForJson(`http://127.0.0.1:${devTools.port}/json/list`);
    const target = targetList.find((candidate) => candidate.id === targetId);
    assert.ok(target?.webSocketDebuggerUrl, "Chrome must expose the owned page target");
    page = new CdpPage(target.webSocketDebuggerUrl);
    await page.connect();

    if (process.argv.includes("--self-test")) {
      const navigationSelfTestUrl = process.env.RESPONSIVE_BOUNDS_NAVIGATION_SELF_TEST_URL;
      let navigationResult = "";
      if (navigationSelfTestUrl) {
        await page.evaluate(`document.body.innerHTML = '<main id="root"><p>old document</p></main>'`);
        await page.navigate(navigationSelfTestUrl);
        const resolvedUrl = await page.evaluate("location.href");
        assert.equal(resolvedUrl, navigationSelfTestUrl);
        navigationResult = ` navigationUrl=${resolvedUrl}`;
      }
      process.stdout.write(
        `profileOwned=true targetOwned=true port=${devTools.port}${navigationResult}\n`,
      );
      return;
    }

    await waitForUrl(`${baseUrl}/`);
    const overflow = [];
    for (const viewport of [
      { width: 320, height: 700, touch: true },
      { width: 390, height: 844, touch: true },
      { width: 768, height: 1024, touch: true },
      { width: 1024, height: 768, touch: true },
      { width: 900, height: 700, touch: false },
    ]) {
      await page.emulate(viewport);
      for (const path of ["/", "/entry", "/portfolio", "/project/whelk"]) {
        await page.navigate(path);
        const result = await page.evaluate(`({
          width: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          coarse: matchMedia("(pointer:coarse)").matches,
          touchPoints: navigator.maxTouchPoints,
        })`);
        assert.ok(result.scrollWidth <= result.width, `${path} overflows at ${viewport.width}px`);
        if (viewport.touch) {
          assert.equal(result.coarse, true, `${viewport.width}px touch emulation must expose a coarse pointer`);
          assert.ok(result.touchPoints > 0, `${viewport.width}px touch emulation must expose touch points`);
        }
        overflow.push({ viewport: `${viewport.width}x${viewport.height}`, path, ...result });
      }
    }

    const targets = {};
    for (const viewport of [
      { width: 320, height: 700, touch: true },
      { width: 390, height: 844, touch: true },
      { width: 768, height: 1024, touch: true },
      { width: 1024, height: 768, touch: true },
    ]) {
      await page.emulate(viewport);
      const measured = {
        ...(await measureSelectors(page, "/portfolio", [
          ".nav-link:nth-child(1)",
          ".nav-link:nth-child(2)",
          ".nav-lang-btn",
          ".info-photo-contact-action",
          ".footer-contact-link[href^='mailto:']",
          ".footer-contact-link[href^='tel:']",
        ])),
        ...(await measureSelectors(page, "/", [".prelude-enter-control"])),
        ...(await measureSelectors(page, "/entry", [".cover-enter-link"])),
        ...(await measureSelectors(page, "/project/whelk", [".project-taskbar-back"])),
      };
      for (const [selector, rect] of Object.entries(measured)) {
        assert.ok(rect.height >= 44, `${selector} is only ${rect.height}px tall at ${viewport.width}px`);
      }
      targets[`${viewport.width}x${viewport.height}`] = measured;
    }

    const folders = {};
    for (const viewport of [
      { width: 390, height: 844, touch: true },
      { width: 768, height: 1024, touch: true },
      { width: 1024, height: 768, touch: true },
    ]) {
      await page.emulate(viewport);
      await page.navigate("/portfolio");
      await page.evaluate(`document.querySelector(".project").scrollIntoView({ block: "center" })`);
      for (let attempt = 0; attempt < 40; attempt += 1) {
        const settled = await page.evaluate(`(() => {
          const open = document.querySelector(".project-inline-folder.is-open");
          return open && [...open.querySelectorAll(".project-inline-folder-card")]
            .every((card) => getComputedStyle(card).opacity === "1");
        })()`);
        if (settled) break;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      const folder = await page.evaluate(`(() => {
        const roundRect = ${roundRectScript};
        const open = document.querySelector(".project-inline-folder.is-open");
        if (!open) throw new Error("No touch-activated folder is open");
        return {
          viewport: { width: innerWidth, height: innerHeight },
          cards: [...open.querySelectorAll(".project-inline-folder-card")].map((card) => ({
            className: card.className,
            opacity: getComputedStyle(card).opacity,
            rect: roundRect(card),
          })),
        };
      })()`);
      assert.equal(folder.cards.length, 3);
      for (const card of folder.cards) {
        assert.equal(card.opacity, "1", `${card.className} must be fully opaque`);
        assert.ok(card.rect.left >= 0, `${card.className} crosses the left viewport edge`);
        assert.ok(card.rect.right <= folder.viewport.width, `${card.className} crosses the right viewport edge`);
        assert.ok(card.rect.top >= 0, `${card.className} crosses the top viewport edge`);
        assert.ok(card.rect.bottom <= folder.viewport.height, `${card.className} crosses the bottom viewport edge`);
      }
      folders[`${viewport.width}x${viewport.height}`] = folder;
    }

    const infoLayouts = [];
    for (const width of [899, 900]) {
      await page.emulate({ width, height: 700, touch: false });
      await page.navigate("/portfolio");
      infoLayouts.push(await page.evaluate(`(() => {
        const layout = document.querySelector(".info-layout");
        const photo = document.querySelector(".info-photo-wrap");
        const layoutStyle = getComputedStyle(layout);
        const photoStyle = getComputedStyle(photo);
        return {
          width: innerWidth,
          columns: layoutStyle.gridTemplateColumns,
          photoPosition: photoStyle.position,
          photoWidth: photo.getBoundingClientRect().width,
        };
      })()`));
    }
    assert.equal(infoLayouts[0].photoPosition, "static", "899px must retain the portrait composition");
    assert.equal(infoLayouts[1].photoPosition, "sticky", "900px must use the landscape sticky composition");
    assert.ok(Math.abs(infoLayouts[1].photoWidth - 300) < 0.1, "900px photo column must be 300px");

    process.stdout.write(`${JSON.stringify({ overflow, targets, folders, infoLayouts }, null, 2)}\n`);
  } finally {
    page?.close();
    if (browser && targetId) {
      await browser.send("Target.closeTarget", { targetId }).catch(() => undefined);
    }
    if (browser) {
      await browser.send("Browser.close").catch(() => undefined);
      browser.close();
    }
    if (chrome.exitCode == null && !childMonitor.spawnError) {
      chrome.kill("SIGTERM");
    }
    await childMonitor.waitForStop();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        await rm(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
        break;
      } catch (error) {
        if (attempt === 4) throw error;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }
}

await main();
