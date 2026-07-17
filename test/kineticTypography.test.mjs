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

test("prelude renders a single PORTFOLIO title", async () => {
  const source = await readFile(new URL("../src/pages/Prelude.jsx", import.meta.url), "utf8");

  assert.match(source, /text="PORTFOLIO"/);
  assert.doesNotMatch(source, /GRAPHIC|DESIGN/);
});

test("title emits alpha without an italic axis", async () => {
  const source = await readFile(new URL("../src/components/KineticPortfolioTitle.jsx", import.meta.url), "utf8");

  assert.match(source, /glyph\.style\.opacity/);
  assert.doesNotMatch(source, /'ital'/);
});

test("contact glass uses compact yellow pill geometry", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const rule = styles.match(/\.info-photo-contact-card\{[^}]*\}/)?.[0] ?? "";

  assert.match(rule, /width:76%/);
  assert.match(rule, /border-radius:999px/);
  assert.match(rule, /230,255,26/);
});
