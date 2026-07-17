# Prelude Cover and Contact Glass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a kinetic prelude page before the project entry and add a portrait contact glass panel plus complete footer contact details.

**Architecture:** A new `/` route renders a focused `Prelude` page, while the current entry index moves to `/entry`. `KineticPortfolioTitle` owns pointer-driven variable type changes and receives an `onEnter` callback from `Prelude`. `Home` and `SiteFooter` receive only local markup changes so the current portfolio content and project routes remain stable.

**Tech Stack:** React 19, React Router, Framer Motion, Vite, CSS custom properties, `@fontsource-variable/roboto-flex`, Node built-in test runner.

## Global Constraints

- Preserve `/portfolio`, `/project/:id`, `/wechat`, existing entry project index, and LightRays pointer behavior.
- Use `/` for the prelude and `/entry` for the existing project index.
- Use acid yellow as the primary accent, deep olive glass for the prelude, and blue-black layered glass only inside the portrait contact panel.
- `GRAPHIC DESIGN PORTFOLIO` uses a local variable font with pointer proximity changing `wght`, `wdth`, and `ital`.
- Reduced-motion and touch-first devices render static title glyphs and immediate route transitions.
- Visible copy contains no em dash characters.
- Contact action targets `#contact`; footer includes `电话 / 微信同号：15875591020` as a `tel:` link with email-matching presentation.

---

## File Structure

- Create: `src/utils/preludeNavigation.js` - pure gesture and keyboard intent predicates.
- Create: `test/preludeNavigation.test.mjs` - Node tests for intent thresholds and editable-element safety.
- Create: `src/components/KineticPortfolioTitle.jsx` - isolated variable-font pointer interaction.
- Create: `src/pages/Prelude.jsx` - full-viewport grid cover and route transition owner.
- Modify: `src/App.jsx` - add `/entry` and render `Prelude` at `/`.
- Modify: `src/components/InteractiveCover.jsx` - make existing copy remain valid after route move without changing its behavior.
- Modify: `src/pages/Home.jsx` - add the portrait contact action.
- Modify: `src/components/SiteFooter.jsx` - add phone and WeChat contact link.
- Modify: `src/styles.css` - prelude, title, portrait panel, footer contact, responsive and reduced-motion styles.
- Modify: `package.json` and `pnpm-lock.yaml` - local variable font dependency and Node test script.

### Task 1: Establish route-intent helpers with tests

**Files:**
- Create: `src/utils/preludeNavigation.js`
- Create: `test/preludeNavigation.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces `shouldAdvanceFromWheel(deltaY: number): boolean` and `shouldAdvanceFromKey(key: string, tagName?: string): boolean`.
- `Prelude` consumes both helpers to decide whether to navigate to `/entry`.

- [ ] **Step 1: Write the failing Node tests**

```js
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
```

- [ ] **Step 2: Run the test and confirm it fails because the helper does not exist**

Run: `node --test test/preludeNavigation.test.mjs`

Expected: failure resolving `src/utils/preludeNavigation.js`.

- [ ] **Step 3: Implement the helpers**

```js
const editableTags = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export function shouldAdvanceFromWheel(deltaY) {
  return deltaY >= 18;
}

export function shouldAdvanceFromKey(key, tagName = "") {
  return key === "ArrowDown" && !editableTags.has(tagName.toUpperCase());
}
```

- [ ] **Step 4: Add the package test command and re-run tests**

```json
"test": "node --test"
```

Run: `pnpm test`

Expected: two passing tests.

- [ ] **Step 5: Commit the helpers and tests**

```bash
git add package.json src/utils/preludeNavigation.js test/preludeNavigation.test.mjs
git commit -m "test: cover prelude navigation intent"
```

### Task 2: Build the kinetic prelude route

**Files:**
- Create: `src/components/KineticPortfolioTitle.jsx`
- Create: `src/pages/Prelude.jsx`
- Modify: `src/App.jsx`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- `KineticPortfolioTitle({ text, reduceMotion })` writes individual glyph style variables without React state per animation frame.
- `Prelude` calls `navigate("/entry")` once after wheel, key, or action intent.

- [ ] **Step 1: Add the variable font dependency**

Run: `pnpm add @fontsource-variable/roboto-flex`

Expected: dependency appears in `package.json` and `pnpm-lock.yaml`.

- [ ] **Step 2: Implement `KineticPortfolioTitle` with pointer-local motion values**

```jsx
import { useCallback, useEffect, useRef } from "react";
import "@fontsource-variable/roboto-flex/full.css";

export default function KineticPortfolioTitle({ text, reduceMotion }) {
  const rootRef = useRef(null);

  const updateGlyphs = useCallback((clientX, clientY) => {
    if (reduceMotion || !rootRef.current) return;
    rootRef.current.querySelectorAll("[data-glyph]").forEach((glyph) => {
      const rect = glyph.getBoundingClientRect();
      const distance = Math.hypot(clientX - (rect.left + rect.width / 2), clientY - (rect.top + rect.height / 2));
      const influence = Math.max(0, 1 - distance / 290);
      glyph.style.setProperty("--glyph-weight", String(Math.round(420 + influence * 480)));
      glyph.style.setProperty("--glyph-width", String(Math.round(88 + influence * 52)));
      glyph.style.setProperty("--glyph-italic", (influence * 10).toFixed(2));
    });
  }, [reduceMotion]);

  return <h1 ref={rootRef} className="prelude-title" onPointerMove={(event) => updateGlyphs(event.clientX, event.clientY)}>{[...text].map((glyph, index) => <span data-glyph key={`${glyph}-${index}`}>{glyph === " " ? "\u00a0" : glyph}</span>)}</h1>;
}
```

- [ ] **Step 3: Implement `Prelude` with one guarded navigation function**

```jsx
const advanceRef = useRef(false);
const advance = useCallback(() => {
  if (advanceRef.current) return;
  advanceRef.current = true;
  setLeaving(true);
  window.setTimeout(() => navigate("/entry"), reduceMotion ? 0 : 360);
}, [navigate, reduceMotion]);
```

Attach `onWheel`, a cleaned-up `keydown` listener, and a semantic button to `advance`. Place the three requested identity strings in a 12-column `prelude-meta-grid` and the kinetic title in the visual center.

- [ ] **Step 4: Register the routes**

```jsx
<Route path="/" element={<Prelude />} />
<Route path="/entry" element={<Entry />} />
```

Keep the current portfolio and project routes unchanged.

- [ ] **Step 5: Verify routes and keyboard logic**

Run: `pnpm test && VITE_BASE_PATH=/lst/ pnpm vite build`

Expected: test suite passes and Vite emits `dist/index.html`.

- [ ] **Step 6: Commit the prelude**

```bash
git add package.json pnpm-lock.yaml src/components/KineticPortfolioTitle.jsx src/pages/Prelude.jsx src/App.jsx
git commit -m "feat: add kinetic portfolio prelude"
```

### Task 3: Add portrait contact glass and footer phone contact

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/components/SiteFooter.jsx`
- Modify: `src/i18n.jsx`

**Interfaces:**
- The portrait panel uses a regular anchor with `href="#contact"`.
- Footer translations expose `footer.col1Phone` with `电话 / 微信同号：15875591020` in Chinese and `Phone / WeChat: 15875591020` in English.

- [ ] **Step 1: Add footer translation values**

```js
footer: {
  col1Heading: "求职联系",
  col1Email: "sentaolu371@gmail.com",
  col1Phone: "电话 / 微信同号：15875591020",
}
```

Use the equivalent English value in the English translation object.

- [ ] **Step 2: Add the portrait action without changing the image source**

```jsx
<div className="info-photo-contact-card">
  <span className="info-photo-avatar"><img src={photoImg} alt="" /></span>
  <span className="info-photo-contact-copy"><strong>卢森涛</strong><small>视觉传达设计</small></span>
  <a href="#contact" className="info-photo-contact-action">联系我</a>
</div>
```

- [ ] **Step 3: Add the phone link below email**

```jsx
<a href="tel:15875591020" className="footer-email footer-phone">{t("footer.col1Phone")}</a>
```

- [ ] **Step 4: Verify anchors and translated contact content**

Run: `rg -n 'href="#contact"|tel:15875591020|col1Phone' src/pages/Home.jsx src/components/SiteFooter.jsx src/i18n.jsx`

Expected: the contact anchor, telephone URI, and both translation values are present.

- [ ] **Step 5: Commit the contact content**

```bash
git add src/pages/Home.jsx src/components/SiteFooter.jsx src/i18n.jsx
git commit -m "feat: add portrait contact panel"
```

### Task 4: Apply responsive visual system and validate interaction

**Files:**
- Modify: `src/styles.css`

**Interfaces:**
- `prelude-*` classes control the full-viewport cover and its responsive collapse.
- `info-photo-contact-*` classes control the layered glass panel.
- `footer-phone` inherits email interaction before adding vertical spacing.

- [ ] **Step 1: Add prelude CSS**

Create `.prelude` as `min-height:100dvh`, with deep olive glass, a blurred highlight layer, and the existing `LightRays` beneath content. Use `.prelude-title [data-glyph] { font-variation-settings: "wght" var(--glyph-weight, 560), "wdth" var(--glyph-width, 100), "ital" var(--glyph-italic, 0); }`. Keep title to three lines at desktop and static at mobile.

- [ ] **Step 2: Add two-layer portrait glass CSS**

Create a bottom inset panel with `backdrop-filter: blur(22px) saturate(140%)`, blue-black translucent fill, one outer and one inner border, and a quiet top-left highlight. The action is a legible light-blue glass button. Use a solid opaque fallback inside `@media (prefers-reduced-transparency: reduce)`.

- [ ] **Step 3: Extend footer contact CSS**

Make `.footer-email` and `.footer-phone` block-level links. Keep the existing underline pseudo-element and add only `.footer-phone { margin-top: .5rem; }` so typography and hover behavior are shared.

- [ ] **Step 4: Add responsive and reduced-motion rules**

At 800px, collapse title text to a measured multi-line layout, retain grid-aligned metadata, and let the portrait panel span its image width. Under `prefers-reduced-motion: reduce`, remove prelude transition and glyph variation changes.

- [ ] **Step 5: Run visual and build verification**

Run: `pnpm test && VITE_BASE_PATH=/lst/ pnpm vite build && git diff --check`

Expected: tests pass, build exits 0, and no whitespace errors are reported.

Use the local preview to verify `/`, wheel advance, Down Arrow advance, `/entry`, `/portfolio#contact`, 390px responsiveness, and reduced-motion behavior.

- [ ] **Step 6: Commit styles**

```bash
git add src/styles.css
git commit -m "style: compose prelude and contact glass"
```

## Plan Self-Review

- Spec coverage: Task 1 covers guarded navigation behavior. Task 2 covers the new route, variable title, grid metadata, and reduced motion. Task 3 covers the portrait action, footer phone, WeChat copy, and translations. Task 4 covers frosted material, responsive behavior, build, and visual validation.
- Placeholder scan: no implementation placeholders remain; each task names files, interfaces, concrete code, and commands.
- Type consistency: `shouldAdvanceFromWheel`, `shouldAdvanceFromKey`, `KineticPortfolioTitle`, `Prelude`, `col1Phone`, and the CSS class names are introduced before their consumers.
