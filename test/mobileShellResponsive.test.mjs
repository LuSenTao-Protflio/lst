import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

function mediaBlock(styles, query) {
  const marker = `@media(${query}){`;
  const start = styles.indexOf(marker);
  assert.notEqual(start, -1, `missing @media(${query})`);

  let depth = 0;
  for (let index = start + marker.length - 1; index < styles.length; index += 1) {
    if (styles[index] === "{") depth += 1;
    if (styles[index] === "}") depth -= 1;
    if (depth === 0) return styles.slice(start + marker.length, index);
  }

  throw new Error(`unterminated @media(${query})`);
}

test("phone shell uses safe viewport sizing and touch targets", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const phone = mediaBlock(styles, "max-width:599px");

  assert.match(phone, /\.nav\{[^}]*width:calc\(100% - 24px\)[^}]*min-height:48px/);
  assert.match(phone, /\.nav-link,\s*\.nav-lang-btn\{[^}]*min-height:44px/);
  assert.match(phone, /\.nav-logo\{[^}]*font-size:\.72rem[^}]*flex:0 1 auto/);
  assert.match(phone, /\.nav-links\{[^}]*gap:\.35rem[^}]*flex:0 0 auto/);
  assert.match(phone, /\.nav-lang-btn\{[^}]*min-width:44px[^}]*flex:0 0 auto/);
  assert.match(phone, /\.hero\{[^}]*min-height:100svh[^}]*height:auto/);
  assert.match(phone, /\.hero-title\{[^}]*font-size:clamp\(3\.25rem,17vw,4\.75rem\)/);
});

test("profile changes from centered phone layout to portrait-tablet columns", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const phone = mediaBlock(styles, "max-width:599px");
  const tablet = mediaBlock(styles, "min-width:600px) and (max-width:899px");

  assert.match(phone, /\.info-photo-wrap\{[^}]*width:min\(100%,320px\)[^}]*margin-inline:auto/);
  assert.match(phone, /\.info-row\{[^}]*display:grid[^}]*grid-template-columns:1fr/);
  assert.match(tablet, /\.info-layout\{[^}]*grid-template-columns:minmax\(220px,240px\) minmax\(0,1fr\)/);
});
