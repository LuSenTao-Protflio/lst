# Independent Portfolio Entry Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the current introductory cover into a standalone `/` entry page that navigates to the original portfolio at `/portfolio`, while refining the entry layout into a centered, compact, heavier typographic composition.

**Architecture:** Create a route-level `Entry` page that owns entry-only navigation behavior and reuses the existing `InteractiveCover` and `HoverProjectReveal` components. Restore `Home` to the portfolio-only view, add `/portfolio` to the router, and drive the visual refinement through the existing stylesheet without new dependencies.

**Tech Stack:** React 18, React Router 6, Framer Motion, Vite 4, vanilla CSS.

## Global Constraints

- `/` renders only the entry page and `/portfolio` renders the existing full portfolio homepage.
- Downward wheel navigation and the entry button navigate to `/portfolio`; Browser Back returns to `/`.
- Project-detail and WeChat routes remain unchanged.
- Keep the existing warm-white `#fffdf5`, acid-yellow `#e6ff1a`, and neutral-gray `#3a3a3a` palette.
- Reuse existing project data, language context, animation library, and global cursor components.
- Add no dependencies or new visual assets.
- Touch and reduced-motion users must retain usable project links without the floating preview.

---

### Task 1: Split the entry and portfolio routes

**Files:**
- Create: `src/pages/Entry.jsx`
- Modify: `src/App.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/components/InteractiveCover.jsx`
- Modify: `src/components/FloatingGlassNav.jsx`

**Interfaces:**
- Consumes: `InteractiveCover`, React Router's `useNavigate`, and the existing `Home` page.
- Produces: route-level `<Entry />` at `/`, portfolio-only `<Home />` at `/portfolio`, and `InteractiveCover({ onEnter })`.

- [ ] **Step 1: Add a route-source smoke check that initially fails**

Run:

```bash
test -f src/pages/Entry.jsx && rg -q 'path="/portfolio"' src/App.jsx && ! rg -q '<InteractiveCover' src/pages/Home.jsx
```

Expected: non-zero exit because `Entry.jsx` and the `/portfolio` route do not yet exist.

- [ ] **Step 2: Create the route-level entry page**

Create `src/pages/Entry.jsx`:

```jsx
import { useNavigate } from "react-router-dom";
import InteractiveCover from "../components/InteractiveCover";

export default function Entry() {
  const navigate = useNavigate();
  return (
    <main className="entry-page">
      <InteractiveCover onEnter={() => navigate("/portfolio")} />
    </main>
  );
}
```

- [ ] **Step 3: Wire the two route-level pages**

Update `src/App.jsx` so its imports and routes include:

```jsx
import Entry from "./pages/Entry";
import Home from "./pages/Home";

<Routes>
  <Route path="/" element={<Entry />} />
  <Route path="/portfolio" element={<Home />} />
  <Route path="/project/:id" element={<ProjectDetail />} />
  <Route path="/wechat" element={<Wechat />} />
</Routes>
```

Remove the `InteractiveCover` import and `<InteractiveCover />` call from `src/pages/Home.jsx`. Change the original hero back to a portfolio-local header without relying on cover scrolling:

```jsx
<header className="hero" id="portfolio-home">
```

Update `FloatingGlassNav` so `/portfolio` is recognized as the homepage and project pages return to `/portfolio#directory` rather than the entry route.

- [ ] **Step 4: Make entry navigation route-based**

Change `InteractiveCover` to accept an `onEnter` callback and remove DOM scrolling:

```jsx
export default function InteractiveCover({ onEnter }) {
  // existing language, reduced-motion, and wheel-lock state
  const enterPortfolio = () => onEnter?.();

  const onWheel = (event) => {
    if (wheelLocked.current || event.deltaY < 18) return;
    event.preventDefault();
    wheelLocked.current = true;
    enterPortfolio();
    window.setTimeout(() => { wheelLocked.current = false; }, 900);
  };
  // retain the existing JSX and button handler
}
```

- [ ] **Step 5: Re-run the route-source smoke check**

Run:

```bash
test -f src/pages/Entry.jsx && rg -q 'path="/portfolio"' src/App.jsx && ! rg -q '<InteractiveCover' src/pages/Home.jsx
```

Expected: exit 0.

- [ ] **Step 6: Build and commit the route split**

Run:

```bash
PATH='/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:'"$PATH" /Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/vite/bin/vite.js build
git add src/pages/Entry.jsx src/App.jsx src/pages/Home.jsx src/components/InteractiveCover.jsx
git commit -m "feat: split portfolio entry from homepage"
```

Expected: Vite reports `built` and the commit succeeds.

---

### Task 2: Recompose the standalone entry layout

**Files:**
- Modify: `src/components/InteractiveCover.jsx`
- Modify: `src/components/HoverProjectReveal.jsx`
- Modify: `src/styles.css`
- Modify: `VERSION.md`

**Interfaces:**
- Consumes: `projects`, `useLanguage`, Framer Motion pointer springs, and `InteractiveCover({ onEnter })` from Task 1.
- Produces: a centered entry composition, compact heavy project rows, and a 240–280 px floating preview.

- [ ] **Step 1: Capture the required CSS tokens in a failing source check**

Run:

```bash
rg -q 'max-width:780px' src/styles.css && rg -q 'width:min\(270px,24vw\)' src/styles.css && rg -q 'font-weight:800' src/styles.css
```

Expected: non-zero exit because the refined layout tokens are not present together.

- [ ] **Step 2: Simplify and center the cover content structure**

Update `InteractiveCover.jsx` so the title and directory share one centered column:

```jsx
<div className="cover-main-grid">
  <div className="cover-title-block">{/* existing title content */}</div>
  <HoverProjectReveal />
</div>
```

Keep only concise metadata and the existing bilingual title/subtitle. Retain the glass entry button below the directory.

- [ ] **Step 3: Apply the desktop entry composition**

Replace the current two-column cover rules in `src/styles.css` with:

```css
.interactive-cover{min-height:100dvh;display:grid;grid-template-rows:auto 1fr auto;background:var(--bg)}
.cover-main-grid{width:min(100%,780px);margin:0 auto;display:flex;flex-direction:column;align-items:stretch;justify-content:center;gap:clamp(2.3rem,5vh,4rem);padding-top:clamp(1rem,5vh,4rem)}
.cover-title-block{text-align:center;align-self:auto}
.cover-title-mask h1{width:100%;font-size:clamp(3.8rem,7vw,7rem);transform:none;font-weight:850}
.cover-title-highlight-wrap{width:100%;font-size:clamp(2rem,4vw,3.8rem);transform:none;font-weight:850}
.cover-title-en{margin-top:1rem;font-weight:800}
.cover-title-note{margin-top:.45rem}
.cover-project-reveal{width:min(100%,690px);margin:0 auto;align-self:auto;display:block}
.cover-project-preview{width:min(270px,24vw);margin-left:calc(min(270px,24vw) / -2);margin-top:calc(min(270px,24vw) / -3.2)}
.cover-project-row{min-height:clamp(2.65rem,5vh,3.25rem)}
.cover-project-title-window{font-size:clamp(.82rem,1.15vw,1rem);font-weight:800}
.cover-enter-button{justify-self:center}
```

- [ ] **Step 4: Preserve compact mobile behavior**

At the existing mobile breakpoint, ensure the centered title and directory fit naturally:

```css
@media(max-width:700px){
  .cover-main-grid{width:100%;gap:2rem;padding-top:1rem}
  .cover-title-mask h1{font-size:clamp(3rem,15vw,4.6rem)}
  .cover-title-highlight-wrap{font-size:clamp(1.55rem,8vw,2.4rem)}
  .cover-project-row{grid-template-columns:1.75rem minmax(0,1fr);min-height:2.8rem}
  .cover-project-type{display:none}
  .cover-project-preview{display:none}
}
```

- [ ] **Step 5: Update the version note and re-run the CSS source check**

Append to `VERSION.md`:

```markdown
- Split the interactive introduction into a standalone `/` entry page and moved the full portfolio to `/portfolio`.
- Recentered the entry typography and project directory, increased project weight, and reduced hover-preview scale.
```

Run:

```bash
rg -q 'max-width:780px' src/styles.css && rg -q 'width:min\(270px,24vw\)' src/styles.css && rg -q 'font-weight:800' src/styles.css
```

Expected: exit 0.

- [ ] **Step 6: Verify and commit the visual refinement**

Run:

```bash
git diff --check
PATH='/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:'"$PATH" /Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/vite/bin/vite.js build
curl -I --max-time 5 http://127.0.0.1:4176/
curl -I --max-time 5 http://127.0.0.1:4176/portfolio
git add src/components/InteractiveCover.jsx src/components/HoverProjectReveal.jsx src/styles.css VERSION.md
git commit -m "style: refine standalone portfolio entry"
```

Expected: diff check exits 0, Vite reports `built`, both local URLs return HTTP 200, and the commit succeeds.
