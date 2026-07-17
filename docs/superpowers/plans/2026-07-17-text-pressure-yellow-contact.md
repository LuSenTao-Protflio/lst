# TextPressure and Yellow Contact Glass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the supplied TextPressure response for `PORTFOLIO` and turn the portrait contact control into a compact acid-yellow glass pill.

**Architecture:** `KineticPortfolioTitle` owns global pointer input, eased cursor state, glyph axes, and glyph opacity. Existing Home markup remains; CSS updates its contact card surface.

**Tech Stack:** React 18, Roboto Flex, CSS backdrop filters, Node test runner, Vite.

## Global Constraints

- The title is a single acid-yellow `PORTFOLIO`, with flex spacing, alpha, width, and weight. It has no italic axis.
- Use global pointer tracking and an animation-frame loop. Reduced motion remains static.
- Preserve wheel, keyboard, and route navigation.
- The photo contact panel is 76% wide, centered, acid-yellow transparent glass, and `border-radius: 999px`.

---

### Task 1: Add pressure alpha and remove italic

**Files:** Modify `test/kineticTypography.test.mjs`, `src/utils/kineticTypography.js`, `src/components/KineticPortfolioTitle.jsx`, `src/pages/Prelude.jsx`, `src/styles.css`.

**Interfaces:** `calculateGlyphVariation(distance, maxDistance)` returns `{ weight, width, alpha }`. The title accepts `{ text, reduceMotion }` and tracks the global pointer itself.

- [ ] **Step 1: Write failing tests**

Add a test that expects `calculateGlyphVariation(800, 360)` to return `{ weight: 100, width: 25, alpha: 0 }`, expects the near value alpha to be `1`, and reads the title source to find `glyph.style.opacity` but not `'ital'`.

- [ ] **Step 2: Run the focused test**

Run `pnpm test -- test/kineticTypography.test.mjs`. It must fail because the current helper emits `italic` and the title lacks alpha output.

- [ ] **Step 3: Implement the minimum behavior**

Return `alpha: Number(influence.toFixed(2))` from the helper. In the title, listen for window `mousemove` and `touchmove`, initialize at the title center, ease toward the latest pointer by one fifteenth per frame, set `fontVariationSettings` to only `wght` and `wdth`, then assign `glyph.style.opacity = alpha`. Remove the `pointer` prop and title pointer state. Keep glyphs in a flex row with `justify-content: space-between`.

- [ ] **Step 4: Run the focused test again**

Run `pnpm test -- test/kineticTypography.test.mjs`. Expected: PASS.

- [ ] **Step 5: Commit the task**

Run `git add test/kineticTypography.test.mjs src/utils/kineticTypography.js src/components/KineticPortfolioTitle.jsx src/pages/Prelude.jsx src/styles.css && git commit -m "feat: restore text pressure interaction"`.

### Task 2: Convert the contact control to yellow glass

**Files:** Modify `test/kineticTypography.test.mjs` and `src/styles.css`.

**Interfaces:** Existing `.info-photo-contact-card`, `.info-photo-avatar`, `.info-photo-contact-copy`, and `.info-photo-contact-action` remain unchanged in markup.

- [ ] **Step 1: Write a failing source contract test**

Read `src/styles.css` and assert the contact-card rule includes `width:76%`, `border-radius:999px`, and an acid-yellow `230,255,26` color value.

- [ ] **Step 2: Run the focused test**

Run `pnpm test -- test/kineticTypography.test.mjs`. It must fail because the current card is full-width blue glass with an 18px radius.

- [ ] **Step 3: Implement the yellow compact pill**

Set `width:76%`, `left:50%`, `right:auto`, `transform:translateX(-50%)`, and `border-radius:999px`. Convert card, highlight, avatar, copy, and action colors to acid-yellow translucent glass with dark ink text. Make reduced-transparency fallback opaque olive-yellow.

- [ ] **Step 4: Run the focused test again**

Run `pnpm test -- test/kineticTypography.test.mjs`. Expected: PASS.

- [ ] **Step 5: Commit the task**

Run `git add test/kineticTypography.test.mjs src/styles.css && git commit -m "style: unify portrait contact glass in yellow"`.

### Task 3: Verify the complete feature

**Files:** Verify all changed files.

- [ ] **Step 1: Run every test**

Run `pnpm test`. Expected: every test passes.

- [ ] **Step 2: Build for GitHub Pages**

Run `VITE_BASE_PATH=/lst/ pnpm vite build`. Expected: exit code 0.

- [ ] **Step 3: Check diff and preview**

Run `git diff --check 39e3142..HEAD && git status --short`. Expected: no errors and a clean worktree. In the local preview, verify cursor-near glyphs grow brighter, wider, and heavier; far glyphs fade; the contact pill is yellow and rounded.
