import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("SiteFooter exposes the editorial outro structure and semantic contact links", async () => {
  const footer = await read("../src/components/SiteFooter.jsx");

  assert.match(footer, /function SiteFooter\(\{ editorial = false, onActiveChange \}\)/);
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

test("Home hides the navigation from the footer visibility callback", async () => {
  const home = await read("../src/pages/Home.jsx");

  assert.match(home, /const \[outroActive, setOutroActive\] = useState\(false\)/);
  assert.match(home, /className=\{`nav \$\{outroActive \? "is-outro-hidden" : ""\}`\}/);
  assert.match(home, /<SiteFooter editorial onActiveChange=\{setOutroActive\} \/>/);
});

test("outro CSS preserves the palette and implements editorial responsive behavior", async () => {
  const css = await read("../src/styles.css");

  assert.match(css, /\.nav\.is-outro-hidden\s*\{/);
  assert.match(css, /\.footer-observer\s*\{/);
  assert.match(css, /\.footer-info\s*\{/);
  assert.match(css, /\.footer-contact-link:focus-visible\s*\{/);
  assert.match(css, /\.footer-wordmark\s*\{[^}]*font-family:"Climate Crisis"/s);
  assert.match(css, /@media\(max-width:800px\)[\s\S]*\.footer-info\s*\{[^}]*grid-template-columns:1fr/s);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)[\s\S]*\.footer-info/s);
});

test("only Home opts into the long editorial footer", async () => {
  const footer = await read("../src/components/SiteFooter.jsx");
  const home = await read("../src/pages/Home.jsx");
  const projectChrome = await read("../src/components/ProjectChrome.jsx");

  assert.match(footer, /function SiteFooter\(\{ editorial = false, onActiveChange \}\)/);
  assert.match(home, /<SiteFooter editorial onActiveChange=\{setOutroActive\} \/>/);
  assert.match(projectChrome, /<SiteFooter \/>/);
  assert.doesNotMatch(projectChrome, /<SiteFooter editorial/);
});

test("the wordmark leads directly into a later-revealed information stage", async () => {
  const footer = await read("../src/components/SiteFooter.jsx");
  const css = await read("../src/styles.css");

  assert.ok(
    footer.indexOf('className="footer-wordmark"') < footer.indexOf('className="footer-info-stage"'),
    "wordmark should render before the contact and About stage",
  );
  assert.match(footer, /ref=\{observerRef\} className="footer-info-stage"/);
  assert.match(css, /\.footer-wordmark\{[^}]*width:min\(50%,620px\)[^}]*font-size:clamp\(3rem,7\.2vw,6\.4rem\)/s);
  assert.match(css, /\.footer-info-stage\{[^}]*margin-top:clamp\(10rem,28vh,18rem\)/s);
  assert.match(css, /\.work\{[^}]*padding:0 var\(--pad\) 0/);
});
