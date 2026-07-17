import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("portfolio curation uses approved order and routed image sets", async () => {
  const [projects, home, folder, woof, translations] = await Promise.all([
    readFile(new URL("../src/data/projects.js", import.meta.url), "utf8"),
    readFile(new URL("../src/pages/Home.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/ProjectFolderReveal.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/WoofProjectDetail.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/i18n.jsx", import.meta.url), "utf8"),
  ]);

  const ids = [...projects.matchAll(/\n\s{4}id: "([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(ids, ["whelk", "daily-reading", "woof", "memory", "gala", "storyteller", "misc"]);
  assert.match(projects, /previewImages:/);
  assert.match(projects, /detailImages:/);
  assert.match(projects, /whelk-main-preview\.jpg/);
  assert.match(projects, /daily-preview-illustration\.jpg/);
  assert.match(projects, /daily-preview-system\.jpg/);

  for (const name of [
    "research-demographics.jpg",
    "research-interviews.jpg",
    "research-functions.jpg",
    "research-feature-system.jpg",
    "research-moodboard.jpg",
  ]) {
    assert.match(projects, new RegExp(name));
  }

  assert.match(home, /p\.previewImages \|\| p\.images/);
  assert.match(folder, /project\.previewImages \|\| project\.images/);
  assert.match(woof, /project\.detailImages \|\| project\.images/);
  assert.match(translations, /nextId: "daily-reading"/);
});
