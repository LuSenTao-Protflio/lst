# Global Cursor and Click Rings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an acid-yellow arrow cursor with a trailing 卢森涛 label and a lightweight click-ring response to every route.

**Architecture:** Mount two fixed, pointer-transparent global components beside `Routes`: `GlobalCursor` uses existing Framer Motion values and springs, while `ClickRings` uses short-lived React state and CSS keyframes. Fine-pointer and reduced-motion media queries control accessibility behavior.

**Tech Stack:** React 19, Framer Motion 12, Vite 4, vanilla CSS.

## Global Constraints

- Add no dependency.
- Use `#E6FF1A`, arrow size 31px, label text `卢森涛`, label text `#3A3A3A`.
- Preserve all native clicks through `pointer-events:none`.
- Do not replace the cursor on coarse-pointer devices.

### Task 1: Implement global cursor

**Files:**
- Create: `src/components/GlobalCursor.jsx`
- Modify: `src/styles.css`

- [ ] Use `useMotionValue`, `useSpring`, `useTransform`, and `animate` from Framer Motion.
- [ ] Listen to window pointer move, down, up, enter, and leave events.
- [ ] Render a 31px acid-yellow SVG arrow and a trailing acid-yellow pill containing `卢森涛`.
- [ ] Apply a snappier spring to the arrow and a slower spring to the label.
- [ ] Scale both to 0.92 while pressed; apply limited velocity-based label rotation.
- [ ] Return null on coarse-pointer devices and directly track without spring when reduced motion is enabled.

### Task 2: Implement global click rings

**Files:**
- Create: `src/components/ClickRings.jsx`
- Modify: `src/styles.css`

- [ ] Listen to primary `pointerdown` events and store `{id,x,y}` ring objects.
- [ ] Render each ring as a fixed 80px SVG centered on `clientX/clientY`.
- [ ] Animate from scale .5 to 2, stroke 3px to 0, and opacity 1 to 0 in 300ms.
- [ ] Remove each ring after 350ms and clean pending timers on unmount.
- [ ] Disable rings for coarse pointer and reduced motion.

### Task 3: Mount globally and remove the old cursor

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/styles.css`
- Modify: `VERSION.md`

- [ ] Mount `<GlobalCursor />` and `<ClickRings />` inside `BrowserRouter`, before `Routes`.
- [ ] Remove `cursorRef`, hover state, mousemove effect, and `<div className="cursor">` from Home.
- [ ] Remove obsolete `.cursor` CSS.
- [ ] Hide the native cursor only under `@media(pointer:fine)`.
- [ ] Record the global cursor and ring interaction in `VERSION.md`.
- [ ] Run `git diff --check` and `npm run build`; expect exit code 0.
- [ ] Verify on `/`, `/project/woof`, and `/project/gala` that the global components mount once, links remain clickable, ring nodes clean up, and the old cursor is absent.
