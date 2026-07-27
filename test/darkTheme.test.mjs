import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const styles = readFileSync("src/styles.css", "utf8");

test("portfolio surfaces use the dark theme tokens", () => {
  assert.match(styles, /--bg:\s*rgba\(16,18,13,\.58\)/);
  assert.match(styles, /--fg:\s*#fffdf5/);
  assert.match(styles, /--surface:\s*rgba\(25,28,20,\.92\)/);
  assert.match(styles, /\.work\{[^}]*background:var\(--bg\);color:var\(--fg\)/);
  assert.match(styles, /\.directory\{[^}]*background:var\(--bg\);color:var\(--fg\)/);
  assert.match(styles, /body::before\{[^}]*animation:ambient-hero-drift/);
});

test("dark content keeps readable muted text and image frames", () => {
  assert.match(styles, /--muted:\s*rgba\(255,253,245,\.58\)/);
  assert.match(styles, /\.detail-tags span\{[^}]*color:var\(--fg\)/);
  assert.doesNotMatch(styles, /daily-reading-(?:system-image|image-window)[^{]*\{[^}]*background:#ece9df/);
  assert.match(styles, /\.narrative-card\{background:var\(--surface\);border:1px solid var\(--line\)/);
});
