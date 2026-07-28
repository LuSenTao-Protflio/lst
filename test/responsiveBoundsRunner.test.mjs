import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";

function listen(server, port) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function runSelfTest(env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["scripts/check-responsive-bounds.mjs", "--self-test"],
      {
        cwd: new URL("..", import.meta.url),
        env: { ...process.env, ...env },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve({ code, signal, stdout, stderr }));
  });
}

test("bounds runner owns an isolated Chrome endpoint when port 9333 is occupied", async () => {
  let externalRequests = 0;
  const externalEndpoint = createServer((request, response) => {
    externalRequests += 1;
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({
      id: "external-target",
      webSocketDebuggerUrl: "ws://127.0.0.1:9333/external",
    }));
  });
  await listen(externalEndpoint, 9333);

  try {
    const result = await runSelfTest();
    assert.equal(
      result.code,
      0,
      `self-test exited ${result.code ?? result.signal}\n${result.stderr}`,
    );
    assert.match(result.stdout, /profileOwned=true/);
    assert.equal(externalRequests, 0, "runner must not inspect or modify the external endpoint");
  } finally {
    await close(externalEndpoint);
  }
});

test("bounds runner waits for the requested URL instead of accepting the old document", async () => {
  const slowPage = createServer((request, response) => {
    setTimeout(() => {
      response.writeHead(200, { "content-type": "text/html" });
      response.end("<main id=\"root\"><p>new document</p></main>");
    }, 600);
  });
  await listen(slowPage, 0);
  const address = slowPage.address();
  assert.ok(address && typeof address === "object");
  const expectedUrl = `http://127.0.0.1:${address.port}/slow`;

  try {
    const result = await runSelfTest({
      RESPONSIVE_BOUNDS_NAVIGATION_SELF_TEST_URL: expectedUrl,
    });
    assert.equal(
      result.code,
      0,
      `navigation self-test exited ${result.code ?? result.signal}\n${result.stderr}`,
    );
    assert.match(result.stdout, new RegExp(`navigationUrl=${expectedUrl.replaceAll(".", "\\.")}`));
  } finally {
    await close(slowPage);
  }
});
