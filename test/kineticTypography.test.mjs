import test from "node:test";
import assert from "node:assert/strict";
import { calculateGlyphVariation } from "../src/utils/kineticTypography.js";

test("keeps distant glyphs at the resting variable-font axes", () => {
  assert.deepEqual(calculateGlyphVariation(320), { weight: 420, width: 88, italic: 0 });
});

test("emphasizes glyphs directly under the pointer", () => {
  assert.deepEqual(calculateGlyphVariation(0), { weight: 900, width: 140, italic: 10 });
});
