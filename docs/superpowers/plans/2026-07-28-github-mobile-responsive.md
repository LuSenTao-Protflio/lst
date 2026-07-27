# GitHub Current Version Mobile and Tablet Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adapt GitHub `origin/main@6730bd1` for phone and iPad, including automatic scroll-activated three-image folder previews on touch devices, without changing the current desktop design or portfolio content.

**Architecture:** Keep the existing React, Framer Motion, and single-stylesheet architecture. Add one focused hook for coarse-pointer `IntersectionObserver` activation, integrate it with the existing `activeFolder` state, and add layered responsive CSS contracts for phone, portrait tablet, landscape tablet, and desktop. Existing source-contract tests are extended task-by-task, followed by real browser verification.

**Tech Stack:** React 19, React Router 7, Framer Motion 12, vanilla CSS, Node test runner, Vite

## Global Constraints

- Source of truth is GitHub `origin/main` at baseline commit `6730bd1`.
- Do not use or cherry-pick the old `HANDOFF.md`, old responsive worktree, or old responsive commits.
- Preserve acid yellow `#E6FF1A`, warm white, deep gray, and the current dark visual system.
- Preserve Prelude, entry, ambient light rays, Climate Crisis typography, custom cursor, click rings, highlighter tags, glass navigation, project taskbar, and floating navigation.
- Preserve all current routes, project order, copy, WebP image selection, and desktop interactions.
- Preserve desktop directory dark-row/title-scale hover and yellow-folder three-image hover reveal.
- Touch users must never require hover to understand or open a project.
- Phone and tablet must not produce horizontal overflow.
- The complete project block remains one semantic link and opens the detail page on the first tap.
- Do not add a dependency, route, project, image, font, CMS, or continuous unthrottled scroll listener.
- Do not deploy until every required viewport, route, automated test, and production build passes.

---

### Task 1: Restore the GitHub Baseline Test Suite

**Files:**

- Modify: `test/portfolioCuration.test.mjs`
- Modify: `test/whelkApplications.test.mjs`

**Interfaces:**

- Consumes: the current `.webp` filenames already used by `src/data/projects.js`.
- Produces: a passing pre-responsive baseline; no production-code change.

- [ ] **Step 1: Record the existing failure**

Run:

```bash
pnpm test
```

Expected: 22 tests pass and 2 tests fail because `portfolioCuration.test.mjs` and `whelkApplications.test.mjs` still assert `.jpg` names after GitHub commit `0258f2d` converted those assets to `.webp`.

- [ ] **Step 2: Update portfolio curation assertions to current WebP names**

In `test/portfolioCuration.test.mjs`, replace:

```js
assert.match(projects, /whelk-main-preview\.jpg/);
assert.match(projects, /daily-preview-illustration\.jpg/);
assert.match(projects, /daily-preview-system\.jpg/);
```

with:

```js
assert.match(projects, /whelk-main-preview\.webp/);
assert.match(projects, /daily-preview-illustration\.webp/);
assert.match(projects, /daily-preview-system\.webp/);
```

Replace the WOOF filename list with:

```js
for (const name of [
  "research-demographics.webp",
  "research-interviews.webp",
  "research-functions.webp",
  "research-feature-system.webp",
  "research-moodboard.webp",
]) {
  assert.match(projects, new RegExp(name));
}
```

- [ ] **Step 3: Update WHELK application assertions**

In `test/whelkApplications.test.mjs`, use:

```js
for (const name of [
  "wash-label.webp",
  "rug.webp",
  "fabric-bag.webp",
  "charm.webp",
  "mugs.webp",
]) {
  assert.match(projects, new RegExp(name));
}
```

- [ ] **Step 4: Run focused and complete tests**

Run:

```bash
node --test test/portfolioCuration.test.mjs test/whelkApplications.test.mjs
pnpm test
```

Expected: all 24 baseline tests PASS.

- [ ] **Step 5: Commit the baseline repair**

Run:

```bash
git diff --check
git add test/portfolioCuration.test.mjs test/whelkApplications.test.mjs
git commit -m "test: align portfolio assertions with WebP assets"
```

Expected: the commit changes tests only.

---

### Task 2: Scroll-Activated Folder Preview

**Files:**

- Create: `src/hooks/useScrollActivatedFolder.js`
- Modify: `src/pages/Home.jsx`
- Create: `test/scrollActivatedFolder.test.mjs`

**Interfaces:**

- Consumes: existing `activeFolder` state, `hoverFolders` fine-pointer state, `.project` sections, and `ProjectFolderReveal`'s `open` prop.
- Produces: `useScrollActivatedFolder({ enabled, onChange })`, where `enabled` is boolean and `onChange` receives a project ID string or `null`.

- [ ] **Step 1: Write the failing source-contract test**

Create `test/scrollActivatedFolder.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("touch project folders activate from the viewport center without a scroll listener", async () => {
  const [home, hook] = await Promise.all([
    readFile(new URL("../src/pages/Home.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/hooks/useScrollActivatedFolder.js", import.meta.url), "utf8"),
  ]);

  assert.match(home, /useScrollActivatedFolder\(\{/);
  assert.match(home, /enabled:\s*!hoverFolders/);
  assert.match(home, /onChange:\s*setActiveFolder/);
  assert.match(home, /data-project-id=\{p\.id\}/);
  assert.match(hook, /new IntersectionObserver/);
  assert.match(hook, /rootMargin:\s*"-34% 0px -34% 0px"/);
  assert.match(hook, /observer\.disconnect\(\)/);
  assert.doesNotMatch(hook, /addEventListener\(["']scroll["']/);
});

test("project blocks remain first-tap detail links", async () => {
  const home = await readFile(new URL("../src/pages/Home.jsx", import.meta.url), "utf8");

  assert.match(home, /<Link[\s\S]*to=\{`\/project\/\$\{p\.id\}`\}[\s\S]*className="project-hit-area"/);
  assert.doesNotMatch(home, /preventDefault\(\)/);
});
```

- [ ] **Step 2: Run the new test and verify failure**

Run:

```bash
pnpm test -- test/scrollActivatedFolder.test.mjs
```

Expected: FAIL because `src/hooks/useScrollActivatedFolder.js` does not exist.

- [ ] **Step 3: Implement the observer hook**

Create `src/hooks/useScrollActivatedFolder.js`:

```js
import { useEffect, useRef } from "react";

export default function useScrollActivatedFolder({ enabled, onChange }) {
  const activeIdRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      activeIdRef.current = null;
      onChange(null);
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") return undefined;

    const projectNodes = Array.from(
      document.querySelectorAll(".project[data-project-id]"),
    );
    if (projectNodes.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const center = window.innerHeight / 2;
            const aDistance = Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - center);
            const bDistance = Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - center);
            return aDistance - bDistance;
          });

        if (entering.length > 0) {
          const nextId = entering[0].target.dataset.projectId;
          activeIdRef.current = nextId;
          onChange(nextId);
          return;
        }

        const activeEntry = entries.find(
          (entry) => entry.target.dataset.projectId === activeIdRef.current,
        );
        if (activeEntry && !activeEntry.isIntersecting) {
          activeIdRef.current = null;
          onChange(null);
        }
      },
      { rootMargin: "-34% 0px -34% 0px", threshold: 0 },
    );

    projectNodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
      activeIdRef.current = null;
    };
  }, [enabled, onChange]);
}
```

- [ ] **Step 4: Integrate the hook with the existing state**

In `src/pages/Home.jsx`:

```js
import useScrollActivatedFolder from "../hooks/useScrollActivatedFolder";
```

After the fine-pointer media-query effect:

```js
useScrollActivatedFolder({
  enabled: !hoverFolders,
  onChange: setActiveFolder,
});
```

Add the stable observer target:

```jsx
<motion.div
  key={p.id}
  className="project"
  id={p.id}
  data-project-id={p.id}
```

Keep the existing `Link`, pointer enter/leave, focus/blur, and `open={activeFolder === p.id}` logic.

- [ ] **Step 5: Run focused and complete tests**

Run:

```bash
pnpm test -- test/scrollActivatedFolder.test.mjs
pnpm test
```

Expected: both commands PASS.

- [ ] **Step 6: Run build and commit**

Run:

```bash
pnpm build
git diff --check
git add src/hooks/useScrollActivatedFolder.js src/pages/Home.jsx test/scrollActivatedFolder.test.mjs
git commit -m "feat: reveal project folders on touch scroll"
```

Expected: build passes and the commit contains only the hook, Home integration, and focused test.

---

### Task 3: Entry, Hero, Navigation, and About Responsive Layout

**Files:**

- Modify: `src/styles.css`
- Create: `test/mobileShellResponsive.test.mjs`

**Interfaces:**

- Consumes: existing `.prelude`, `.interactive-cover`, `.nav`, `.hero`, `.info-layout`, `.info-photo-wrap`, and `.info-row` structures.
- Produces: layered phone/tablet layout contracts; no JSX interface changes.

- [ ] **Step 1: Write the failing responsive shell test**

Create `test/mobileShellResponsive.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("phone shell uses safe viewport sizing and touch targets", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media\(max-width:599px\)/);
  assert.match(styles, /\.nav\{[^}]*width:calc\(100% - 24px\)[^}]*min-height:48px/);
  assert.match(styles, /\.nav-link,\s*\.nav-lang-btn\{[^}]*min-height:44px/);
  assert.match(styles, /\.hero\{[^}]*min-height:100svh[^}]*height:auto/);
  assert.match(styles, /\.hero-title\{[^}]*font-size:clamp\(3\.25rem,17vw,4\.75rem\)/);
});

test("profile changes from centered phone layout to portrait-tablet columns", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media\(max-width:599px\)[\s\S]*\.info-photo-wrap\{[^}]*width:min\(100%,320px\)[^}]*margin-inline:auto/);
  assert.match(styles, /@media\(max-width:599px\)[\s\S]*\.info-row\{[^}]*display:grid[^}]*grid-template-columns:1fr/);
  assert.match(styles, /@media\(min-width:600px\) and \(max-width:899px\)[\s\S]*\.info-layout\{[^}]*grid-template-columns:minmax\(220px,240px\) minmax\(0,1fr\)/);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```bash
pnpm test -- test/mobileShellResponsive.test.mjs
```

Expected: FAIL because the exact `599px` and `600px–899px` contracts do not exist.

- [ ] **Step 3: Add global responsive foundations**

Append an explicitly labeled responsive override section to `src/styles.css`:

```css
/* ── GitHub mobile/tablet responsive overrides ── */
img,video,canvas{max-width:100%}
#info,#directory,#work,#contact,.project{scroll-margin-top:88px}

@media(max-width:899px){
  html,body,#root{max-width:100%;overflow-x:clip}
}
```

- [ ] **Step 4: Implement the phone shell**

Add under `@media(max-width:599px)`:

```css
@media(max-width:599px){
  :root{--pad:1.15rem}
  #info,#directory,#work,#contact,.project{scroll-margin-top:72px}
  .prelude,.interactive-cover{min-height:100svh;height:auto}
  .cover-project-preview{display:none}
  .nav{width:calc(100% - 24px);min-height:48px;padding:.35rem .8rem;gap:.65rem;flex-wrap:nowrap}
  .nav-links{gap:.55rem}
  .nav-link,.nav-lang-btn{min-height:44px;display:inline-flex;align-items:center}
  .nav-link{font-size:.58rem}
  .nav-lang-btn{height:44px;padding:0 .35rem}
  .hero{min-height:100svh;height:auto;padding:6rem var(--pad) 4rem}
  .hero-content{padding-top:1rem}
  .hero-title{font-size:clamp(3.25rem,17vw,4.75rem);line-height:.86}
  .hero-meta{grid-template-columns:1fr;gap:.65rem;margin-top:2rem}
  .hero-meta span:nth-child(2),.hero-meta span:nth-child(3){text-align:left}
  .info{padding:3rem var(--pad) 6rem}
  .info-layout{grid-template-columns:1fr;gap:2.25rem}
  .info-photo-wrap{position:static;width:min(100%,320px);max-width:none;margin-inline:auto}
  .info-row{display:grid;grid-template-columns:1fr;gap:.45rem;padding-bottom:1.35rem}
  .info-row-label{padding-top:0}
}
```

If an earlier `max-width:500px` rule has equal specificity, keep this override later in the file so the `599px` contract wins.

- [ ] **Step 5: Implement portrait-tablet information columns**

Add:

```css
@media(min-width:600px) and (max-width:899px){
  .info-layout{grid-template-columns:minmax(220px,240px) minmax(0,1fr);gap:clamp(1.75rem,4vw,2.25rem)}
  .info-photo-wrap{position:static;max-width:none}
  .info-photo-contact-card{width:88%}
}
```

- [ ] **Step 6: Run tests, build, and commit**

Run:

```bash
pnpm test -- test/mobileShellResponsive.test.mjs
pnpm test
pnpm build
git diff --check
git add src/styles.css test/mobileShellResponsive.test.mjs
git commit -m "style: adapt portfolio shell for phone and tablet"
```

Expected: all tests and build PASS.

---

### Task 4: Directory, Project Grid, and Folder Motion Responsive Behavior

**Files:**

- Modify: `src/styles.css`
- Create: `test/mobileProjectsResponsive.test.mjs`

**Interfaces:**

- Consumes: Task 2's `.is-open` state, existing `.dir-row`, `.project-summary`, `.project-inline-folder`, and `.project-grid`.
- Produces: pointer-specific directory/folder states and phone/tablet three-image layouts.

- [ ] **Step 1: Write the failing project-layout test**

Create `test/mobileProjectsResponsive.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("directory separates fine-pointer hover from touch feedback", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media\(hover:hover\) and \(pointer:fine\)[\s\S]*\.dir-row:hover/);
  assert.match(styles, /@media\(hover:none\),\(pointer:coarse\)[\s\S]*\.dir-row:active/);
  assert.match(styles, /\.dir-row:focus-visible/);
});

test("phone projects use a 1 plus 2 preview grid and open folders reach full opacity", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media\(max-width:599px\)[\s\S]*\.project-grid\{[^}]*display:grid[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(styles, /@media\(max-width:599px\)[\s\S]*\.grid-item:first-child\{[^}]*grid-column:1\/-1/);
  assert.match(styles, /\.project-inline-folder\.is-open \.project-inline-folder-card\{[^}]*opacity:1/);
});

test("portrait tablet keeps all three project images on one row", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media\(min-width:600px\) and \(max-width:899px\)[\s\S]*\.project-grid\{[^}]*display:grid[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```bash
pnpm test -- test/mobileProjectsResponsive.test.mjs
```

Expected: FAIL because pointer-specific media rules and grid contracts are absent.

- [ ] **Step 3: Scope desktop directory hover and add touch feedback**

Move or override hover-only behavior under:

```css
@media(hover:hover) and (pointer:fine){
  .dir-row:hover{opacity:1;color:var(--lime);background:var(--surface-raised);box-shadow:0 0 0 100vmax var(--surface-raised)}
  .dir-row:hover .dir-row-num{color:var(--accent)}
  .dir-row:hover .dir-row-title{transform:translateX(.18em) scale(1.12)}
  .dir-row:hover .dir-row-en{color:rgba(230,255,26,.7)}
  .dir-row:hover .dir-row-tags span{color:var(--lime);border-color:var(--lime)}
}

.dir-row:focus-visible{color:var(--lime);background:var(--surface-raised);box-shadow:0 0 0 100vmax var(--surface-raised);outline:2px solid var(--accent);outline-offset:-2px}
.dir-row:focus-visible .dir-row-title{transform:translateX(.18em) scale(1.12)}

@media(hover:none),(pointer:coarse){
  .dir-row{touch-action:manipulation}
  .dir-row:active{color:var(--lime);background:var(--surface-raised);box-shadow:0 0 0 100vmax var(--surface-raised)}
  .dir-row:active .dir-row-title{transform:translateX(.1em) scale(1.03)}
}
```

Remove or neutralize unscoped duplicate hover rules so touch browsers do not inherit sticky hover states.

- [ ] **Step 4: Make `.is-open` the touch folder source of truth**

Keep full-opacity open behavior outside pointer media:

```css
.project-inline-folder.is-open .project-inline-folder-card{opacity:1}
```

Keep the existing three transforms, flap rotation, and front movement for `.is-open`.

Wrap `.project-summary:hover` equivalents in:

```css
@media(hover:hover) and (pointer:fine){
  .project-summary:hover .project-inline-folder-card{opacity:1}
  .project-summary:hover .project-inline-folder-card.card-1{transform:translate3d(-84px,-76px,0) scale(1) rotate(-8deg)}
  .project-summary:hover .project-inline-folder-card.card-2{transform:translate3d(0,-108px,0) scale(1) rotate(1deg)}
  .project-summary:hover .project-inline-folder-card.card-3{transform:translate3d(84px,-74px,0) scale(1) rotate(8deg)}
  .project-summary:hover .project-inline-folder-flap{transform:translateX(-50%) rotateX(-62deg)}
  .project-summary:hover .project-inline-folder-front{transform:translateX(-50%) translateY(3px);box-shadow:0 24px 50px rgba(58,58,58,.22)}
}
```

Preserve focus-within equivalents outside the hover-only media query.

- [ ] **Step 5: Implement phone and tablet project layouts**

Add:

```css
@media(max-width:599px){
  .directory{padding:3rem var(--pad) 5rem}
  .dir-row{grid-template-columns:2.5rem minmax(0,1fr);gap:.7rem;padding:1.15rem 0}
  .dir-row-tags{display:none}
  .project{padding:4rem 0}
  .project-summary{grid-template-columns:1fr;gap:1.75rem}
  .project-inline-folder{justify-self:center;width:min(100%,270px);height:190px}
  .project-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65rem;margin-top:1.75rem}
  .grid-item{min-width:0;width:auto;flex:none}
  .grid-item:first-child{grid-column:1/-1}
}

@media(min-width:600px) and (max-width:899px){
  .project-summary{grid-template-columns:minmax(0,1fr) minmax(230px,260px);gap:1.75rem}
  .project-inline-folder{justify-self:end;width:250px;height:190px}
  .project-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.75rem}
  .grid-item{min-width:0;width:auto;flex:none}
}
```

- [ ] **Step 6: Run tests, build, and commit**

Run:

```bash
pnpm test -- test/mobileProjectsResponsive.test.mjs
pnpm test
pnpm build
git diff --check
git add src/styles.css test/mobileProjectsResponsive.test.mjs
git commit -m "style: adapt project previews for touch layouts"
```

Expected: all tests and build PASS.

---

### Task 5: Project Detail and Shared Footer Responsive Layout

**Files:**

- Modify: `src/styles.css`
- Create: `test/mobileProjectDetails.test.mjs`

**Interfaces:**

- Consumes: existing `ProjectTaskbar`, WOOF, Daily Reading, editorial detail, project pager, `ProjectChrome`, and `SiteFooter` markup.
- Produces: responsive CSS only; no project content or route changes.

- [ ] **Step 1: Write the failing detail contract test**

Create `test/mobileProjectDetails.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("phone taskbar remains readable and touch sized", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media\(max-width:599px\)[\s\S]*\.project-taskbar\{[^}]*min-height:48px/);
  assert.match(styles, /@media\(max-width:599px\)[\s\S]*\.project-taskbar-back\{[^}]*min-height:44px/);
  assert.match(styles, /\.project-taskbar-title\{[^}]*text-overflow:ellipsis[^}]*white-space:nowrap/);
});

test("phone detail layouts preserve image ratios and remove sticky columns", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media\(max-width:799px\)[\s\S]*\.woof-explanation-sticky\{[^}]*position:static/);
  assert.match(styles, /@media\(max-width:799px\)[\s\S]*\.editorial-detail-aside-inner\{[^}]*position:static/);
  assert.match(styles, /@media\(max-width:799px\)[\s\S]*\.woof-image-stream img,\s*\.editorial-story img,\s*\.daily-reading-page img\{[^}]*height:auto/);
});

test("phone pager and shared footer collapse to one column", async () => {
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media\(max-width:599px\)[\s\S]*\.project-pager\{[^}]*grid-template-columns:1fr/);
  assert.match(styles, /@media\(max-width:599px\)[\s\S]*\.footer-inner\{[^}]*grid-template-columns:1fr/);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```bash
pnpm test -- test/mobileProjectDetails.test.mjs
```

Expected: FAIL because the exact `799px` image/sticky contract and phone touch rules are absent.

- [ ] **Step 3: Add the shared below-800px detail contract**

Append:

```css
@media(max-width:799px){
  .woof-exhibition,.metakeys-detail-intro,.editorial-detail-intro{grid-template-columns:1fr;gap:2.25rem}
  .woof-explanation,.metakeys-detail-aside,.editorial-detail-aside{grid-row:1}
  .woof-image-stream,.metakeys-detail-lead,.editorial-detail-lead{grid-row:2}
  .woof-explanation-sticky,.metakeys-detail-aside-inner,.editorial-detail-aside-inner{position:static;max-height:none;overflow:visible}
  .woof-image-stream img,.editorial-story img,.daily-reading-page img{width:100%;height:auto;object-fit:contain}
  .editorial-story-pair,.editorial-story-asymmetric,.editorial-story-remainder,.metakeys-portrait-pair,.metakeys-system-grid,.metakeys-square-pair{grid-template-columns:1fr}
}
```

Do not remove the wider-width sticky layout.

- [ ] **Step 4: Add phone taskbar, pager, footer, and spacing rules**

Under `@media(max-width:599px)` add:

```css
.project-taskbar{top:8px;width:calc(100% - 16px);min-height:48px;padding:.25rem .35rem;grid-template-columns:minmax(64px,1fr) minmax(0,1.45fr) minmax(48px,1fr);gap:.3rem}
.project-taskbar-back{min-height:44px;display:inline-flex;align-items:center;padding:.35rem}
.project-taskbar-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.58rem}
.project-taskbar-order{padding-right:.25rem;font-size:.55rem}
.woof-detail,.metakeys-detail,.editorial-detail,.daily-reading-page{padding-left:var(--pad);padding-right:var(--pad)}
.woof-image-stream,.editorial-story,.metakeys-story{gap:1rem}
.project-pager{grid-template-columns:1fr;gap:1.5rem;padding-bottom:4rem}
.project-pager-next{align-items:flex-start;text-align:left}
.footer{padding:4rem var(--pad)}
.footer-inner{grid-template-columns:1fr;gap:2.25rem}
.footer-email{overflow-wrap:anywhere}
```

- [ ] **Step 5: Add portrait-tablet pager behavior**

Under `@media(min-width:600px) and (max-width:899px)`:

```css
.project-pager{grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem}
.project-taskbar{width:calc(100% - 24px)}
```

- [ ] **Step 6: Run tests, build, and commit**

Run:

```bash
pnpm test -- test/mobileProjectDetails.test.mjs
pnpm test
pnpm build
git diff --check
git add src/styles.css test/mobileProjectDetails.test.mjs
git commit -m "style: adapt all project detail pages for touch screens"
```

Expected: all tests and build PASS.

---

### Task 6: Cross-Route Responsive Regression and Final Source Validation

**Files:**

- Modify if a verified defect is found: `src/styles.css`
- Modify if a verified defect is found: `src/pages/Home.jsx`
- Modify if a verified defect is found: `src/hooks/useScrollActivatedFolder.js`
- Modify if required for Sites build metadata: `scripts/prepare-sites-worker.mjs`
- Test: all files under `test/`

**Interfaces:**

- Consumes: all prior responsive contracts.
- Produces: validated build ready for final review and later deployment.

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
pnpm test
```

Expected: every Node test passes with zero failures.

- [ ] **Step 2: Run the production build and verify hosting artifacts**

Run:

```bash
pnpm build
test -f dist/server/index.js
```

If `.openai/hosting.json` exists in the project, also run:

```bash
test -f dist/.openai/hosting.json
cmp .openai/hosting.json dist/.openai/hosting.json
```

If the hosting metadata check fails, update `scripts/prepare-sites-worker.mjs` to import `copyFile`, create `dist/.openai`, and copy `.openai/hosting.json` to `dist/.openai/hosting.json`; rerun build and both checks.

- [ ] **Step 3: Start the exact branch preview**

Run:

```bash
pnpm dev --host 127.0.0.1 --port 4178
```

Expected: the GitHub-based feature worktree is available at `http://127.0.0.1:4178/`.

- [ ] **Step 4: Verify required viewports and routes**

Use the in-app browser at:

```text
390 × 844
768 × 1024
1024 × 768
1440 × 900
```

Check:

```text
/
/entry
/portfolio
/portfolio#directory
/portfolio#work
/project/whelk
/project/daily-reading
/project/woof
/project/memory
/project/gala
/project/storyteller
/project/misc
/daily-reading
```

For every route/viewport execute:

```js
document.documentElement.scrollWidth <= window.innerWidth
```

Expected: `true`.

- [ ] **Step 5: Verify the scroll-activated folder behavior**

At 390×844 and 768×1024:

1. Open `/portfolio#work`.
2. Scroll until a project summary enters the central viewport band.
3. Confirm exactly that project's `.project-inline-folder` has `is-open`.
4. Confirm its three `.project-inline-folder-card` elements reach computed opacity `1`.
5. Scroll to the next project.
6. Confirm the previous folder closes and the next folder opens.
7. Tap the project block and confirm the first tap navigates to `/project/:id`.

At 1440×900:

1. Hover a project summary.
2. Confirm the folder opens.
3. Move the pointer away.
4. Confirm it closes.
5. Hover a directory row and confirm the dark full-row background and title scale remain.

- [ ] **Step 6: Verify detail navigation**

For each project route:

- page starts at the top;
- taskbar back link returns to `/portfolio#<project-id>`;
- phone taskbar title is not clipped outside the bar;
- WOOF/editorial descriptions are above image streams on phone;
- image aspect ratios remain intact;
- pager and contact/footer remain reachable.

- [ ] **Step 7: Fix only observed defects and rerun their covering checks**

For each observed defect:

1. Record route, viewport, expected behavior, and observed behavior.
2. Make the smallest CSS or hook fix.
3. Rerun the relevant focused test.
4. Recheck the exact route and viewport.
5. Rerun `pnpm test` and `pnpm build` after the last fix.

- [ ] **Step 8: Final diff check and commit**

Run:

```bash
git diff --check
git status --short
git diff --stat origin/main...HEAD
```

Commit only if Task 6 introduced fixes:

```bash
git add src test scripts/prepare-sites-worker.mjs
git commit -m "fix: resolve responsive browser regressions"
```

Expected: clean working tree except explicitly ignored local artifacts; no old responsive or handoff files appear in the diff.
