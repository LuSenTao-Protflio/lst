import test from "node:test";
import assert from "node:assert/strict";
import { shouldAdvanceFromKey, shouldAdvanceFromWheel } from "../src/utils/preludeNavigation.js";

test("advances only for deliberate downward wheel input", () => {
  assert.equal(shouldAdvanceFromWheel(17), false);
  assert.equal(shouldAdvanceFromWheel(18), true);
  assert.equal(shouldAdvanceFromWheel(-80), false);
});

test("accepts Down Arrow outside editable controls", () => {
  assert.equal(shouldAdvanceFromKey("ArrowDown", "DIV"), true);
  assert.equal(shouldAdvanceFromKey("ArrowDown", "INPUT"), false);
  assert.equal(shouldAdvanceFromKey("Enter", "DIV"), false);
});
