# Exact TextPressure and Footer Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use the supplied TextPressure implementation for the prelude and demote the phone number to a bright-yellow footer secondary line.

**Architecture:** A reusable `TextPressure` component receives the supplied props. `Prelude` composes it in the existing title zone. Footer markup is retained and its phone modifier controls hierarchy.

**Tech Stack:** React, Roboto Flex, Node test runner, Vite.

## Global Constraints

- Invoke TextPressure with `text="portfolio"`, `flex`, `width`, `weight`, `alpha={false}`, `italic={false}`, and `textColor="#E6FF1A"`.
- Preserve the supplied component's cursor smoothing, per-letter `getAttr` calculation, flex behavior, and resize sizing.
- Keep email primary; set phone to heading-scale bright yellow.

---

### Task 1: Test and integrate supplied TextPressure behavior

**Files:** Create `src/components/TextPressure.jsx`; modify `src/pages/Prelude.jsx`, `src/styles.css`, and `test/kineticTypography.test.mjs`.

- [ ] **Step 1: Write failing source tests**

Assert Prelude imports `TextPressure` and renders `text="portfolio"`, `alpha={false}`, `italic={false}`, and `textColor="#E6FF1A"`. Assert the component contains `getAttr`, `requestAnimationFrame`, `mousemove`, and the original width range `5, 200`.

- [ ] **Step 2: Run the focused test**

Run `pnpm test -- test/kineticTypography.test.mjs`. Expected: FAIL because no supplied component is integrated.

- [ ] **Step 3: Implement source-equivalent component and usage**

Copy the supplied component logic into `TextPressure.jsx`, use the local Roboto Flex import instead of a remote `@import`, and render it from Prelude at full title-zone height. Remove `KineticPortfolioTitle` usage. Preserve reduced-motion by passing a static variant or disabling the animation loop when the preference is active.

- [ ] **Step 4: Re-run the focused test**

Run `pnpm test -- test/kineticTypography.test.mjs`. Expected: PASS.

- [ ] **Step 5: Commit**

Run `git add src/components/TextPressure.jsx src/pages/Prelude.jsx src/styles.css test/kineticTypography.test.mjs && git commit -m "feat: integrate exact text pressure title"`.

### Task 2: Demote the phone contact hierarchy

**Files:** Modify `src/styles.css` and `test/kineticTypography.test.mjs`.

- [ ] **Step 1: Write failing source test**

Assert `.footer-phone` includes `font-size:.68rem` and `color:var(--accent)`.

- [ ] **Step 2: Run focused test**

Run `pnpm test -- test/kineticTypography.test.mjs`. Expected: FAIL because phone inherits the large email type.

- [ ] **Step 3: Implement secondary yellow phone styling**

Set `.footer-phone` to heading-scale font size and letter spacing, `color:var(--accent)`, and preserve the underline hover animation.

- [ ] **Step 4: Re-run focused test and commit**

Run `pnpm test -- test/kineticTypography.test.mjs`, then `git add src/styles.css test/kineticTypography.test.mjs && git commit -m "style: demote phone contact hierarchy"`.

### Task 3: Verify

- [ ] **Step 1:** Run `pnpm test` and expect all tests to pass.
- [ ] **Step 2:** Run `VITE_BASE_PATH=/lst/ pnpm vite build` and expect exit 0.
- [ ] **Step 3:** Run `git diff --check 39e3142..HEAD && git status --short` and expect no errors or pending files.
