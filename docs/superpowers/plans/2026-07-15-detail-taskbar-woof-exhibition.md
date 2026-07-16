# Detail Taskbar and WOOF Exhibition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one consistent detail taskbar to all projects and rebuild WOOF with an ordered image stream beside a sticky explanation panel.

**Architecture:** Add a route-level `ProjectTaskbar` rendered by `ProjectDetail`, using the existing project list for ordering. Restrict `FloatingGlassNav` to the homepage. Replace WOOF's separate intro/story layouts with one two-column section.

**Tech Stack:** React, React Router, Framer Motion, CSS, Vite

## Global Constraints

- Keep existing bottom previous/next navigation and shared footer.
- Do not change non-WOOF detail layouts beyond the new taskbar offset.
- Preserve WOOF source image order and render every image once.
- Do not add dependencies.

---

### Task 1: Add the global project taskbar

**Files:**
- Create: `src/components/ProjectTaskbar.jsx`
- Modify: `src/components/ProjectDetail.jsx`
- Modify: `src/styles.css`

- [ ] Build the fixed yellow three-region taskbar from current project, localized title, and project index.
- [ ] Render it before every valid detail page.
- [ ] Add desktop and narrow-screen styles with safe truncation and correct z-index.
- [ ] Verify all detail routes derive the counter from `projects.length`.

### Task 2: Remove project floating all-projects control

**Files:**
- Modify: `src/components/FloatingGlassNav.jsx`

- [ ] Return `null` on project routes instead of rendering the all-projects link.
- [ ] Preserve homepage back-to-top logic and markup.
- [ ] Verify no `全部项目`, `All projects`, or `/portfolio#directory` project-route branch remains.

### Task 3: Rebuild WOOF as an exhibition layout

**Files:**
- Modify: `src/components/WoofProjectDetail.jsx`
- Modify: `src/styles.css`

- [ ] Render all `project.images` once in one ordered left-column stream.
- [ ] Move label, tags, title, description, metadata, and all detail sections into one right-column sticky panel.
- [ ] Constrain the sticky panel below the taskbar with viewport-safe internal scrolling.
- [ ] Remove obsolete WOOF pair/asymmetric/story layout CSS.
- [ ] Add one-column tablet/mobile fallback with static explanation above images.
- [ ] Verify ordered image count and absence of WOOF pair/asymmetric class names.

### Task 4: Document and verify

**Files:**
- Modify: `VERSION.md`

- [ ] Record the global taskbar, floating-button removal, and WOOF exhibition layout.
- [ ] Run `git diff --check` and Vite production build.
- [ ] Check all seven `/project/:id` routes and `/portfolio` on port 4176.
- [ ] Confirm project pages expose one taskbar and WOOF image count matches source data.
