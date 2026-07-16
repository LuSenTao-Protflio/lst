# Motion, Glass Taskbar, and Directory Hover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the entry duration, project taskbar glass treatment, and directory-title hover scale.

**Architecture:** Keep the existing React and GSAP component structure. Adjust the GSAP timeline in `EntryTransition.jsx` and the relevant isolated selectors in `styles.css`; do not introduce dependencies or restructure pages.

**Tech Stack:** React, GSAP, CSS, Vite

## Global Constraints

- Preserve the existing acid-yellow, cream, and deep-gray palette.
- Preserve responsive and reduced-motion behavior.
- Do not alter project data, routes, or page content.

---

### Task 1: Extend Entry Transition

**Files:**
- Modify: `src/components/EntryTransition.jsx`

- [ ] Increase the panel entrance and character reveal durations, then add a 0.25-second timeline hold before `onComplete`.
- [ ] Run the production build and confirm the GSAP timeline compiles.

### Task 2: Refine Taskbar Glass

**Files:**
- Modify: `src/styles.css`

- [ ] Lower taskbar background opacity, strengthen blur/saturation, and tune highlights and shadows.
- [ ] Verify taskbar contrast on WOOF and one additional project page.

### Task 3: Add Directory Title Scale

**Files:**
- Modify: `src/styles.css`

- [ ] Add a transform transition to `.dir-row-title` with a left-center origin.
- [ ] Apply scale and small translation on row hover and `:focus-visible`.
- [ ] Run `git diff --check`, production build, and browser checks on `/portfolio#directory` and project routes.

