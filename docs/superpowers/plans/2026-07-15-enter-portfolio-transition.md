# Enter Portfolio GSAP Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Delay entry-page navigation long enough to show a full-screen GSAP character-float transition for `进入作品集`, triggered by either the button or downward-wheel gesture.

**Architecture:** `Entry` owns one guarded transition state and route navigation callback. `InteractiveCover` continues to emit a single `onEnter` event, while a new `EntryTransition` component owns the GSAP timeline and reports completion back to `Entry`.

**Tech Stack:** React 19, React Router 7, GSAP 3, Vite 4, vanilla CSS.

## Global Constraints

- Button and wheel use the same guarded entry handler.
- Animate `进入作品集` from opacity `0`, `yPercent:120`, `scaleY:2.3`, and `scaleX:.7`.
- Navigate only after the transition completion callback.
- Skip the timeline for reduced-motion users.
- Add GSAP but do not import or register ScrollTrigger.
- Preserve the existing standalone entry, custom cursor, project links, and `/portfolio` route.

---

### Task 1: Add GSAP and build the transition overlay

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/components/EntryTransition.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `{ active: boolean, onComplete: () => void }`.
- Produces: a fixed `.entry-transition` overlay and calls `onComplete` exactly once when its timeline finishes.

- [ ] **Step 1: Verify the dependency and component are initially absent**

```bash
! rg -q '"gsap"' package.json && test ! -f src/components/EntryTransition.jsx
```

Expected: exit 0.

- [ ] **Step 2: Install GSAP**

```bash
pnpm add gsap
```

Expected: `package.json` and `pnpm-lock.yaml` contain GSAP.

- [ ] **Step 3: Create the transition component**

Create `src/components/EntryTransition.jsx`:

```jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const title = "进入作品集";

export default function EntryTransition({ active, onComplete }) {
  const rootRef = useRef(null);
  useEffect(() => {
    if (!active || !rootRef.current) return undefined;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ onComplete });
      timeline
        .fromTo(".entry-transition", { opacity: 0 }, { opacity: 1, duration: .18, ease: "power2.out" })
        .fromTo(".entry-transition-char", { opacity: 0, yPercent: 120, scaleY: 2.3, scaleX: .7, transformOrigin: "50% 0%" }, { opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1, duration: .72, ease: "back.inOut(1.7)", stagger: .05 }, "-=.02")
        .fromTo(".entry-transition-en", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .28 }, "-=.2")
        .to({}, { duration: .12 });
    }, rootRef);
    return () => context.revert();
  }, [active, onComplete]);

  if (!active) return null;
  return (
    <div ref={rootRef} className="entry-transition" role="status" aria-label="进入作品集">
      <div className="entry-transition-title" aria-hidden="true">{[...title].map((character, index) => <span className="entry-transition-char" key={`${character}-${index}`}>{character}</span>)}</div>
      <p className="entry-transition-en">ENTER PORTFOLIO</p>
    </div>
  );
}
```

- [ ] **Step 4: Add overlay styles**

```css
.entry-transition{position:fixed;inset:0;z-index:9500;display:grid;place-content:center;text-align:center;background:var(--deep);color:var(--accent);pointer-events:auto}
.entry-transition-title{display:flex;justify-content:center;font-size:clamp(3.5rem,10vw,9rem);font-weight:850;line-height:.9;letter-spacing:-.06em;overflow:hidden}
.entry-transition-char{display:inline-block;will-change:transform,opacity}
.entry-transition-en{margin-top:1.25rem;font-size:.68rem;font-weight:800;letter-spacing:.18em}
```

- [ ] **Step 5: Verify dependency and component source**

```bash
rg -q '"gsap"' package.json
rg -q 'gsap.timeline' src/components/EntryTransition.jsx
! rg -q 'ScrollTrigger' src/components/EntryTransition.jsx
```

Expected: all checks exit 0.

---

### Task 2: Guard entry state and navigate after completion

**Files:**
- Modify: `src/pages/Entry.jsx`
- Modify: `VERSION.md`

**Interfaces:**
- Consumes: `InteractiveCover({ onEnter })`, `EntryTransition({ active, onComplete })`, React Router `navigate`, and Framer Motion `useReducedMotion`.
- Produces: one transition state and one guarded `beginEntry()` handler shared by click and wheel.

- [ ] **Step 1: Run the failing integration check**

```bash
rg -q 'EntryTransition' src/pages/Entry.jsx && rg -q 'transitioning' src/pages/Entry.jsx
```

Expected: non-zero exit.

- [ ] **Step 2: Add guarded state and completion navigation**

Update `Entry.jsx` to import `useCallback`, `useState`, `useReducedMotion`, and `EntryTransition`. Implement:

```jsx
const [transitioning, setTransitioning] = useState(false);
const reduceMotion = useReducedMotion();
const finishEntry = useCallback(() => navigate("/portfolio"), [navigate]);
const beginEntry = useCallback(() => {
  if (transitioning) return;
  if (reduceMotion) {
    finishEntry();
    return;
  }
  setTransitioning(true);
}, [finishEntry, reduceMotion, transitioning]);
```

Render `<InteractiveCover onEnter={beginEntry} />` and `<EntryTransition active={transitioning} onComplete={finishEntry} />`.

- [ ] **Step 3: Update version history**

Append:

```markdown
- Added a guarded GSAP character-float transition between the entry page and portfolio, shared by button and wheel entry with reduced-motion bypass.
```

- [ ] **Step 4: Run final verification**

```bash
git diff --check
rg -q 'InteractiveCover onEnter=\{beginEntry\}' src/pages/Entry.jsx
rg -q 'EntryTransition active=\{transitioning\} onComplete=\{finishEntry\}' src/pages/Entry.jsx
! rg -q 'ScrollTrigger' src/components/EntryTransition.jsx
PATH='/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:'"$PATH" /Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/vite/bin/vite.js build
curl -sS -o /dev/null -w '%{http_code}\n' --max-time 5 http://127.0.0.1:4176/
```

Expected: source checks exit 0, Vite reports `built`, and the local entry route returns `200`.
