import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("SiteFooter exposes the editorial outro structure and semantic contact links", async () => {
  const footer = await read("../src/components/SiteFooter.jsx");

  assert.match(footer, /function SiteFooter\(\{ onActiveChange \}\)/);
  assert.match(footer, /id="contact"/);
  assert.match(footer, /className="footer-observer"/);
  assert.match(footer, /className="footer-info"/);
  assert.match(footer, /className="footer-wordmark"/);
  assert.match(footer, /href="mailto:sentaolu371@gmail\.com"/);
  assert.match(footer, /href="tel:15875591020"/);
  assert.match(footer, />LUSENTAO</);
});

test("outro visibility uses an intersection observer and no continuous window scroll listener", async () => {
  const footer = await read("../src/components/SiteFooter.jsx");

  assert.match(footer, /IntersectionObserver/);
  assert.match(footer, /onActiveChange\?\.\(/);
  assert.doesNotMatch(footer, /window\.addEventListener\(["']scroll["']/);
});
