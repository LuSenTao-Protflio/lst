# WHELK Physical Applications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five supplied WHELK physical-application photographs to the project detail page in the approved narrative order.

**Architecture:** Store optimized images in a dedicated `src/assets/whelk` directory and expose them through the WHELK project data. Add an optional `storyLayout` placement map to WHELK and teach the existing editorial detail renderer to use it, while preserving the current fallback layout for every other editorial project.

**Tech Stack:** React, Vite `import.meta.glob`, Framer Motion, native CSS Grid, Node test runner, macOS `sips`

## Global Constraints

- Preserve the existing WHELK hero, route, copy, typography, page theme, and project navigation.
- Keep sharp image edges and the existing off-white editorial surface.
- Use only the current Motion reveal and reduced-motion behavior.
- Do not add captions, overlays, rounded cards, new section headings, or third-party dependencies.
- Desktop uses varied full-width, asymmetric, and portrait layouts; widths below 768px collapse to one column.

---

### Task 1: Define the WHELK placement contract with a failing test

**Files:**
- Create: `test/whelkApplications.test.mjs`

**Interfaces:**
- Consumes: Existing `project.images`, `project.hero`, and translated `detail.sections`.
- Produces: A failing test that defines the optional `project.storyLayout` contract and required asset names.

- [ ] **Step 1: Write the failing test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("WHELK interleaves five physical application images", async () => {
  const [projects, detail, styles] = await Promise.all([
    readFile(new URL("../src/data/projects.js", import.meta.url), "utf8"),
    readFile(new URL("../src/components/EditorialProjectDetail.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
  ]);

  for (const name of ["wash-label.jpg", "rug.jpg", "fabric-bag.jpg", "charm.jpg", "mugs.jpg"]) {
    assert.match(projects, new RegExp(name));
  }
  assert.match(projects, /storyLayout:/);
  assert.match(detail, /project\.storyLayout/);
  assert.match(styles, /\.editorial-story-portrait/);
});
```

- [ ] **Step 2: Run the focused test and verify red**

Run:

```bash
export PATH='/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:'"$PATH"
node --test test/whelkApplications.test.mjs
```

Expected: FAIL because the five filenames and `storyLayout` contract do not exist.

### Task 2: Optimize assets and implement the ordered editorial layout

**Files:**
- Create: `src/assets/whelk/wash-label.jpg`
- Create: `src/assets/whelk/rug.jpg`
- Create: `src/assets/whelk/fabric-bag.jpg`
- Create: `src/assets/whelk/charm.jpg`
- Create: `src/assets/whelk/mugs.jpg`
- Modify: `src/data/projects.js`
- Modify: `src/components/EditorialProjectDetail.jsx`
- Modify: `src/styles.css`
- Test: `test/whelkApplications.test.mjs`

**Interfaces:**
- Consumes: The `storyLayout` group contract from Task 1.
- Produces: A WHELK-specific ordered layout rendered by the shared editorial component.

- [ ] **Step 1: Convert the five supplied PNG files to optimized JPEG assets**

```bash
mkdir -p src/assets/whelk
sips -s format jpeg -s formatOptions 82 '/Users/ttao/Downloads/whelk品牌/水洗.png' --out src/assets/whelk/wash-label.jpg
sips -s format jpeg -s formatOptions 82 '/Users/ttao/Downloads/whelk品牌/样机4.png' --out src/assets/whelk/rug.jpg
sips -Z 2400 -s format jpeg -s formatOptions 82 '/Users/ttao/Downloads/whelk品牌/未标题-1.png' --out src/assets/whelk/fabric-bag.jpg
sips -s format jpeg -s formatOptions 82 '/Users/ttao/Downloads/whelk品牌/挂件.png' --out src/assets/whelk/charm.jpg
sips -Z 2400 -s format jpeg -s formatOptions 82 '/Users/ttao/Downloads/whelk品牌/样机.png' --out src/assets/whelk/mugs.jpg
```

- [ ] **Step 2: Add the asset loader and WHELK placement map**

Add the WHELK asset glob and helper to `src/data/projects.js`:

```js
const whelkImages = import.meta.glob("../assets/whelk/*.{jpg,png,jpeg}", {
  eager: true,
  import: "default",
});
const getW = (name) => whelkImages[`../assets/whelk/${name}`];
```

Add this placement map to the WHELK project object:

```js
storyLayout: [
  { sectionIndex: 0, layout: "wide", images: [getP("05.jpg")] },
  { sectionIndex: 1, layout: "pair", images: [getP("06.jpg"), getP("08.jpg")] },
  { layout: "asymmetric", images: [getW("wash-label.jpg"), getW("rug.jpg")] },
  { sectionIndex: 2, layout: "wide", images: [getP("09.jpg")] },
  { layout: "portrait", align: "left", images: [getW("fabric-bag.jpg")] },
  { layout: "wide", images: [getP("10.jpg")] },
  { layout: "portrait", align: "right", images: [getW("charm.jpg")] },
  { layout: "pair", images: [getP("11.jpg"), getP("12.jpg")] },
  { layout: "wide", images: [getW("mugs.jpg")] },
],
```

- [ ] **Step 3: Render `storyLayout` when present and retain the existing fallback**

In `EditorialProjectDetail.jsx`, import `Fragment`, normalize the existing slices into the same group shape, and render one path for both custom and fallback layouts:

```jsx
import { Fragment } from "react";

const defaultStoryLayout = [
  { sectionIndex: 0, layout: "wide", images: fullImage ? [fullImage] : [] },
  { sectionIndex: 1, layout: "pair", images: pairImages },
  { sectionIndex: 2, layout: "asymmetric", images: asymmetricImages },
  { layout: "remainder", images: remainingImages },
].filter((group) => group.images.length > 0);

const storyLayout = project.storyLayout || defaultStoryLayout;

{storyLayout.map((group, groupIndex) => (
  <Fragment key={`${group.layout}-${groupIndex}`}>
    {Number.isInteger(group.sectionIndex) && (
      <StoryCopy
        section={detail.sections[group.sectionIndex]}
        alignRight={group.sectionIndex === 1}
        reduceMotion={reduceMotion}
      />
    )}
    <div className={`editorial-story-${group.layout} editorial-count-${group.images.length}${group.align ? ` editorial-align-${group.align}` : ""}`}>
      {group.images.map((src, index) => (
        <ImageFigure
          key={src}
          src={src}
          alt={`${projectT.title} physical application ${groupIndex + 1}.${index + 1}`}
          reduceMotion={reduceMotion}
          delay={index * 0.06}
        />
      ))}
    </div>
  </Fragment>
))}
```

Add `align: "left"` to the fabric-bag portrait group and `align: "right"` to the charm portrait group in `src/data/projects.js`.

- [ ] **Step 4: Add WHELK layout rules and mobile collapse**

```css
.editorial-story-portrait{width:min(58%,48rem);margin:0 auto clamp(6rem,11vw,10rem)}
.editorial-story-portrait.editorial-align-left{margin-left:0;margin-right:auto}
.editorial-story-portrait.editorial-align-right{margin-left:auto;margin-right:0}

@media(max-width:800px){
  .editorial-story-portrait{width:100%;margin-left:0;margin-right:0}
}
```

Reuse the existing `.editorial-story-wide`, `.editorial-story-pair`, and `.editorial-story-asymmetric` rules. Ensure each placement group has the same vertical margin rhythm as the existing editorial groups.

- [ ] **Step 5: Run focused and full tests**

```bash
node --test test/whelkApplications.test.mjs
pnpm test
```

Expected: focused test PASS; full suite reports zero failures.

- [ ] **Step 6: Build and inspect formatting**

```bash
pnpm build
git diff --check
```

Expected: Vite production build exits 0 and `git diff --check` emits no output.

- [ ] **Step 7: Browser verification**

Open `/project/whelk` at desktop and 390px width. Confirm the five new photographs appear in the approved sequence, every portrait remains legible, mobile collapses to one column, and `document.documentElement.scrollWidth === document.documentElement.clientWidth`.

- [ ] **Step 8: Commit the scoped implementation**

```bash
git add src/assets/whelk src/data/projects.js src/components/EditorialProjectDetail.jsx src/styles.css test/whelkApplications.test.mjs docs/superpowers/plans/2026-07-17-whelk-physical-applications.md
git commit -m "feat: add whelk physical applications"
```
