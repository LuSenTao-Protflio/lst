# Daily Reading Festival Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone `/daily-reading` portfolio detail page without changing the existing project list or replacing MetaKeys.

**Architecture:** Add one route-level React page with locally optimized campaign assets and one scoped CSS section in the existing stylesheet. Keep the route independent from `projects.js`, `ProjectDetail`, and the project pager so the user can review it before approving replacement.

**Tech Stack:** React 19, React Router, Framer Motion, native CSS Grid, Vite.

## Global Constraints

- Preserve the current homepage, project order, MetaKeys route, and project data.
- Use the supplied campaign artwork as the only visual source.
- Keep a sharp-cornered editorial system using yellow, off-white, black, pink, blue, and green from the artwork.
- Motion communicates reading order only and respects reduced-motion preferences.
- Desktop layouts collapse to a strict single column below 768px.

---

### Task 1: Standalone route contract

**Files:**
- Create: `test/dailyReadingPage.test.mjs`
- Modify: `src/App.jsx`
- Create: `src/pages/DailyReading.jsx`

**Interfaces:**
- Consumes: React Router `Route` and `Link`.
- Produces: `/daily-reading` route rendering `DailyReading`.

- [ ] Write a source contract test that requires the route, project title, responsibility copy, and four exchange labels.
- [ ] Run `pnpm test` and confirm the new test fails because the page is missing.
- [ ] Add the route and minimal page markup.
- [ ] Run `pnpm test` and confirm all tests pass.

### Task 2: Campaign assets and editorial layout

**Files:**
- Create: `src/assets/daily-reading/*.jpg`
- Modify: `src/pages/DailyReading.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: twelve optimized supplied images.
- Produces: responsive hero, project statement, visual-system spread, interaction poster grid, 42-day feature, themed-content triptych, schedule spread, and closing mark.

- [ ] Optimize selected source artwork for web delivery without changing the originals.
- [ ] Compose the full editorial page with semantic sections and descriptive alt text.
- [ ] Add scoped desktop and mobile CSS with no generic cards, rounded panels, or decorative labels over images.
- [ ] Add reduced-motion handling and lazy loading below the hero.
- [ ] Run tests and production build.
- [ ] Inspect the page at desktop and mobile widths, then correct any overflow or broken hierarchy.
