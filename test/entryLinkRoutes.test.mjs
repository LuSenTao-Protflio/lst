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

test("entry project rows are static previews without project navigation", async () => {
  const reveal = await readFile(
    new URL("../src/components/HoverProjectReveal.jsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(reveal, /import \{ Link \} from "react-router-dom"/);
  assert.doesNotMatch(reveal, /to=\{`\/project\/\$\{project\.id\}`\}/);
  assert.match(reveal, /className=\{`cover-project-row/);
});

test("entry header repeats the portfolio identity as static text", async () => {
  const cover = await readFile(
    new URL("../src/components/InteractiveCover.jsx", import.meta.url),
    "utf8",
  );

  assert.match(cover, /<header className="cover-meta-grid"/);
  assert.match(cover, />Lusentao<\/span>/);
  assert.match(cover, />深圳大学<\/span>/);
  assert.match(cover, />视觉传达设计<\/span>/);
  assert.doesNotMatch(cover, /cover-text-nav-item/);
});
