import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("work-return links preserve the project entry route", async () => {
  const [detail, wechat] = await Promise.all([
    readFile(new URL("../src/components/ProjectDetail.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/pages/Wechat.jsx", import.meta.url), "utf8"),
  ]);

  assert.match(detail, /to="\/entry"/);
  assert.match(wechat, /to="\/entry"/);
});
