import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("directory separates fine-pointer hover from touch feedback", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media\(hover:hover\) and \(pointer:fine\)[\s\S]*\.dir-row:hover/);
  assert.match(styles, /@media\(hover:none\),\(pointer:coarse\)[\s\S]*\.dir-row:active/);
  assert.match(styles, /\.dir-row:focus-visible/);
});

test("phone projects use a 1 plus 2 preview grid and open folders reach full opacity", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media\(max-width:599px\)[\s\S]*\.project-grid\{[^}]*display:grid[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(styles, /@media\(max-width:599px\)[\s\S]*\.grid-item:first-child\{[^}]*grid-column:1\/-1/);
  assert.match(styles, /\.project-inline-folder\.is-open \.project-inline-folder-card\{[^}]*opacity:1/);
});

test("portrait tablet keeps all three project images on one row", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media\(min-width:600px\) and \(max-width:899px\)[\s\S]*\.project-grid\{[^}]*display:grid[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
});
