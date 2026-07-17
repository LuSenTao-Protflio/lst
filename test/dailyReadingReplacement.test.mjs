import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("daily reading festival replaces MetaKeys as project 02", async () => {
  const [projects, detail, translations, app, styles] = await Promise.all([
    readFile(new URL("../src/data/projects.js", import.meta.url), "utf8"),
    readFile(new URL("../src/components/ProjectDetail.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/i18n.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
  ]);

  assert.match(projects, /id: "daily-reading"/);
  assert.doesNotMatch(projects, /id: "metakeys"/);
  assert.match(detail, /project\.id === "daily-reading"/);
  assert.match(translations, /"daily-reading": \{/);
  assert.match(app, /to="\/project\/daily-reading"/);
  assert.match(styles, /\.daily-reading-page\{[^}]*background:var\(--bg\)/);
});
