# Floating Glass Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the project-only circle with one route-aware glass pill that opens all projects on detail pages and returns to the top after the first project on Home.

**Architecture:** Mount `FloatingGlassNav` once beside Routes. It derives route mode from `useLocation`, language from i18n, and Home visibility from the `#whelk` threshold.

### Task 1: Create and mount the shared component

- Create `src/components/FloatingGlassNav.jsx`.
- On project routes render a Link to `/#directory` with grid icon and translated label.
- On Home listen to scroll/resize, show after `#whelk.offsetTop`, and call smooth `window.scrollTo` on click.
- Mount once in `App.jsx` and remove the old floating Link from `ProjectChrome.jsx`.

### Task 2: Replace circle styles with glass pill styles

- Remove `.all-projects-fab*` rules.
- Add fixed glass pill, icon, label, visible/hidden states, hover, focus, mobile, and safe-area rules.
- Record the change in `VERSION.md`.
- Run `git diff --check` and `npm run build`.
- Verify Home threshold behavior and all project routes.
