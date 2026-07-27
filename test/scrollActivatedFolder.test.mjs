import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("touch project folders activate from the viewport center without a scroll listener", async () => {
  const [home, hook] = await Promise.all([
    readFile(new URL("../src/pages/Home.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/hooks/useScrollActivatedFolder.js", import.meta.url), "utf8"),
  ]);

  assert.match(home, /useScrollActivatedFolder\(\{/);
  assert.match(home, /enabled:\s*!hoverFolders/);
  assert.match(home, /onChange:\s*setActiveFolder/);
  assert.match(home, /data-project-id=\{p\.id\}/);
  assert.match(hook, /new IntersectionObserver/);
  assert.match(hook, /rootMargin:\s*"-34% 0px -34% 0px"/);
  assert.match(hook, /observer\.disconnect\(\)/);
  assert.doesNotMatch(hook, /addEventListener\(["']scroll["']/);
});

test("the observer chooses from every project still intersecting the center band", async () => {
  const hook = await readFile(
    new URL("../src/hooks/useScrollActivatedFolder.js", import.meta.url),
    "utf8",
  );

  assert.match(hook, /const intersectingNodes = new Set\(\)/);
  assert.match(hook, /intersectingNodes\.add\(entry\.target\)/);
  assert.match(hook, /intersectingNodes\.delete\(entry\.target\)/);
  assert.match(hook, /Array\.from\(intersectingNodes\)/);
  assert.match(hook, /getBoundingClientRect\(\)/);
  assert.match(hook, /intersectingNodes\.size === 0[\s\S]*onChange\(null\)/);
  assert.match(hook, /intersectingNodes\.clear\(\)[\s\S]*observer\.disconnect\(\)/);
});

test("fine-pointer devices start with folder hovering instead of scroll activation", async () => {
  const home = await readFile(new URL("../src/pages/Home.jsx", import.meta.url), "utf8");

  assert.match(home, /useState\(\(\) => \(/);
  assert.match(home, /typeof window !== "undefined"/);
  assert.match(home, /window\.matchMedia\("\(hover: hover\) and \(pointer: fine\)"\)\.matches/);
});

test("project blocks remain first-tap detail links", async () => {
  const home = await readFile(new URL("../src/pages/Home.jsx", import.meta.url), "utf8");

  assert.match(home, /<Link[\s\S]*to=\{`\/project\/\$\{p\.id\}`\}[\s\S]*className="project-hit-area"/);
  assert.doesNotMatch(home, /preventDefault\(\)/);
});
