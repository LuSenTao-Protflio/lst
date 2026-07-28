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

test("entry project list renders one phone-only shared touch preview", async () => {
  const source = await readFile(
    new URL("../src/components/HoverProjectReveal.jsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /useMotionValue/);
  assert.match(source, /setPointerCapture/);
  assert.match(source, /releasePointerCapture/);
  assert.match(source, /pointerType !== "touch"/);
  assert.match(source, /max-width: 599px\) and \(pointer: coarse/);
  assert.equal((source.match(/className="cover-project-touch-preview"/g) || []).length, 1);
  assert.match(source, /touchProject\.id !== "misc"/);
  assert.match(source, /className="cover-project-preview"/);
});

test("touch preview styling is isolated to the phone media block", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const phone = mediaBlock(styles, "max-width:599px");

  assert.match(phone, /\.cover-project-list\{[^}]*touch-action:none/);
  assert.match(phone, /\.cover-project-touch-preview\{[^}]*position:fixed[^}]*aspect-ratio:16\/10[^}]*pointer-events:none/);
  assert.match(phone, /\.cover-project-touch-preview img\{[^}]*object-fit:contain/);
});
