# LUSENTAO Ofform-Inspired Outro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the main portfolio page's compact footer with a long editorial outro that reveals contact and About information, hides the glass navigation while active, and ends with an oversized `LUSENTAO` wordmark.

**Architecture:** `SiteFooter` owns the outro markup and reports whether its information region is prominently visible through a callback. `Home` owns the fixed navigation state and passes that callback to the footer. Framer Motion handles transform and opacity reveals, while CSS owns the editorial grid, responsive collapse, focus states, and reduced-motion fallback.

**Tech Stack:** React 19, Framer Motion 12, Vite 4, CSS, Node built-in test runner

## Global Constraints

- Preserve the current charcoal, warm-white, and acid-yellow palette.
- Preserve existing routes, project content, typography assets, and the `#contact` anchor.
- Do not add dependencies, scroll locking, scroll snapping, or raw continuous `window` scroll listeners.
- Animate only opacity and transforms.
- Keep email and phone equally prominent white semantic links.
- Use the existing Climate Crisis font for `LUSENTAO`.
- Support `prefers-reduced-motion: reduce` and keyboard focus.
- Do not introduce social links, collaboration invitations, booking language, or new recruitment slogans.

---

## File Structure

- `src/components/SiteFooter.jsx`: Render the editorial outro, motion reveals, contact links, About copy, and `LUSENTAO` wordmark; report information visibility.
- `src/pages/Home.jsx`: Store outro visibility and apply the fixed navigation hidden state.
- `src/styles.css`: Define the continuous dark outro composition, contact interactions, wordmark sizing, responsive layout, nav transition, and reduced-motion rules.
- `test/editorialOutro.test.mjs`: Guard the required markup, callbacks, semantic links, nav state wiring, responsive CSS, and forbidden scroll-listener implementation.

---

### Task 1: Editorial Outro Markup and Motion

**Files:**
- Create: `test/editorialOutro.test.mjs`
- Modify: `src/components/SiteFooter.jsx`

**Interfaces:**
- Consumes: `useLanguage()` and optional prop `onActiveChange?: (active: boolean) => void`.
- Produces: `<SiteFooter onActiveChange={fn} />`, the existing `footer#contact` anchor, `.footer-observer`, `.footer-info`, `.footer-wordmark`, and semantic contact anchors.

- [ ] **Step 1: Write the failing footer structure test**

Create `test/editorialOutro.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("SiteFooter exposes the editorial outro structure and semantic contact links", async () => {
  const footer = await read("../src/components/SiteFooter.jsx");

  assert.match(footer, /function SiteFooter\(\{ onActiveChange \}\)/);
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
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test test/editorialOutro.test.mjs`

Expected: FAIL because the current footer has no observer region, visibility callback, or wordmark.

- [ ] **Step 3: Implement the footer component**

Update `src/components/SiteFooter.jsx` to:

```jsx
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../i18n";

export default function SiteFooter({ onActiveChange }) {
  const { t } = useLanguage();
  const observerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = observerRef.current;
    if (!node || !onActiveChange) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => onActiveChange?.(entry.isIntersecting),
      { threshold: 0.42 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      onActiveChange?.(false);
    };
  }, [onActiveChange]);

  const reveal = reduceMotion
    ? { initial: false, whileInView: undefined }
    : { initial: { opacity: 0, y: 36 }, whileInView: { opacity: 1, y: 0 } };

  return (
    <footer className="footer" id="contact">
      <div ref={observerRef} className="footer-observer">
        <motion.div
          className="footer-info"
          {...reveal}
          viewport={{ amount: 0.35 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="footer-contact">
            <h2 className="footer-heading">{t("footer.col1Heading")}</h2>
            <a href="mailto:sentaolu371@gmail.com" className="footer-contact-link">{t("footer.col1Email")}</a>
            <a href="tel:15875591020" className="footer-contact-link">{t("footer.col1Phone")}</a>
          </div>
          <div className="footer-about-col">
            <h2 className="footer-heading">{t("footer.col2Heading")}</h2>
            <p className="footer-about">{t("footer.col2Desc")}</p>
          </div>
        </motion.div>
        <motion.p
          className="footer-wordmark"
          aria-label="LUSENTAO"
          {...reveal}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.9, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
        >LUSENTAO</motion.p>
      </div>
    </footer>
  );
}
```

If the localized phone string contains a label or unexpected punctuation, render the visible literal `15875591020` so email and phone remain visually equal.

- [ ] **Step 4: Run the focused test**

Run: `node --test test/editorialOutro.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the component and test**

```bash
git add src/components/SiteFooter.jsx test/editorialOutro.test.mjs
git commit -m "feat: build editorial portfolio outro"
```

---

### Task 2: Connect Outro Visibility to the Glass Navigation

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `test/editorialOutro.test.mjs`

**Interfaces:**
- Consumes: `SiteFooter({ onActiveChange })` from Task 1.
- Produces: `outroActive: boolean`, `.nav.is-outro-hidden`, and `<SiteFooter onActiveChange={setOutroActive} />`.

- [ ] **Step 1: Extend the test with navigation state assertions**

Append to `test/editorialOutro.test.mjs`:

```js
test("Home hides the navigation from the footer visibility callback", async () => {
  const home = await read("../src/pages/Home.jsx");

  assert.match(home, /const \[outroActive, setOutroActive\] = useState\(false\)/);
  assert.match(home, /className=\{`nav \$\{outroActive \? "is-outro-hidden" : ""\}`\}/);
  assert.match(home, /<SiteFooter onActiveChange=\{setOutroActive\} \/>/);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test test/editorialOutro.test.mjs`

Expected: FAIL because `Home` does not yet store or render the outro state.

- [ ] **Step 3: Wire the footer callback into Home**

In `src/pages/Home.jsx`:

```jsx
const [outroActive, setOutroActive] = useState(false);
```

Change the nav opening tag to:

```jsx
<nav className={`nav ${outroActive ? "is-outro-hidden" : ""}`}>
```

Change the footer render to:

```jsx
<SiteFooter onActiveChange={setOutroActive} />
```

Do not remove or rename the existing navigation links.

- [ ] **Step 4: Run the focused test**

Run: `node --test test/editorialOutro.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the navigation state wiring**

```bash
git add src/pages/Home.jsx test/editorialOutro.test.mjs
git commit -m "feat: hide portfolio nav during outro"
```

---

### Task 3: Editorial Layout, Interaction, and Responsive Rules

**Files:**
- Modify: `src/styles.css`
- Modify: `test/editorialOutro.test.mjs`

**Interfaces:**
- Consumes: `.footer`, `.footer-observer`, `.footer-info`, `.footer-contact`, `.footer-contact-link`, `.footer-about-col`, `.footer-wordmark`, and `.nav.is-outro-hidden`.
- Produces: continuous dark outro styling at desktop, tablet, phone, keyboard focus, and reduced-motion sizes.

- [ ] **Step 1: Add CSS contract tests**

Append to `test/editorialOutro.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test test/editorialOutro.test.mjs`

Expected: FAIL because the new CSS contracts are absent.

- [ ] **Step 3: Replace the current footer styles**

In `src/styles.css`, replace the old `.footer` through `.footer-about` block with an implementation matching these exact responsibilities:

```css
.nav{transition:opacity .28s ease,transform .28s cubic-bezier(.22,1,.36,1)}
.nav.is-outro-hidden{opacity:0;transform:translate(-50%,-130%);pointer-events:none}

.footer{position:relative;min-height:clamp(52rem,140svh,76rem);padding:clamp(6rem,12vh,10rem) var(--pad) clamp(.6rem,1.5vw,1.2rem);border-top:1px solid var(--line);background:var(--deep);color:var(--fg);overflow:hidden}
.footer-observer{width:min(100%,var(--max-w));min-height:inherit;margin:0 auto;display:flex;flex-direction:column;justify-content:space-between;gap:clamp(8rem,24vh,18rem)}
.footer-info{display:grid;grid-template-columns:minmax(17rem,.8fr) minmax(26rem,1.2fr);gap:clamp(4rem,10vw,10rem);align-items:start}
.footer-contact,.footer-about-col{min-width:0}
.footer-heading{margin-bottom:1.2rem;color:var(--accent);font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.footer-contact-link{display:table;position:relative;max-width:100%;color:var(--fg);font-size:clamp(1.35rem,2.65vw,2.6rem);font-weight:700;line-height:1.12;letter-spacing:-.035em;overflow-wrap:anywhere;transition:transform .28s ease,color .28s ease}
.footer-contact-link+.footer-contact-link{margin-top:.55rem}
.footer-contact-link::after{content:"";position:absolute;left:0;bottom:-.12em;width:100%;height:2px;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .28s ease}
.footer-contact-link:hover{transform:translateX(.18em)}
.footer-contact-link:hover::after,.footer-contact-link:focus-visible::after{transform:scaleX(1)}
.footer-contact-link:focus-visible{outline:2px solid var(--accent);outline-offset:5px}
.footer-about{max-width:50ch;color:rgba(255,253,245,.78);font-size:clamp(1rem,1.45vw,1.3rem);line-height:1.75;text-wrap:pretty}
.footer-wordmark{align-self:stretch;margin:0 -.04em;color:var(--accent);font-family:"Climate Crisis",var(--font);font-size:clamp(4rem,15.8vw,14rem);font-weight:800;line-height:.7;letter-spacing:-.075em;white-space:nowrap}
```

Merge the new `.nav` transition with its existing rule instead of leaving duplicate declarations. Remove obsolete `.footer-inner`, `.footer-col`, `.footer-email`, `.footer-phone`, `.footer-btns`, and `.footer-btn` rules after confirming they are unused.

- [ ] **Step 4: Add narrow layout and reduced-motion CSS**

Inside the existing `@media(max-width:800px)` block, add:

```css
.footer{min-height:auto;padding-top:6rem;padding-bottom:.75rem}
.footer-observer{gap:clamp(8rem,24vw,12rem)}
.footer-info{grid-template-columns:1fr;gap:3.5rem}
.footer-contact-link{font-size:clamp(1.2rem,6vw,1.85rem)}
.footer-about{font-size:.98rem;line-height:1.75}
.footer-wordmark{font-size:clamp(3rem,17vw,6.2rem);line-height:.78;letter-spacing:-.07em}
```

Inside the existing `@media(prefers-reduced-motion:reduce)` block, or in a new consolidated block if absent, add:

```css
.nav,.footer-info,.footer-wordmark{transition:none!important}
.footer-info,.footer-wordmark{transform:none!important;opacity:1!important}
```

Update any older phone `.footer-inner` and `.footer-email` rules so they no longer target removed markup.

- [ ] **Step 5: Run the complete automated test suite and build**

Run:

```bash
npm test
npm run build
```

Expected: all Node tests PASS and Vite completes without errors.

- [ ] **Step 6: Verify the design in the browser**

Run:

```bash
npm run dev -- --host 127.0.0.1 --port 4178
```

Verify at widths 1440, 1024, 768, and 390 pixels:

- The outro continues the existing dark palette with no orange or white theme switch.
- Contact sits left and About sits right on desktop.
- Email and phone are equal white interactive links.
- The wordmark does not clip or create horizontal overflow.
- The nav disappears only when the outro information is substantially visible and returns on upward scroll.
- Direct navigation to `/portfolio#contact` settles at the outro and does not permanently hide the nav after leaving it.
- Phone layout becomes one column and all links provide at least a 44-pixel usable touch region.
- Reduced-motion emulation leaves the full content visible.

- [ ] **Step 7: Commit the styling and verification contract**

```bash
git add src/styles.css test/editorialOutro.test.mjs
git commit -m "style: compose responsive editorial outro"
```

---

### Task 4: Final Regression Review

**Files:**
- Modify only if a verified defect is found: `src/components/SiteFooter.jsx`, `src/pages/Home.jsx`, `src/styles.css`, `test/editorialOutro.test.mjs`

**Interfaces:**
- Consumes: the completed editorial outro and nav visibility behavior.
- Produces: a verified build with no regressions to routes, project navigation, or contact anchors.

- [ ] **Step 1: Run final checks from a clean working tree**

Run:

```bash
npm test
npm run build
git diff --check
git status --short
```

Expected: tests and build pass, `git diff --check` reports no whitespace errors, and only intentional uncommitted verification artifacts appear.

- [ ] **Step 2: Check unaffected routes**

Open `/`, `/portfolio`, `/project/woof`, and one additional project route. Confirm that the entry page, project navigation, custom cursor, and project detail taskbars still render, and that only the main portfolio page receives the new nav hide behavior.

- [ ] **Step 3: Commit any verified correction**

If Step 1 or Step 2 identifies a defect, fix only that defect, rerun both steps, then commit:

```bash
git add src/components/SiteFooter.jsx src/pages/Home.jsx src/styles.css test/editorialOutro.test.mjs
git commit -m "fix: finalize editorial outro behavior"
```

If no defect is found, do not create an empty commit.

