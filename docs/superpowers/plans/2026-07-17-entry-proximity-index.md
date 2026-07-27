# Entry Proximity Index Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the entry-page project list into a distance-responsive text index with numbered ticks, retain matching project previews, and replace its taskbar/button chrome with a pure-text grid layout.

**Architecture:** Keep `HoverProjectReveal` as the only component that reads `projects` and creates project links. It will maintain a ref for every row and update each link's `--proximity` custom property in one requestAnimationFrame loop; React state retains only the closest active project for the preview. `InteractiveCover` remains responsible for entry destinations, but its top and bottom controls become simple grid-aligned text controls. CSS derives visual interpolation from `--proximity` and disables the pointer-only effect on small/reduced-motion contexts.

**Tech Stack:** React 19, React Router 7, Framer Motion, CSS custom properties, requestAnimationFrame, Vite 4

## Global Constraints

- Preserve existing project order, routes, i18n project titles, hover preview source images, and entry fade behavior.
- Keep the olive glass and mouse-driven light rays; do not add dependencies, images, fonts, or `motion/react`.
- Use acid yellow only as the active index/tick emphasis; do not introduce another accent color.
- Preserve keyboard navigation, touch-device project links, and direct navigation under `prefers-reduced-motion`.
- Keep unrelated uncommitted changes intact.

---

### Task 1: Add the proximity-driven project index

**Files:**
- Modify: `src/components/HoverProjectReveal.jsx:1-58`
- Modify: `src/styles.css:49-58, 354-362, 432-440`

**Interfaces:**
- Consumes: `projects`, `t`, and each project's `id`, `hero`, and translated title.
- Produces: `.cover-project-row` links with inline CSS property `--proximity` in the inclusive `0–1` range, plus `is-active` only for the closest project.
- Preserves: `Link to={\`/project/${project.id}\`}` and `.cover-project-preview` rendering for active non-misc projects.

- [ ] **Step 1: Add row, animation, and closest-project refs before the component return.**

  Add these imports and stateful values. The numeric constants create a 148px smooth proximity field and cap the horizontal movement at 24px in CSS.

  ```jsx
  import { useCallback, useEffect, useRef, useState } from "react";

  const PROXIMITY_RADIUS = 148;
  const SMOOTHING_MS = 110;

  const rowRefs = useRef([]);
  const targetRef = useRef([]);
  const currentRef = useRef([]);
  const frameRef = useRef(null);
  const lastFrameRef = useRef(0);
  ```

- [ ] **Step 2: Write the failing browser check before changing the list markup.**

  With the Vite server running, open `/` and evaluate the current entry list. The check must fail because it has no project index/tick and no `--proximity` property:

  ```js
  const rows = [...document.querySelectorAll(".cover-project-row")];
  if (rows.length !== 7 || rows.some((row) => !row.querySelector(".cover-project-index")) || rows.some((row) => !row.style.getPropertyValue("--proximity"))) {
    throw new Error("RED: entry project rows have not been converted to a proximity index");
  }
  ```

- [ ] **Step 3: Add a requestAnimationFrame proximity loop and pointer handlers.**

  Add `runFrame`, `startLoop`, `handlePointerMove`, and `clearProximity` inside `HoverProjectReveal`. The loop must interpolate `currentRef.current[index]` toward `targetRef.current[index]`, write `--proximity` to each row link, and set `hovered` to the largest target index after every pointer update.

  ```jsx
  const runFrame = useCallback((now) => {
    const dt = Math.min((now - lastFrameRef.current) / 1000, 0.05);
    const k = 1 - Math.exp(-dt / (SMOOTHING_MS / 1000));
    let moving = false;

    rowRefs.current.forEach((row, index) => {
      if (!row) return;
      const target = targetRef.current[index] ?? 0;
      const current = currentRef.current[index] ?? 0;
      const next = current + (target - current) * k;
      const value = Math.abs(target - next) < 0.0015 ? target : next;
      currentRef.current[index] = value;
      row.style.setProperty("--proximity", value.toFixed(4));
      if (value !== target) moving = true;
    });

    frameRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, []);

  const startLoop = useCallback(() => {
    if (frameRef.current != null) return;
    lastFrameRef.current = performance.now();
    frameRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback((event) => {
    if (!finePointer || reduceMotion) return;
    const nextTargets = rowRefs.current.map((row) => {
      if (!row) return 0;
      const rect = row.getBoundingClientRect();
      const distance = Math.abs(event.clientY - (rect.top + rect.height / 2));
      return Math.max(0, 1 - distance / PROXIMITY_RADIUS) ** 2;
    });
    targetRef.current = nextTargets;
    const closest = nextTargets.reduce((best, value, index) => value > nextTargets[best] ? index : best, 0);
    setHovered(nextTargets[closest] > 0 ? closest : null);
    startLoop();
  }, [finePointer, reduceMotion, startLoop]);

  const clearProximity = useCallback(() => {
    targetRef.current = rowRefs.current.map(() => 0);
    setHovered(null);
    startLoop();
  }, [startLoop]);
  ```

- [ ] **Step 4: Replace each title-only link content with the numbered index structure.**

  Set the `ref` on the existing `Link`, call `handlePointerMove` from the list wrapper, and replace the link child with these decorative and semantic elements:

  ```jsx
  <Link
    ref={(element) => { rowRefs.current[index] = element; }}
    to={`/project/${project.id}`}
    className={`cover-project-row${active ? " is-active" : ""}`}
    style={{ "--proximity": active ? 1 : 0 }}
    onFocus={() => setHovered(index)}
    onBlur={clearProximity}
  >
    <span className="cover-project-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
    <span className="cover-project-tick" aria-hidden="true" />
    <span className="cover-project-title">{translated.title}</span>
  </Link>
  ```

  On `.cover-project-list`, use `onPointerMove={handlePointerMove}` and `onPointerLeave={clearProximity}`. In the cleanup effect, cancel a pending `frameRef.current`.

- [ ] **Step 5: Add the proximity CSS and pointer fallbacks.**

  Add the following selectors near the existing entry project styles. The values derive every visual change from `--proximity`; no CSS transition should compete with the rAF interpolation.

  ```css
  .cover-project-list{width:min(100%,780px);align-items:stretch;gap:clamp(.28rem,.8vh,.62rem)}
  .cover-project-row{--proximity:0;display:grid;grid-template-columns:2.4rem 3.8rem minmax(0,1fr);align-items:center;justify-content:start;min-height:clamp(2.75rem,5.1vh,4rem);padding:.08rem 0;color:rgba(255,253,245,.38);transform:translateX(calc(var(--proximity) * 24px)) scale(calc(1 + var(--proximity) * .075));transform-origin:left center;opacity:calc(.56 + var(--proximity) * .44);will-change:transform,color,opacity}
  .cover-project-index{font-size:.58rem;font-weight:750;letter-spacing:.12em;color:rgba(255,253,245,.38);font-variant-numeric:tabular-nums}
  .cover-project-tick{display:block;width:calc(1.3rem + var(--proximity) * 2rem);height:1px;background:color-mix(in srgb,var(--accent) calc(var(--proximity) * 100%),rgba(255,253,245,.32));transform-origin:left center}
  .cover-project-title{font-size:clamp(1.55rem,3vw,2.65rem);line-height:1.02;text-align:left}
  .cover-project-row.is-active .cover-project-index{color:var(--accent)}
  .cover-project-row:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
  ```

  In `@media(max-width:900px)` and `@media(prefers-reduced-motion:reduce)`, reset the transform/opacity to static values and hide no essential project text:

  ```css
  .cover-project-row{grid-template-columns:2rem 2.4rem minmax(0,1fr);transform:none!important;opacity:1}
  .cover-project-tick{width:1.15rem}
  ```

- [ ] **Step 6: Re-run the entry browser check and verify preview ownership.**

  At desktop width, move the pointer over the WHELK row. Expect seven index/tick pairs, a `--proximity` value above `0.9` on WHELK, lower non-zero values on nearby rows, and a WHELK preview opacity above `0.9`. At 390px width, expect the preview to be `display: none`, all seven links visible, and no horizontal overflow.

### Task 2: Replace entry chrome with pure-text grid navigation and a double-arrow entry link

**Files:**
- Modify: `src/components/InteractiveCover.jsx:45-79`
- Modify: `src/styles.css:45-62, 414-420`

**Interfaces:**
- Consumes: existing `enterPortfolio(destination)` callback and language text.
- Produces: `.cover-text-nav` and `.cover-enter-link` controls; both retain their existing click destinations.
- Preserves: entry page wheel handling, `isExiting` fade class, and `LightRays`/glass layering.

- [ ] **Step 1: Replace the navigation wrapper with text-only grid controls.**

  Replace the `motion.nav` class and inner wrapper with:

  ```jsx
  <motion.nav className="cover-text-nav" aria-label={lang === "zh" ? "入口导航" : "Entry navigation"} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}>
    <button type="button" className="cover-text-nav-item cover-text-nav-work" onClick={() => enterPortfolio("/portfolio#work")}><span aria-hidden="true">01</span> WORK</button>
    <button type="button" className="cover-text-nav-item cover-text-nav-info" onClick={() => enterPortfolio("/portfolio#info")}><span aria-hidden="true">02</span> INFO</button>
    <button type="button" className="cover-text-nav-item cover-text-nav-contact" onClick={() => enterPortfolio("/portfolio#contact")}><span aria-hidden="true">03</span> {lang === "zh" ? "联系我" : "CONTACT"}</button>
  </motion.nav>
  ```

- [ ] **Step 2: Replace the bottom pill with the double-arrow text link.**

  Keep the existing `motion.button` timing and callback, but use this content and class:

  ```jsx
  <motion.button type="button" className="cover-enter-link" onClick={() => enterPortfolio()} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, delay: 0.08 }}>
    <span className="cover-enter-label">{lang === "zh" ? "进入作品集" : "Enter portfolio"}</span>
    <span className="cover-enter-subtitle">{lang === "zh" ? "ENTER PORTFOLIO" : "进入作品集"}</span>
    <span className="cover-enter-double-arrow" aria-hidden="true">↓↓</span>
  </motion.button>
  ```

- [ ] **Step 3: Add pure-text grid styles and delete obsolete taskbar/pill selectors.**

  Delete `.cover-nav*`, `.cover-enter-button*`, and `.cover-enter-arrow`. Add:

  ```css
  .cover-text-nav,.cover-enter-link{width:min(100%,1320px);margin:0 auto;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));align-items:center}
  .cover-text-nav{padding:.35rem 0;color:rgba(255,253,245,.56)}
  .cover-text-nav-item{justify-self:start;display:inline-flex;align-items:baseline;gap:.55rem;min-height:2.5rem;padding:.2rem 0;color:inherit;font-size:.65rem;font-weight:750;letter-spacing:.1em;transition:color .2s ease,transform .2s ease}
  .cover-text-nav-item>span{font-size:.52rem;color:rgba(255,253,245,.36);font-variant-numeric:tabular-nums}
  .cover-text-nav-info{grid-column:6 / span 2;justify-self:center}
  .cover-text-nav-contact{grid-column:11 / span 2;justify-self:end}
  .cover-text-nav-item:hover{color:#fffdf5;transform:translateY(-1px)}
  .cover-text-nav-item:focus-visible,.cover-enter-link:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
  .cover-enter-link{justify-self:center;grid-template-columns:auto auto auto;column-gap:.7rem;width:auto;min-height:2.5rem;padding:.2rem 0;color:rgba(255,253,245,.72);font-weight:700;letter-spacing:.08em;transition:color .2s ease,transform .2s ease}
  .cover-enter-label{font-size:.7rem}
  .cover-enter-subtitle{font-size:.52rem;color:rgba(255,253,245,.42)}
  .cover-enter-double-arrow{font-size:1rem;letter-spacing:-.22em;transform:translateY(-.05em)}
  .cover-enter-link:hover{color:var(--accent);transform:translateY(2px)}
  ```

  At `max-width:500px`, use a three-column text navigation and let the entry label stack naturally:

  ```css
  .cover-text-nav{grid-template-columns:repeat(3,minmax(0,1fr));gap:.35rem}
  .cover-text-nav-item{min-height:2.2rem;font-size:.51rem;gap:.28rem}
  .cover-text-nav-info,.cover-text-nav-contact{grid-column:auto;justify-self:center}
  .cover-text-nav-contact{justify-self:end}
  .cover-enter-link{column-gap:.48rem}
  .cover-enter-subtitle{display:none}
  ```

- [ ] **Step 4: Verify destinations and visual removal.**

  In the browser, assert `.cover-nav` and `.cover-enter-button` counts are zero, `.cover-text-nav` count is one, and `.cover-enter-double-arrow` text is `↓↓`. Click each top text control and verify the existing fade reaches `/portfolio#work`, `/portfolio#info`, and `/portfolio#contact`; click the bottom text link and verify `/portfolio`.

### Task 3: Build and acceptance pass

**Files:**
- Verify only: `src/components/HoverProjectReveal.jsx`, `src/components/InteractiveCover.jsx`, `src/styles.css`

- [ ] **Step 1: Run the production build.**

  ```bash
  PATH='/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:'"$PATH" \
    /Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
    node_modules/vite/bin/vite.js build
  ```

  Expected: exit status `0`; the existing chunk-size warning is acceptable.

- [ ] **Step 2: Check formatting and the changed working tree.**

  ```bash
  git diff --check
  git status --short
  ```

  Expected: `git diff --check` prints no whitespace errors; do not stage unrelated pre-existing changes.

- [ ] **Step 3: Inspect final desktop and mobile states.**

  At 1440px width, confirm the pure-text top navigation has no background/border, the bottom link has `↓↓`, and moving through the list produces the distance falloff while matching previews appear. At 390px, confirm seven static project links, no preview, readable grid text, no horizontal overflow, and a visible entry link.
