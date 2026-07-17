import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("WHELK interleaves five physical application images", async () => {
  const [projects, detail, styles] = await Promise.all([
    readFile(new URL("../src/data/projects.js", import.meta.url), "utf8"),
    readFile(new URL("../src/components/EditorialProjectDetail.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
  ]);

  for (const name of ["wash-label.jpg", "rug.jpg", "fabric-bag.jpg", "charm.jpg", "mugs.jpg"]) {
    assert.match(projects, new RegExp(name));
  }
  assert.match(projects, /storyLayout:/);
  assert.match(detail, /project\.storyLayout/);
  assert.match(styles, /\.editorial-story-portrait/);
});
