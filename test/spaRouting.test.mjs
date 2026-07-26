import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const vercelConfig = JSON.parse(readFileSync("vercel.json", "utf8"));
const fallbackPage = readFileSync("public/404.html", "utf8");

test("Vercel serves client-side routes through index.html", () => {
  const rewrites = new Map(
    vercelConfig.rewrites.map(({ source, destination }) => [source, destination]),
  );

  assert.equal(rewrites.get("/project/:path*"), "/index.html");
  assert.equal(rewrites.get("/portfolio"), "/index.html");
  assert.equal(rewrites.get("/entry"), "/index.html");
});

test("404 fallback preserves root-hosted paths without redirecting to /lst", () => {
  assert.match(fallbackPage, /window\.location\.pathname\.slice\(1\)/);
  assert.match(fallbackPage, /var base = isGithubPages \? githubBase : "\/"/);
  assert.doesNotMatch(fallbackPage, /var base = "\/lst\/"/);
});
