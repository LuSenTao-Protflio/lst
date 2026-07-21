import test from "node:test";
import assert from "node:assert/strict";
import { shouldReducePortfolioMotion } from "../src/config/motion.js";

test("keeps full portfolio motion when Windows requests reduced motion", () => {
  assert.equal(shouldReducePortfolioMotion(true, true), false);
});

test("keeps full portfolio motion when the system allows motion", () => {
  assert.equal(shouldReducePortfolioMotion(false, true), false);
});

test("can follow the system preference when full motion is disabled", () => {
  assert.equal(shouldReducePortfolioMotion(true, false), true);
  assert.equal(shouldReducePortfolioMotion(false, false), false);
});
