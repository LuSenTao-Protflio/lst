import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("daily reading festival is available as an independent review page", async () => {
  const [app, page] = await Promise.all([
    readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/pages/DailyReading.jsx", import.meta.url), "utf8"),
  ]);

  assert.match(app, /path="\/daily-reading"/);
  assert.match(app, /to="\/project\/daily-reading"/);
  assert.match(page, /天安云谷（日常）读书节/);
  assert.match(page, /视觉设计与落地执行/);
  assert.match(page, /以书换咖/);
  assert.match(page, /以书换书/);
  assert.match(page, /以书换蔬/);
  assert.match(page, /以书换植/);
});
