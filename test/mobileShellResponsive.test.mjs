import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("phone shell uses safe viewport sizing and touch targets", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media\(max-width:599px\)/);
  assert.match(styles, /\.nav\{[^}]*width:calc\(100% - 24px\)[^}]*min-height:48px/);
  assert.match(styles, /\.nav-link,\s*\.nav-lang-btn\{[^}]*min-height:44px/);
  assert.match(styles, /\.hero\{[^}]*min-height:100svh[^}]*height:auto/);
  assert.match(styles, /\.hero-title\{[^}]*font-size:clamp\(3\.25rem,17vw,4\.75rem\)/);
});

test("profile changes from centered phone layout to portrait-tablet columns", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media\(max-width:599px\)[\s\S]*\.info-photo-wrap\{[^}]*width:min\(100%,320px\)[^}]*margin-inline:auto/);
  assert.match(styles, /@media\(max-width:599px\)[\s\S]*\.info-row\{[^}]*display:grid[^}]*grid-template-columns:1fr/);
  assert.match(styles, /@media\(min-width:600px\) and \(max-width:899px\)[\s\S]*\.info-layout\{[^}]*grid-template-columns:minmax\(220px,240px\) minmax\(0,1fr\)/);
});
