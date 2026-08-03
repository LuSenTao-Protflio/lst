import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("info reveal is scroll-triggered once and types each translated row", async () => {
  const home = await readFile(new URL("../src/pages/Home.jsx", import.meta.url), "utf8");

  assert.match(home, /useInView\(infoRef,\s*\{\s*once:\s*true,\s*amount:\s*0\.3\s*\}\)/);
  assert.match(home, /className=\{`info-layout\$\{infoActive \? " is-active" : ""\}`\}/);
  assert.match(home, /<TextType[\s\S]*active=\{infoActive\}[\s\S]*cursorCharacter="_"/);
  assert.match(home, /Array\.from\(row\.value\)\.length \* infoTypingSpeed/);
});

test("info reveal preserves layout, adapts motion on mobile, and honors reduced motion", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /\.info-photo-wrap\{[^}]*transform:translate3d\(min\(30vw,420px\),0,0\) scale\(1\.025\)[^}]*transition:transform 1\.9s/);
  assert.match(styles, /\.info-layout\.is-active \.info-photo-wrap\{[^}]*transform:translate3d\(0,0,0\) scale\(1\)/);
  assert.match(styles, /\.info-row\{[^}]*opacity:0[^}]*transform:translate3d\(0,10px,0\)[^}]*transition:opacity/);
  assert.match(styles, /\.info-layout\.is-active \.info-row\{[^}]*opacity:1[^}]*transform:translate3d\(0,0,0\)[^}]*border-bottom-color/);
  assert.match(styles, /\.info-photo-wordmark\{[^}]*font-size:clamp\(1\.45rem,2\.35vw,2\.45rem\)/);
  assert.match(styles, /@media\(max-width:599px\)\{[\s\S]*\.info-photo-wrap\{[^}]*transform:translate3d\(0,24px,0\) scale\(\.985\)/);
  assert.match(styles, /@media\(prefers-reduced-motion:reduce\)\{[\s\S]*\.info-photo-wrap,\.info-layout\.is-active \.info-photo-wrap\{[^}]*transform:none!important[^}]*opacity:1!important/);
  assert.match(styles, /\.text-type-reserve\{visibility:hidden/);
});

test("TextType clears its timers and exposes the complete text to assistive technology", async () => {
  const component = await readFile(new URL("../src/components/TextType.jsx", import.meta.url), "utf8");

  assert.match(component, /window\.clearTimeout\(startTimer\)/);
  assert.match(component, /window\.clearTimeout\(typingTimer\)/);
  assert.match(component, /aria-label=\{content\}/);
  assert.match(component, /className="text-type-reserve"/);
});
