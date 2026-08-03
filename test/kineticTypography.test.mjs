import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { calculateGlyphVariation } from "../src/utils/kineticTypography.js";

test("fades distant glyphs to the TextPressure resting axes", () => {
  assert.deepEqual(calculateGlyphVariation(800, 360), { weight: 100, width: 25, alpha: 0 });
});

test("reaches full opacity at the cursor", () => {
  assert.deepEqual(calculateGlyphVariation(0, 360), { weight: 900, width: 151, alpha: 1 });
});

test("interpolates every axis for nearby glyphs", () => {
  const variation = calculateGlyphVariation(90, 360);

  assert.ok(variation.weight > 100 && variation.weight < 900);
  assert.ok(variation.width > 25 && variation.width < 151);
  assert.ok(variation.alpha > 0 && variation.alpha < 1);
});

test("prelude renders a single TextPressure portfolio title", async () => {
  const source = await readFile(new URL("../src/pages/Prelude.jsx", import.meta.url), "utf8");

  assert.match(source, /text="portfolio"/);
  assert.doesNotMatch(source, /GRAPHIC|DESIGN/);
});

test("prelude configures the supplied TextPressure props", async () => {
  const source = await readFile(new URL("../src/pages/Prelude.jsx", import.meta.url), "utf8");

  assert.match(source, /text="portfolio"/);
  assert.match(source, /alpha=\{false\}/);
  assert.match(source, /italic=\{false\}/);
  assert.match(source, /textColor="#E6FF1A"/);
});

test("TextPressure retains the supplied cursor and axis behavior", async () => {
  const source = await readFile(new URL("../src/components/TextPressure.jsx", import.meta.url), "utf8");

  assert.match(source, /const getAttr/);
  assert.match(source, /window\.addEventListener\('mousemove'/);
  assert.match(source, /requestAnimationFrame\(animate\)/);
  assert.match(source, /getAttr\(d, maxDist, 5, 200\)/);
});

test("TextPressure uses the registered local variable font family", async () => {
  const source = await readFile(new URL("../src/components/TextPressure.jsx", import.meta.url), "utf8");

  assert.match(source, /fontFamily: "Roboto Flex Variable"/);
});

test("footer contact links share the editorial contact hierarchy", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const rule = styles.match(/\.footer-contact-link\{[^}]*\}/)?.[0] ?? "";

  assert.match(rule, /font-size:clamp\(1\.35rem,2\.65vw,2\.6rem\)/);
  assert.match(rule, /color:var\(--fg\)/);
  assert.match(rule, /min-height:44px/);
});
