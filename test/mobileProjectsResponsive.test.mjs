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

function withoutMediaBlocks(styles) {
  let outside = "";
  let cursor = 0;
  let start = styles.indexOf("@media(");

  while (start !== -1) {
    outside += styles.slice(cursor, start);
    const openingBrace = styles.indexOf("{", start);
    assert.notEqual(openingBrace, -1, "unterminated media query");

    let depth = 0;
    let end = -1;
    for (let index = openingBrace; index < styles.length; index += 1) {
      if (styles[index] === "{") depth += 1;
      if (styles[index] === "}") depth -= 1;
      if (depth === 0) {
        end = index;
        break;
      }
    }

    assert.notEqual(end, -1, "unterminated media block");
    cursor = end + 1;
    start = styles.indexOf("@media(", cursor);
  }

  return outside + styles.slice(cursor);
}

test("directory separates fine-pointer hover from touch feedback", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const finePointer = mediaBlock(styles, "hover:hover) and (pointer:fine");
  const coarsePointer = mediaBlock(styles, "hover:none),(pointer:coarse");
  const outsideMedia = withoutMediaBlocks(styles);

  assert.match(finePointer, /\.dir-row:hover\{[^}]*background:var\(--surface-raised\)/);
  assert.match(finePointer, /\.project-summary:hover \.project-inline-folder-card\{[^}]*opacity:1/);
  assert.match(coarsePointer, /\.dir-row:active\{[^}]*background:var\(--surface-raised\)/);
  assert.match(coarsePointer, /\.dir-row:active \.dir-row-title\{/);
  assert.doesNotMatch(outsideMedia, /\.dir-row:hover/);
  assert.doesNotMatch(outsideMedia, /\.project-summary:hover/);
  assert.match(styles, /\.dir-row:focus-visible/);
});

test("phone projects use a 1 plus 2 preview grid and open folders reach full opacity", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const phone = mediaBlock(styles, "max-width:599px");

  assert.match(phone, /\.project-grid\{[^}]*display:grid[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(phone, /\.grid-item:first-child\{[^}]*grid-column:1\/-1/);
  assert.match(styles, /\.project-inline-folder\.is-open \.project-inline-folder-card\{[^}]*opacity:1/);
});

test("portrait tablet keeps all three project images on one row", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const tablet = mediaBlock(styles, "min-width:600px) and (max-width:899px");

  assert.match(tablet, /\.project-grid\{[^}]*display:grid[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
});
