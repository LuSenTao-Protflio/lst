import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

function mediaBlock(styles, query) {
  const marker = `@media(${query}){`;
  const blocks = [];
  let start = styles.indexOf(marker);

  while (start !== -1) {
    let depth = 0;
    let end = -1;
    for (let index = start + marker.length - 1; index < styles.length; index += 1) {
      if (styles[index] === "{") depth += 1;
      if (styles[index] === "}") depth -= 1;
      if (depth === 0) {
        end = index;
        break;
      }
    }

    assert.notEqual(end, -1, `unterminated @media(${query})`);
    blocks.push(styles.slice(start + marker.length, end));
    start = styles.indexOf(marker, end + 1);
  }

  assert.ok(blocks.length > 0, `missing @media(${query})`);
  return blocks.join("\n");
}

test("phone shell uses safe viewport sizing, fitted hero copy, and touch targets", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const phone = mediaBlock(styles, "max-width:599px");

  assert.match(phone, /\.nav\{[^}]*width:calc\(100% - 24px\)[^}]*min-height:48px/);
  assert.match(phone, /\.nav-link,\s*\.nav-lang-btn\{[^}]*min-height:44px/);
  assert.match(phone, /\.nav-logo\{[^}]*font-size:\.72rem[^}]*flex:0 1 auto/);
  assert.match(phone, /\.nav-links\{[^}]*gap:\.35rem[^}]*flex:0 0 auto/);
  assert.match(phone, /\.nav-lang-btn\{[^}]*min-width:44px[^}]*flex:0 0 auto/);
  assert.match(phone, /\.hero\{[^}]*min-height:100svh[^}]*height:auto/);
  assert.match(phone, /\.hero-title\{[^}]*font-size:clamp\(3\.25rem,17vw,4\.75rem\)/);
  assert.match(phone, /\.hero-title-en-display\{[^}]*font-size:clamp\(2\.75rem,14vw,4\.75rem\)/);
});

test("profile changes from centered phone layout to portrait-tablet columns", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const phone = mediaBlock(styles, "max-width:599px");
  const tablet = mediaBlock(styles, "min-width:600px) and (max-width:899px");

  assert.match(phone, /\.info-photo-wrap\{[^}]*width:min\(100%,320px\)[^}]*margin-inline:auto/);
  assert.match(phone, /\.info-row\{[^}]*display:grid[^}]*grid-template-columns:1fr/);
  assert.match(tablet, /\.info-layout\{[^}]*grid-template-columns:minmax\(220px,240px\) minmax\(0,1fr\)/);
});

test("coarse pointers keep every primary shell action at least 44px tall", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const coarsePointer = mediaBlock(styles, "hover:none),(pointer:coarse");

  assert.match(
    coarsePointer,
    /\.nav-link,\.nav-lang-btn,\.project-taskbar-back,\.prelude-enter-control,\.cover-enter-link,\.info-photo-contact-action,\.footer-email\{[^}]*min-height:44px/,
  );
  assert.match(
    coarsePointer,
    /\.nav-link,\.project-taskbar-back,\.footer-email\{[^}]*display:inline-flex[^}]*align-items:center/,
  );
  assert.match(
    coarsePointer,
    /\.nav-lang-btn,\.prelude-enter-control\{[^}]*min-width:44px/,
  );
});

test("the portrait profile override ends before the 900px landscape boundary", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const portrait = mediaBlock(styles, "max-width:899px");

  assert.doesNotMatch(styles, /@media\(max-width:900px\)/);
  assert.match(portrait, /\.info-layout\{[^}]*grid-template-columns:1fr/);
  assert.match(portrait, /\.info-photo-wrap\{[^}]*position:static[^}]*max-width:260px/);
});
