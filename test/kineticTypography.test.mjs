import test from "node:test";
import assert from "node:assert/strict";
import { calculateGlyphVariation } from "../src/utils/kineticTypography.js";

test("keeps distant glyphs at the TextPressure resting axes", () => {
  assert.deepEqual(calculateGlyphVariation(800, 360), { weight: 100, width: 25, italic: 0 });
});

test("reaches the TextPressure axis maxima at the cursor", () => {
  assert.deepEqual(calculateGlyphVariation(0, 360), { weight: 900, width: 151, italic: 1 });
});

test("interpolates every axis for nearby glyphs", () => {
  const variation = calculateGlyphVariation(90, 360);

  assert.ok(variation.weight > 100 && variation.weight < 900);
  assert.ok(variation.width > 25 && variation.width < 151);
  assert.ok(variation.italic > 0 && variation.italic < 1);
});
