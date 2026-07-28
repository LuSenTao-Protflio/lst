import assert from "node:assert/strict";
import { access, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4178";
const debugPort = Number(process.env.CHROME_DEBUG_PORT || 9333);
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

class CdpPage {
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
    await this.send("Page.enable");
    await this.send("Runtime.enable");
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
    await this.send("Page.navigate", { url: new URL(path, baseUrl).href });
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const ready = await this.evaluate(
        `document.readyState === "complete" && document.querySelector("#root")?.children.length > 0`,
      ).catch(() => false);
      if (ready) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw new Error(`Timed out rendering ${path}`);
  }

  close() {
    this.socket.close();
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
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ], { stdio: "ignore" });

  let page;
  try {
    await waitForUrl(`${baseUrl}/`);
    const browserInfo = await waitForJson(`http://127.0.0.1:${debugPort}/json/version`);
    const targetResponse = await fetch(
      `http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(baseUrl)}`,
      { method: "PUT" },
    );
    assert.equal(targetResponse.ok, true, "Chrome must create a page target");
    const target = await targetResponse.json();
    page = new CdpPage(target.webSocketDebuggerUrl || browserInfo.webSocketDebuggerUrl);
    await page.connect();

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
          ".footer-email:not(.footer-phone)",
          ".footer-phone",
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
    if (chrome.exitCode == null) {
      chrome.kill("SIGTERM");
      await new Promise((resolve) => chrome.once("exit", resolve));
    }
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
