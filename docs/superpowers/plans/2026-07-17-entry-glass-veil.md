# Entry Glass Veil Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the title-led entry page with an olive-green frosted-glass project browser that keeps the mouse-reactive Hero rays and fades directly into the portfolio.

**Architecture:** `InteractiveCover` becomes the visible glass layer: it renders `LightRays` beneath a dedicated veil, keeps the existing project list component, and applies an exit class when the user enters. `EntryTransition` no longer renders a second full-screen scene; it only waits for the CSS fade to finish before `Entry` navigates to the existing destination. The existing `/portfolio` nav remains responsible for the compact navigation after the route changes.

**Tech Stack:** React 19, React Router 7, Framer Motion, OGL-based `LightRays`, CSS, Vite 4

## Global Constraints

- Preserve the existing project order, project data, detail routes, i18n keys, and hover-preview links.
- Keep the warm-white, deep-gray, and acid-yellow system; introduce olive only as the entry-page glass surface.
- Do not add dependencies, images, or a fixed glass texture.
- Preserve keyboard focus behavior, touch-device clickability, and `prefers-reduced-motion` direct navigation.
- Keep all unrelated uncommitted changes intact.

---

### Task 1: Convert the entry surface to a glass-only project browser

**Files:**
- Modify: `src/components/InteractiveCover.jsx:1-118`
- Modify: `src/styles.css:45-85, 375-381, 436-449, 462-468`

**Interfaces:**
- Consumes: existing `onEnter(destination)` callback from `src/pages/Entry.jsx`.
- Produces: `InteractiveCover({ onEnter, isExiting })`, where `isExiting` applies the `.is-exiting` class before route navigation.
- Preserves: `HoverProjectReveal`, which continues to own project links, keyboard focus, hover state, and preview images.

- [ ] **Step 1: Add the exiting prop and replace the plasma/title content with Hero rays plus a glass veil.**

  Replace the component imports, signature, and the leading section content with the following structure. Keep the existing wheel handler, the `HoverProjectReveal` import, and the bottom enter button callback unchanged.

  ```jsx
  import { useRef } from "react";
  import { motion, useReducedMotion } from "framer-motion";
  import { useLanguage } from "../i18n";
  import HoverProjectReveal from "./HoverProjectReveal";
  import LightRays from "./LightRays";

  export default function InteractiveCover({ onEnter, isExiting = false }) {
    const { lang } = useLanguage();
    const reduceMotion = useReducedMotion();
    const wheelLocked = useRef(false);

    const enterPortfolio = (destination = "/portfolio") => onEnter?.(destination);
    const onWheel = (event) => {
      if (wheelLocked.current || event.deltaY < 18) return;
      event.preventDefault();
      wheelLocked.current = true;
      enterPortfolio();
      window.setTimeout(() => { wheelLocked.current = false; }, 900);
    };

    return (
      <section
        className={`interactive-cover${isExiting ? " is-exiting" : ""}`}
        id="portfolio-cover"
        onWheel={onWheel}
      >
        {!reduceMotion && (
          <LightRays
            className="cover-light-rays"
            raysOrigin="top-center"
            raysColor="#e6ff1a"
            raysSpeed={1.5}
            lightSpread={2.8}
            rayLength={5}
            pulsating
            fadeDistance={2}
            saturation={1.2}
            followMouse
            mouseInfluence={0.22}
            noiseAmount={0.5}
            distortion={0}
          />
        )}
        <div className="cover-glass-veil" aria-hidden="true" />

        <motion.nav className="cover-nav" aria-label={lang === "zh" ? "入口导航" : "Entry navigation"} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}>
          <div className="cover-nav-links">
            <button type="button" onClick={() => enterPortfolio("/portfolio#work")}>WORK</button>
            <button type="button" onClick={() => enterPortfolio("/portfolio#info")}>INFO</button>
            <button type="button" onClick={() => enterPortfolio("/portfolio#contact")}>{lang === "zh" ? "联系我" : "CONTACT"}</button>
          </div>
        </motion.nav>

        <div className="cover-main-grid">
          <HoverProjectReveal />
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 2: Replace the existing entry cover CSS with the glass layering and taskbar treatment below.**

  Define the olive variables in `:root`, then replace the old `.entry-page` through `.cover-enter-button small` entry selectors. Keep the existing `HoverProjectReveal` class names so its behavior does not need a code change.

  ```css
  :root{
    --entry-olive:#51592c;
    --entry-olive-deep:#383e20;
    --entry-olive-glass:rgba(81,89,44,.68);
  }

  .entry-page{min-height:100dvh;background:var(--deep)}
  .interactive-cover{position:relative;z-index:110;min-height:100dvh;padding:clamp(1.25rem,3vw,2.5rem) var(--pad) clamp(1.25rem,2.5vw,2rem);display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:clamp(1.25rem,3vh,2.5rem);overflow:hidden;background:var(--deep);color:rgba(255,253,245,.94);isolation:isolate;transition:opacity .38s ease,filter .38s ease}
  .interactive-cover.is-exiting{opacity:0;filter:blur(4px);pointer-events:none}
  .interactive-cover>:not(.cover-light-rays):not(.cover-glass-veil){position:relative;z-index:2}
  .cover-light-rays{position:absolute!important;inset:0;width:100%;height:100%;z-index:0;opacity:.86}
  .cover-glass-veil{position:absolute;inset:0;z-index:1;background:linear-gradient(125deg,rgba(116,126,68,.72),var(--entry-olive-glass) 48%,rgba(50,57,28,.74));backdrop-filter:blur(26px) saturate(116%);-webkit-backdrop-filter:blur(26px) saturate(116%);box-shadow:inset 0 1px 0 rgba(255,253,245,.2),inset 0 -1px 0 rgba(32,37,16,.22);pointer-events:none}
  .cover-nav{width:min(100%,1320px);min-height:64px;margin:0 auto;padding:.55rem .6rem;border:1px solid rgba(255,253,245,.56);border-radius:24px;display:flex;align-items:center;background:rgba(230,255,26,.44);backdrop-filter:blur(30px) saturate(145%);-webkit-backdrop-filter:blur(30px) saturate(145%);box-shadow:inset 0 1px 0 rgba(255,253,245,.72),inset 0 -1px 0 rgba(58,58,58,.08),0 14px 38px rgba(31,35,14,.22)}
  .cover-nav-links{width:100%;display:flex;align-items:center;justify-content:space-around;gap:.35rem}
  .cover-nav-links>button{min-height:44px;padding:0 1rem;border-radius:16px;color:var(--deep);font-size:.68rem;font-weight:800;letter-spacing:.08em;transition:background .2s ease,transform .2s ease}
  .cover-nav-links>button:hover{background:rgba(255,253,245,.34);transform:translateY(-1px)}
  .cover-nav button:focus-visible{outline:2px solid var(--deep);outline-offset:2px}
  .cover-main-grid{width:min(100%,1080px);margin:0 auto;display:flex;align-items:center;justify-content:center;min-height:0}
  .cover-project-reveal{position:relative;width:100%;margin:0 auto;min-width:0}
  .cover-project-row{color:rgba(255,253,245,.45)}
  .cover-project-row.is-active,.cover-project-row:hover,.cover-project-row:focus-visible{color:#fffdf5;opacity:1;transform:scale(1.06)}
  .cover-project-row:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
  .cover-project-preview{background:rgba(255,253,245,.9);border-color:rgba(255,253,245,.42);box-shadow:0 18px 42px rgba(24,28,10,.28),0 3px 10px rgba(24,28,10,.16)}
  .cover-enter-button{justify-self:center;min-height:48px;padding:.68rem 1rem;border-radius:999px;display:flex;align-items:center;gap:.7rem;background:rgba(230,255,26,.44);color:var(--deep);backdrop-filter:blur(30px) saturate(145%);-webkit-backdrop-filter:blur(30px) saturate(145%);border:1px solid rgba(255,253,245,.58);box-shadow:inset 0 1px 0 rgba(255,253,245,.72),inset 0 -1px 0 rgba(58,58,58,.08),0 10px 30px rgba(24,28,10,.2);font-size:.72rem;font-weight:700;transition:transform .25s ease,background .25s ease}
  .cover-enter-button:hover{transform:translateY(-2px);background:rgba(230,255,26,.62)}
  .cover-enter-button:focus-visible{outline:2px solid #fffdf5;outline-offset:3px}
  .cover-enter-button small{font-size:.55rem;font-weight:650;letter-spacing:.08em;color:rgba(58,58,58,.68)}
  ```

- [ ] **Step 3: Update the three responsive blocks that still reference title, plasma, and old nav selectors.**

  In `@media(max-width:900px)`, retain the full-height cover and preview hiding while removing obsolete title rules:

  ```css
  @media(max-width:900px){
    .interactive-cover{min-height:100dvh;height:auto;overflow:visible}
    .cover-main-grid{width:100%;padding-top:1rem}
    .cover-project-reveal{display:block;width:100%}
    .cover-project-preview{display:none}
    .cover-project-row{min-height:0}
  }
  ```

  In `@media(max-width:500px)`, keep compact taskbar/button rules but remove `.cover-nav-brand`, `.cover-nav-contact`, and title selectors:

  ```css
  @media(max-width:500px){
    .interactive-cover{padding-top:1rem;gap:1.5rem}
    .cover-nav{min-height:54px;padding:.38rem .4rem;border-radius:19px}
    .cover-nav-links{gap:.05rem}
    .cover-nav-links>button{min-height:38px;padding:0 .7rem;font-size:.52rem;border-radius:13px;letter-spacing:.045em}
    .cover-project-row{min-height:0;padding:.08em 0}
    .cover-project-title{font-size:clamp(1.4rem,7vw,2rem);line-height:1.06}
    .cover-enter-button{min-height:44px;padding:.6rem .85rem}
  }
  ```

  In `@media(prefers-reduced-motion:reduce)`, replace the old plasma/veil fallback with:

  ```css
  .cover-light-rays{display:none}
  .cover-glass-veil{backdrop-filter:none;-webkit-backdrop-filter:none;background:var(--entry-olive-deep)}
  .interactive-cover{transition:none}
  ```

- [ ] **Step 4: Inspect the entry surface before wiring the fade.**

  Run the development server and inspect `http://127.0.0.1:4176/` at desktop width and 390px width. Confirm these observations before moving on:

  - No name or portfolio title remains in the entry page DOM or viewport.
  - The yellow taskbar contains only WORK, INFO, and CONTACT.
  - Moving the mouse changes the dim ray texture beneath the olive glass.
  - A project hover makes its name larger, dims siblings, and reveals its preview only on desktop.

- [ ] **Step 5: Commit the focused surface change.**

  ```bash
  git add src/components/InteractiveCover.jsx src/styles.css
  git commit -m "feat: restyle entry as glass project browser"
  ```

### Task 2: Replace the full-screen copy transition with the glass-layer fade

**Files:**
- Modify: `src/pages/Entry.jsx:7-33`
- Modify: `src/components/EntryTransition.jsx:1-64`
- Modify: `src/styles.css:27-34`

**Interfaces:**
- Consumes: `transitioning` state in `Entry` and existing `finishEntry()` route callback.
- Produces: `InteractiveCover` receives `isExiting={transitioning}`; `EntryTransition` calls `onComplete` after exactly 380ms when `active` becomes true.
- Preserves: the existing `transitionLock` against repeated wheel/click entry and immediate navigation for reduced-motion users.

- [ ] **Step 1: Pass the state that drives the CSS fade into the cover.**

  Change the entry render to:

  ```jsx
  return (
    <main className="entry-page">
      <InteractiveCover onEnter={beginEntry} isExiting={transitioning} />
      <EntryTransition active={transitioning} onComplete={finishEntry} />
    </main>
  );
  ```

- [ ] **Step 2: Replace the old GSAP/light-ray transition component with a timer-only completion controller.**

  Replace all of `src/components/EntryTransition.jsx` with:

  ```jsx
  import { useEffect } from "react";

  const EXIT_DURATION_MS = 380;

  export default function EntryTransition({ active, onComplete }) {
    useEffect(() => {
      if (!active) return undefined;

      const timeoutId = window.setTimeout(onComplete, EXIT_DURATION_MS);
      return () => window.clearTimeout(timeoutId);
    }, [active, onComplete]);

    return null;
  }
  ```

- [ ] **Step 3: Delete the obsolete `.entry-transition*` CSS block.**

  Remove selectors `.entry-transition`, `.entry-transition-background`, `.entry-transition-rays`, `.entry-transition-glass`, `.entry-transition-title`, `.entry-transition-char`, and `.entry-transition-en`. The Task 1 `.interactive-cover.is-exiting` transition is the only entry-exit visual.

- [ ] **Step 4: Verify interaction behavior in the browser.**

  With the Vite server running, perform these manual checks:

  1. Click `进入作品集`; expect the entire glass page, including the taskbar, to fade and blur for roughly 0.38 seconds before `/portfolio` loads.
  2. Return to `/`, use one deliberate downward wheel gesture; expect the same destination and no duplicate navigation.
  3. Return to `/`, click WORK, INFO, and CONTACT independently; expect `/portfolio#work`, `/portfolio#info`, and `/portfolio#contact` respectively after the same short fade.
  4. Enable reduced motion in browser rendering emulation; expect entry actions to navigate immediately and the ray canvas to be absent.

- [ ] **Step 5: Run regression checks and commit.**

  ```bash
  PATH='/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:'"$PATH" \
    /Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
    node_modules/vite/bin/vite.js build
  git diff --check
  git add src/pages/Entry.jsx src/components/EntryTransition.jsx src/styles.css
  git commit -m "feat: simplify entry portfolio transition"
  ```

  Expected: Vite completes successfully (the existing main-chunk warning is acceptable) and `git diff --check` prints no errors.

### Task 3: Final route and responsive acceptance pass

**Files:**
- Verify only: `src/pages/Entry.jsx`, `src/components/InteractiveCover.jsx`, `src/components/HoverProjectReveal.jsx`, `src/components/EntryTransition.jsx`, `src/styles.css`

**Interfaces:**
- Consumes: the completed entry surface and timed fade from Tasks 1–2.
- Produces: visual acceptance evidence only; no product code change unless a regression is found.

- [ ] **Step 1: Verify the entry route at desktop and mobile dimensions.**

  At 1440px and 390px widths, confirm that the taskbar remains inside the viewport, the seven project links remain reachable, the bottom enter button remains visible, and no horizontal scrollbar appears.

- [ ] **Step 2: Verify project preview links and detail routes.**

  Hover/focus WHELK and MetaKeys on desktop, then click each project title. Confirm the preview uses the matching hero image and the routes resolve to `/project/whelk` and `/project/metakeys`.

- [ ] **Step 3: Verify the portfolio handoff.**

  Use the entry button and a wheel gesture to enter `/portfolio`. Confirm the Hero renders from its top, uses its existing deep-gray ray background, and the compact standard nav replaces the wide entry taskbar without any residual title-transition content.

- [ ] **Step 4: Record final repository state.**

  ```bash
  git status --short
  git log -2 --oneline
  ```

  Expected: only the pre-existing user changes and the explicitly created entry-change commits appear; no generated `dist/` output is staged.
