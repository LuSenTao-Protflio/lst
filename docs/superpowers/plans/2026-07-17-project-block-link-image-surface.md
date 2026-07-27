# Project Block Link and Image Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make each homepage project a single full-area link and visually support white-background imagery.

**Architecture:** Keep `motion.div.project` as the animation container and add one `Link.project-hit-area` around its visible content. Convert `ProjectFolderReveal` to a noninteractive visual component and remove per-image links. Style the image surface and outer focus state in the existing stylesheet.

**Tech Stack:** React, React Router, Framer Motion, CSS, Vite

## Global Constraints

- Exactly one project-detail link per homepage project section.
- No nested anchors.
- Preserve folder hover/focus animation and responsive layouts.

---

### Task 1: Build the Single Link Boundary

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/components/ProjectFolderReveal.jsx`

- [ ] Add `Link.project-hit-area` around the project summary and optional grid.
- [ ] Remove the per-grid-item links and the folder component's internal `Link`.
- [ ] Verify source structure contains one project link declaration for the work section.

### Task 2: Add Image Surface and Focus Styling

**Files:**
- Modify: `src/styles.css`

- [ ] Add a block-link reset and visible focus outline.
- [ ] Add warm-gray paper texture, padding, border, and soft shadow to `.grid-item`.
- [ ] Add a restrained project hover/focus shadow enhancement.

### Task 3: Verify Behavior

**Files:**
- No production files added.

- [ ] Run source checks for nested links and full-area link structure.
- [ ] Run `git diff --check` and the production build.
- [ ] Browser-test text, folder, and image clicks and confirm each reaches the same detail route.
- [ ] Check all seven project routes return HTTP 200.

