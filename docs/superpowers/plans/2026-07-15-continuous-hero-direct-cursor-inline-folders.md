# Continuous Hero, Direct Cursor, and Inline Folders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create one continuous Hero–Info background, eliminate custom-cursor lag, and replace scroll-driven folder chapters with compact hover folders beside project summaries.

**Architecture:** Lift `LightRays` into a shared Hero–Info wrapper. Refactor `GlobalCursor` to update DOM transforms directly from native pointer events. Replace `ProjectFolderReveal` with a controlled inline preview component whose open state is driven by summary hover/focus or mobile tap.

**Tech Stack:** React, Framer Motion, React Router, CSS, Vite

## Global Constraints

- Preserve all project image grids and detail routes.
- Remove scroll-driven folder behavior completely.
- Keep all three open folder cards at opacity `1`.
- Keep fine-pointer and reduced-motion accessibility behavior.
- Do not add dependencies.

---

### Task 1: Build one Hero–Info visual scene

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/styles.css`

- [ ] Wrap Hero and Info in `.hero-info-flow`.
- [ ] Move the existing `LightRays` instance to the wrapper and remove it from the Hero.
- [ ] Make Hero and Info backgrounds transparent, remove the Info top border, and place their content above the shared ray layer.
- [ ] Add one long bottom fade on the wrapper into `var(--bg)`.
- [ ] Verify one `LightRays` instance and no Info border with `rg` and `git diff --check`.

### Task 2: Use direct cursor coordinates

**Files:**
- Modify: `src/components/GlobalCursor.jsx`

- [ ] Replace cursor x/y MotionValues and label springs with arrow and label refs.
- [ ] In native `pointermove`, write direct `translate3d` transforms for the arrow and fixed-offset label.
- [ ] Preserve fine-pointer detection, visibility, and click scale without position springs or velocity rotation.
- [ ] Verify no position `useSpring`, velocity, or label rotation remains.

### Task 3: Replace scroll folders with inline hover folders

**Files:**
- Modify: `src/components/ProjectFolderReveal.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/styles.css`

- [ ] Rewrite `ProjectFolderReveal` as a compact controlled component accepting `project`, `title`, and `open`.
- [ ] Add one project-summary row per project, with text on the left and folder at the right.
- [ ] Open on summary pointer enter/focus; close on leave/blur; on non-hover devices, tap toggles one active project.
- [ ] Animate flap and three cards with CSS classes; every open card ends at opacity `1`.
- [ ] Remove the old standalone folder placement and all sticky, `200vh`, cue, scroll transform, and scroll-responsive CSS.
- [ ] Verify seven component render sites derive from the project map and no scroll folder tokens remain.

### Task 4: Document and verify

**Files:**
- Modify: `VERSION.md`

- [ ] Record the shared Hero–Info scene, direct cursor tracking, and inline folder redesign.
- [ ] Run `git diff --check` and the Vite production build.
- [ ] Check `/`, `/portfolio`, and representative `/project/woof` and `/project/metakeys` routes on port 4176.
- [ ] Confirm all routes return HTTP 200.
