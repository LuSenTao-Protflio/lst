# Portfolio Order and Image Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route new preview and research images to the correct portfolio surfaces and apply one approved project order across the entry page, directory, main project stream, numbering, and project navigation.

**Architecture:** Extend project data with optional `previewImages`, `detailImages`, and `detailImageAlts` fields. Main-page preview components prefer `previewImages`, WOOF-WOOF detail prefers `detailImages`, and every ordered surface continues to derive from the single `projects` array.

**Tech Stack:** React, Vite `import.meta.glob`, Framer Motion, native CSS, Node test runner, macOS `sips`

## Global Constraints

- Preserve existing routes, anchor IDs, glass entry interaction, main-page layout, project heroes, copy voice, and detail-page chrome.
- Approved order: `whelk`, `daily-reading`, `woof`, `memory`, `gala`, `storyteller`, `misc`.
- WHELK main preview: current first image, current second image, supplied `50.png` as third image.
- Daily Reading main preview: current first image, supplied `10.png` as second image, supplied `11.png` as third image.
- WOOF-WOOF detail research order: supplied `19.png`, `23.png`, `24.png`, `25.png`, `27.png`, then all existing product images.
- Convert supplied PNG files to optimized JPEG without upscaling and without modifying the source files.
- Do not add dependencies, captions, cards, overlays, decorative labels, or new animation systems.
- Preserve reduced-motion behavior and explicitly verify desktop and 390px layouts.

---

### Task 1: Define the media-routing and ordering contracts

**Files:**
- Create: `test/portfolioCuration.test.mjs`
- Test: `test/portfolioCuration.test.mjs`

**Interfaces:**
- Consumes: Project source, Home preview renderer, folder preview renderer, WOOF-WOOF detail renderer, and translations.
- Produces: A failing source-contract test for the approved project order and the `previewImages` and `detailImages` interfaces.

- [ ] **Step 1: Write the failing test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("portfolio curation uses approved order and routed image sets", async () => {
  const [projects, home, folder, woof, translations] = await Promise.all([
    readFile(new URL("../src/data/projects.js", import.meta.url), "utf8"),
    readFile(new URL("../src/pages/Home.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/ProjectFolderReveal.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/WoofProjectDetail.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/i18n.jsx", import.meta.url), "utf8"),
  ]);

  const ids = [...projects.matchAll(/\n\s{4}id: "([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(ids, ["whelk", "daily-reading", "woof", "memory", "gala", "storyteller", "misc"]);
  assert.match(projects, /previewImages:/);
  assert.match(projects, /detailImages:/);
  assert.match(projects, /whelk-main-preview\.jpg/);
  assert.match(projects, /daily-preview-illustration\.jpg/);
  assert.match(projects, /daily-preview-system\.jpg/);
  for (const name of ["research-demographics.jpg", "research-interviews.jpg", "research-functions.jpg", "research-feature-system.jpg", "research-moodboard.jpg"]) {
    assert.match(projects, new RegExp(name));
  }
  assert.match(home, /p\.previewImages \|\| p\.images/);
  assert.match(folder, /project\.previewImages \|\| project\.images/);
  assert.match(woof, /project\.detailImages \|\| project\.images/);
  assert.match(translations, /nextId: "daily-reading"/);
});
```

- [ ] **Step 2: Run the focused test and verify red**

Run:

```bash
export PATH='/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:'"$PATH"
node --test test/portfolioCuration.test.mjs
```

Expected: FAIL because the approved order, asset names, and routing fields do not exist.

### Task 2: Optimize and register the eight supplied images

**Files:**
- Create: `src/assets/whelk/whelk-main-preview.jpg`
- Create: `src/assets/daily-reading/daily-preview-illustration.jpg`
- Create: `src/assets/daily-reading/daily-preview-system.jpg`
- Create: `src/assets/woof/research-demographics.jpg`
- Create: `src/assets/woof/research-interviews.jpg`
- Create: `src/assets/woof/research-functions.jpg`
- Create: `src/assets/woof/research-feature-system.jpg`
- Create: `src/assets/woof/research-moodboard.jpg`
- Modify: `src/data/projects.js`

**Interfaces:**
- Consumes: Eight supplied 1920x1080 PNG files.
- Produces: Eight descriptive JPEG asset paths and `getWoof(name)` for project data.

- [ ] **Step 1: Convert the source images without resizing**

Run:

```bash
mkdir -p src/assets/woof
sips -s format jpeg -s formatOptions 84 '/Users/ttao/Downloads/卢森涛｜品牌视觉设计作品集｜优化版/50.png' --out src/assets/whelk/whelk-main-preview.jpg
sips -s format jpeg -s formatOptions 84 '/Users/ttao/Downloads/卢森涛｜品牌视觉设计作品集｜优化版/10.png' --out src/assets/daily-reading/daily-preview-illustration.jpg
sips -s format jpeg -s formatOptions 84 '/Users/ttao/Downloads/卢森涛｜品牌视觉设计作品集｜优化版/11.png' --out src/assets/daily-reading/daily-preview-system.jpg
sips -s format jpeg -s formatOptions 84 '/Users/ttao/Downloads/卢森涛｜品牌视觉设计作品集｜优化版/19.png' --out src/assets/woof/research-demographics.jpg
sips -s format jpeg -s formatOptions 84 '/Users/ttao/Downloads/卢森涛｜品牌视觉设计作品集｜优化版/23.png' --out src/assets/woof/research-interviews.jpg
sips -s format jpeg -s formatOptions 84 '/Users/ttao/Downloads/卢森涛｜品牌视觉设计作品集｜优化版/24.png' --out src/assets/woof/research-functions.jpg
sips -s format jpeg -s formatOptions 84 '/Users/ttao/Downloads/卢森涛｜品牌视觉设计作品集｜优化版/25.png' --out src/assets/woof/research-feature-system.jpg
sips -s format jpeg -s formatOptions 84 '/Users/ttao/Downloads/卢森涛｜品牌视觉设计作品集｜优化版/27.png' --out src/assets/woof/research-moodboard.jpg
```

- [ ] **Step 2: Verify every asset remains 1920x1080**

Run:

```bash
sips -g pixelWidth -g pixelHeight src/assets/whelk/whelk-main-preview.jpg src/assets/daily-reading/daily-preview-*.jpg src/assets/woof/*.jpg
```

Expected: Every file reports `pixelWidth: 1920` and `pixelHeight: 1080`.

- [ ] **Step 3: Add the WOOF asset loader**

Add to `src/data/projects.js` beside the existing Daily Reading and WHELK loaders:

```js
const woofImages = import.meta.glob("../assets/woof/*.{jpg,png,jpeg}", {
  eager: true,
  import: "default",
});
const getWoof = (name) => woofImages[`../assets/woof/${name}`];
```

### Task 3: Apply preview routing, WOOF detail media, and project order

**Files:**
- Modify: `src/data/projects.js`
- Test: `test/portfolioCuration.test.mjs`

**Interfaces:**
- Consumes: `getW`, `getD`, `getWoof`, and existing portfolio-page assets.
- Produces: Ordered project objects with optional `previewImages: string[]`, `detailImages: string[]`, and `detailImageAlts: string[]`.

- [ ] **Step 1: Add WHELK main-page preview images**

Add inside the WHELK project object:

```js
previewImages: [
  getP("05.jpg"),
  getP("06.jpg"),
  getW("whelk-main-preview.jpg"),
],
```

- [ ] **Step 2: Move Daily Reading to position 02 and add its preview images**

Move the complete Daily Reading object directly after WHELK, set `num: "02"`, and add:

```js
previewImages: [
  getD("hero.jpg"),
  getD("daily-preview-illustration.jpg"),
  getD("daily-preview-system.jpg"),
],
```

- [ ] **Step 3: Move WOOF-WOOF to position 03 and add the detail sequence**

Set `num: "03"` and add:

```js
detailImages: [
  getWoof("research-demographics.jpg"),
  getWoof("research-interviews.jpg"),
  getWoof("research-functions.jpg"),
  getWoof("research-feature-system.jpg"),
  getWoof("research-moodboard.jpg"),
  getP("14.jpg"), getP("15.jpg"), getP("16.jpg"),
  getP("17.jpg"), getP("18.jpg"), getP("19.jpg"),
],
detailImageAlts: [
  "WOOF-WOOF pet-owner demographic research",
  "WOOF-WOOF interview findings and synthesis",
  "WOOF-WOOF provisional application functions",
  "WOOF-WOOF foundational feature system",
  "WOOF-WOOF visual research and moodboard",
  "WOOF-WOOF product visual 1",
  "WOOF-WOOF product visual 2",
  "WOOF-WOOF product visual 3",
  "WOOF-WOOF product visual 4",
  "WOOF-WOOF product visual 5",
  "WOOF-WOOF product visual 6",
],
```

- [ ] **Step 4: Renumber the remaining projects**

Keep their relative order and set:

```text
memory      04
gala        05
storyteller 06
misc        07
```

- [ ] **Step 5: Run the focused test and inspect the expected remaining failures**

Run:

```bash
node --test test/portfolioCuration.test.mjs
```

Expected: Project data and asset assertions pass; renderer assertions still fail until Tasks 4 and 5.

### Task 4: Make the main-page preview components prefer `previewImages`

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/components/ProjectFolderReveal.jsx`
- Test: `test/portfolioCuration.test.mjs`

**Interfaces:**
- Consumes: Optional `project.previewImages: string[]` with fallback to `project.images`.
- Produces: Identical preview selection in the visible three-image grid and interactive folder reveal.

- [ ] **Step 1: Update the main three-image grid**

Replace the direct `p.images` slice in `src/pages/Home.jsx`:

```jsx
{(p.previewImages || p.images).slice(0, 3).map((src, j) => (
  <motion.div
    key={src}
    className="grid-item"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.45, delay: 0.05 * j }}
  >
    <img src={src} alt="" loading={j > 2 ? "lazy" : "eager"} />
  </motion.div>
))}
```

Keep the existing outer `p.images.length > 0` condition because all projects retain their base image arrays.

- [ ] **Step 2: Update the folder reveal**

Replace the first line inside `ProjectFolderReveal` with:

```js
const images = (project.previewImages || project.images).slice(0, 3);
```

- [ ] **Step 3: Run the focused test**

Run:

```bash
node --test test/portfolioCuration.test.mjs
```

Expected: Home and folder routing assertions pass; WOOF detail assertion still fails.

### Task 5: Render the WOOF-WOOF research narrative

**Files:**
- Modify: `src/components/WoofProjectDetail.jsx`
- Test: `test/portfolioCuration.test.mjs`

**Interfaces:**
- Consumes: `project.detailImages?: string[]` and `project.detailImageAlts?: string[]`.
- Produces: The research-to-output image stream with descriptive accessible names.

- [ ] **Step 1: Normalize WOOF-WOOF detail media**

Add after `const detail = projectT.detail;`:

```js
const detailImages = project.detailImages || project.images;
const detailImageAlts = project.detailImageAlts || [];
```

- [ ] **Step 2: Render the normalized detail media**

Replace `project.images.map` with:

```jsx
{detailImages.map((src, index) => (
  <motion.figure key={src} {...reveal(reduceMotion, Math.min(index * 0.035, 0.14))}>
    <img
      src={src}
      alt={detailImageAlts[index] || `${projectT.title} project image ${index + 1}`}
      loading={index > 1 ? "lazy" : "eager"}
    />
  </motion.figure>
))}
```

- [ ] **Step 3: Run the focused test and verify green**

Run:

```bash
node --test test/portfolioCuration.test.mjs
```

Expected: PASS.

### Task 6: Synchronize translation navigation metadata

**Files:**
- Modify: `src/i18n.jsx`
- Test: `test/portfolioCuration.test.mjs`

**Interfaces:**
- Consumes: Approved project order.
- Produces: Consistent Chinese and English `nextId` and `nextTitle` metadata.

- [ ] **Step 1: Update the Chinese navigation cycle**

Set the metadata to:

```text
whelk         -> daily-reading
daily-reading -> woof
woof          -> memory
memory        -> gala
gala          -> storyteller
storyteller   -> misc
misc          -> whelk
```

Use the existing Chinese project titles for `nextTitle`.

- [ ] **Step 2: Update the English navigation cycle**

Apply the same ID cycle and use existing English project titles for `nextTitle`.

- [ ] **Step 3: Run focused and full tests**

Run:

```bash
node --test test/portfolioCuration.test.mjs
pnpm test
```

Expected: Focused test passes and the full suite reports zero failures.

### Task 7: Build and visually verify every ordered surface

**Files:**
- Verify: `src/data/projects.js`
- Verify: `src/pages/Home.jsx`
- Verify: `src/components/HoverProjectReveal.jsx`
- Verify: `src/components/WoofProjectDetail.jsx`

**Interfaces:**
- Consumes: Completed asset and data routing.
- Produces: Verified production output and a browser-visible ordered portfolio.

- [ ] **Step 1: Run production and formatting checks**

Run:

```bash
pnpm build
git diff --check
```

Expected: Vite exits 0 and `git diff --check` emits no output.

- [ ] **Step 2: Verify the entry page**

Open `/entry` and confirm the list order is WHELK, Daily Reading, WOOF-WOOF, Backflow of Memory, FRIDAY, The Storyteller, Miscellaneous.

- [ ] **Step 3: Verify the main page and directory**

Open `/portfolio` and confirm:

- Directory and project stream share the approved order and numbers 01-07.
- WHELK preview image three is the new rug-and-mugs composition.
- Daily Reading preview images two and three are the supplied illustration and overview board.
- Interactive folder previews use the same three-image sets.

- [ ] **Step 4: Verify the WOOF-WOOF detail page**

Open `/project/woof` and confirm the five research boards precede the existing product imagery in the approved order.

- [ ] **Step 5: Verify desktop and mobile image health**

At default desktop width and 390x844, confirm:

```js
({
  broken: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).length,
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
})
```

Expected: `{ broken: 0, overflow: false }` on the main page and WOOF-WOOF detail page.

- [ ] **Step 6: Review the complete change scope before committing**

Run:

```bash
git status --short
git diff --stat
git diff -- src/data/projects.js src/pages/Home.jsx src/components/ProjectFolderReveal.jsx src/components/WoofProjectDetail.jsx src/i18n.jsx test/portfolioCuration.test.mjs
```

Confirm the new work preserves all pre-existing uncommitted portfolio changes. Do not discard or overwrite unrelated modifications.

- [ ] **Step 7: Commit only after scope review**

Stage the new assets, test, plan, and reviewed implementation files:

```bash
git add src/assets/whelk/whelk-main-preview.jpg src/assets/daily-reading/daily-preview-illustration.jpg src/assets/daily-reading/daily-preview-system.jpg src/assets/woof test/portfolioCuration.test.mjs docs/superpowers/plans/2026-07-17-portfolio-order-and-image-routing.md src/data/projects.js src/pages/Home.jsx src/components/ProjectFolderReveal.jsx src/components/WoofProjectDetail.jsx src/i18n.jsx
git diff --cached --check
git commit -m "feat: curate portfolio order and project media"
```

Expected: Commit succeeds only after the cached diff is reviewed and contains the intended portfolio work.
