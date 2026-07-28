import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

test("Sites build preserves hosting metadata in the deployable artifact", async () => {
  const fixtureRoot = await mkdtemp(`${tmpdir()}/portfolio-sites-build-`);
  const scriptPath = new URL("../scripts/prepare-sites-worker.mjs", import.meta.url);
  const hostingMetadata = '{\n  "project_id": "fixture-project"\n}\n';

  try {
    await Promise.all([
      mkdir(`${fixtureRoot}/.openai`, { recursive: true }),
      mkdir(`${fixtureRoot}/dist`, { recursive: true }),
    ]);
    await Promise.all([
      writeFile(`${fixtureRoot}/.openai/hosting.json`, hostingMetadata),
      writeFile(`${fixtureRoot}/dist/index.html`, "<!doctype html>"),
    ]);

    await execFileAsync(process.execPath, [scriptPath.pathname], { cwd: fixtureRoot });

    assert.equal(
      await readFile(`${fixtureRoot}/dist/.openai/hosting.json`, "utf8"),
      hostingMetadata,
    );
    assert.equal(
      await readFile(`${fixtureRoot}/dist/client/index.html`, "utf8"),
      "<!doctype html>",
    );
    assert.match(
      await readFile(`${fixtureRoot}/dist/server/index.js`, "utf8"),
      /env\.ASSETS\.fetch/,
    );
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});
