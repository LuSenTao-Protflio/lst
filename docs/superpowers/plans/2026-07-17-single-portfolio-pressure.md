# Single Portfolio Pressure Title Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the prelude cover's three-line title with a single oversized, full-cover cursor-reactive `PORTFOLIO` word.

**Architecture:** `Prelude` retains `/entry` navigation and sends its full-cover cursor position to `KineticPortfolioTitle`. The title owns TextPressure-style smoothing and writes Roboto Flex axes for each glyph. The existing pure utility remains independently testable.

**Tech Stack:** React 18, React Router, Framer Motion, Roboto Flex variable font, Node built-in test runner, Vite.

## Global Constraints

- Render exactly one uppercase title: `PORTFOLIO`; do not render `GRAPHIC` or `DESIGN`.
- Retain the deep olive frosted-glass cover, acid-yellow title color, LightRays, metadata grid, and existing `/entry` navigation behavior.
- Cursor movement anywhere on the prelude cover drives per-glyph width, weight, and italic changes on desktop.
- Use the locally installed Roboto Flex font; do not add a runtime remote-font request.
- For reduced-motion users, use static resting variable-font axes and do not start the animation loop.

---

### Task 1: Define and test TextPressure axis mapping

**Files:**
- Modify: `src/utils/kineticTypography.js`
- Modify: `test/kineticTypography.test.mjs`

**Interfaces:**
- Consumes: a glyph-to-smoothed-cursor distance in pixels.
- Produces: `calculateGlyphVariation(distance, maxDistance)` returning `{ weight: number, width: number, italic: number }` within the Roboto Flex axis bounds.

- [ ] **Step 1: Write the failing test**

```js
test("resting glyph remains narrow and light beyond the influence radius", () => {
  assert.deepEqual(calculateGlyphVariation(800, 360), { weight: 100, width: 25, italic: 0 });
});

test("glyph at the cursor reaches the TextPressure axis maxima", () => {
  assert.deepEqual(calculateGlyphVariation(0, 360), { weight: 900, width: 151, italic: 1 });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- test/kineticTypography.test.mjs`

Expected: FAIL because the helper uses different resting and maximum values.

- [ ] **Step 3: Write minimal implementation**

```js
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export function calculateGlyphVariation(distance, maxDistance) {
  const influence = 1 - clamp(distance / maxDistance, 0, 1);
  return {
    weight: Math.round(100 + influence * 800),
    width: Math.round(25 + influence * 126),
    italic: Number(influence.toFixed(2))
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- test/kineticTypography.test.mjs`

Expected: PASS with the two new bounds tests and the interpolation test.

- [ ] **Step 5: Commit**

```bash
git add src/utils/kineticTypography.js test/kineticTypography.test.mjs
git commit -m "feat: tune portfolio pressure axes"
```

### Task 2: Replace the title component with full-cover smoothed pressure behavior

**Files:**
- Modify: `src/components/KineticPortfolioTitle.jsx`
- Modify: `src/pages/Prelude.jsx`
- Modify: `src/styles.css`
- Modify: `test/kineticTypography.test.mjs`

**Interfaces:**
- Consumes: `KineticPortfolioTitle({ text, reduceMotion, pointer })`, where `pointer` is `{ x: number, y: number } | null` from the prelude surface.
- Produces: one `h1` containing `data-glyph` spans whose Roboto Flex axes are updated per animation frame.

- [ ] **Step 1: Write the failing test**

```js
test("prelude renders a single PORTFOLIO title", async () => {
  const source = await readFile(new URL("../src/pages/Prelude.jsx", import.meta.url), "utf8");
  assert.match(source, /text="PORTFOLIO"/);
  assert.doesNotMatch(source, /GRAPHIC|DESIGN/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- test/kineticTypography.test.mjs`

Expected: FAIL because `Prelude.jsx` still defines three title lines.

- [ ] **Step 3: Write minimal implementation**

In `Prelude.jsx`, store a `{ x, y }` cursor value from `motion.main`'s `onPointerMove` and render:

```jsx
<KineticPortfolioTitle text="PORTFOLIO" reduceMotion={reduceMotion} pointer={pointer} />
```

In `KineticPortfolioTitle.jsx`, map `text.split("")` to glyph spans and run an animation-frame loop. Seed the smoothed cursor at the title center when there is no pointer input, ease it one fifteenth toward the latest pointer each frame, and use `calculateGlyphVariation(distance, titleRect.width / 2)` for every glyph. Write values directly as:

```js
span.style.fontVariationSettings = "'wght' " + weight + ", 'wdth' " + width + ", 'ital' " + italic;
```

With reduced motion, set every glyph to `"'wght' 100, 'wdth' 25, 'ital' 0"` and do not start the loop.

Update `styles.css`: make `.prelude-title` a single non-wrapping line using `font-size: clamp(5.5rem, 18vw, 22rem)`, `max-width: 92vw`, and remove obsolete multi-line title rules.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- test/kineticTypography.test.mjs`

Expected: PASS with title-copy and axis tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/KineticPortfolioTitle.jsx src/pages/Prelude.jsx src/styles.css test/kineticTypography.test.mjs
git commit -m "feat: make portfolio title full-cover reactive"
```

### Task 3: Verify cover navigation and production build

**Files:**
- Verify only: `test/preludeNavigation.test.mjs`, `test/entryLinkRoutes.test.mjs`, `src/pages/Prelude.jsx`, `src/styles.css`

**Interfaces:**
- Consumes: the updated title and existing navigation helpers.
- Produces: verified cursor, keyboard, wheel, route, accessibility, and build behavior.

- [ ] **Step 1: Run the complete suite**

Run: `pnpm test`

Expected: all title-axis, title-copy, wheel, keydown, and entry-return route tests pass.

- [ ] **Step 2: Build for GitHub Pages**

Run: `VITE_BASE_PATH=/lst/ pnpm vite build`

Expected: Vite exits with code 0 and produces `dist/`.

- [ ] **Step 3: Check whitespace and working tree**

Run: `git diff --check 39e3142..HEAD && git status --short`

Expected: no diff-check output and no uncommitted files.

