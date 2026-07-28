# Mobile Entry Touch Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the phone-only portfolio navigation and add a finger-following entry-page project thumbnail without changing tablet or desktop behavior.

**Architecture:** Keep the existing desktop proximity preview intact. Add one coarse-pointer mobile preview owned by `HoverProjectReveal`, driven by pointer capture and Framer Motion values, while limiting all new layout styling to the existing `max-width: 599px` media block.

**Tech Stack:** React 19, Framer Motion 12, CSS media queries, Node test runner, Vite.

## Global Constraints

- Apply changes only at `max-width: 599px`.
- Tablet and desktop output must remain unchanged.
- Do not add dependencies or scroll listeners.
- Keep `misc` image-free.
- Entry rows remain static previews and do not navigate.
- Continuous pointer coordinates use Motion values rather than React state.

---

### Task 1: Phone Navigation Contract

**Files:**
- Modify: `test/mobileShellResponsive.test.mjs`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: existing `.nav`, `.nav-logo`, `.nav-links`, `.nav-link`, and `.nav-lang-btn` markup.
- Produces: a phone-only three-column navigation layout with 44px controls.

- [ ] **Step 1: Write the failing test**

Add assertions that the `max-width:599px` block gives `.nav` a three-column grid, centers `.nav-links`, right-aligns `.nav-lang-btn`, and retains 44px touch targets.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/mobileShellResponsive.test.mjs`

Expected: FAIL because the navigation still uses the flexible row layout.

- [ ] **Step 3: Write minimal implementation**

Update only the `@media(max-width:599px)` navigation rules:

```css
.nav {
  display:grid;
  grid-template-columns:minmax(72px,1fr) auto 44px;
  align-items:center;
}
.nav-logo { justify-self:start; }
.nav-links { justify-self:center; }
.nav-lang-btn { justify-self:end; }
```

Tune phone-only font size, weight, and gaps so 320px does not clip.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/mobileShellResponsive.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add test/mobileShellResponsive.test.mjs src/styles.css
git commit -m "fix: refine phone portfolio navigation"
```

### Task 2: Phone Touch Preview Contract

**Files:**
- Create: `test/mobileEntryTouchPreview.test.mjs`
- Modify: `src/components/HoverProjectReveal.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `projects`, row refs, `usePortfolioReducedMotion`, existing fine-pointer preview.
- Produces: one `.cover-project-touch-preview` element positioned by `useMotionValue`.

- [ ] **Step 1: Write the failing test**

Create source-contract assertions for:

```js
assert.match(source, /useMotionValue/);
assert.match(source, /setPointerCapture/);
assert.match(source, /releasePointerCapture/);
assert.equal((source.match(/cover-project-touch-preview/g) || []).length, 1);
assert.match(source, /project\.id !== "misc"/);
```

Also assert that the touch-preview CSS is inside the phone media block and that the existing desktop preview remains.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/mobileEntryTouchPreview.test.mjs`

Expected: FAIL because the mobile shared preview and pointer lifecycle do not exist.

- [ ] **Step 3: Write minimal implementation**

In `HoverProjectReveal`:

- detect `(max-width: 599px) and (pointer: coarse)`;
- store `x` and `y` with `useMotionValue`;
- on touch pointer down, capture the pointer and activate the row under `clientY`;
- on pointer move, update motion values and switch the active project only when the row changes;
- hide for `misc`, outside rows, pointer up, pointer cancel, or lost capture;
- render one decorative shared preview using the active project's hero;
- preserve current fine-pointer markup and behavior.

In the phone media block, style the shared thumbnail at 16:10 with rounded corners, shadow, `pointer-events:none`, and viewport-safe dimensions.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/mobileEntryTouchPreview.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add test/mobileEntryTouchPreview.test.mjs src/components/HoverProjectReveal.jsx src/styles.css
git commit -m "feat: add phone entry touch previews"
```

### Task 3: Regression, Browser, and Publish Verification

**Files:**
- Verify: all source and tests
- Package: existing Sites project in `.openai/hosting.json`

**Interfaces:**
- Consumes: Tasks 1–2.
- Produces: validated production build and deployed version.

- [ ] **Step 1: Run focused and full tests**

Run:

```bash
node --test test/mobileShellResponsive.test.mjs test/mobileEntryTouchPreview.test.mjs
npm test
```

Expected: all tests PASS.

- [ ] **Step 2: Build the validated source**

Run: `npm run build`

Expected: successful Vite and Sites worker build.

- [ ] **Step 3: Browser-check responsive behavior**

Verify 320×700 and 390×844 phone layouts for navigation overflow, preview following/switching/release, and `misc` hiding. Confirm unchanged 768×1024 tablet and 1440×900 desktop layouts.

- [ ] **Step 4: Commit exact validated source state**

Commit any verification-only test updates if required; otherwise use the existing validated branch head.

- [ ] **Step 5: Publish the existing Sites project**

Push the exact validated source state, package the build, save one version, deploy it, and wait for deployment success.
