# All Project Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the five remaining generic detail pages with one shared editorial archive component while keeping WOOF-WOOF and MetaKeys specialized.

**Architecture:** Store project-specific archive copy and next-project metadata in the existing i18n project entries. Render WHELK, Memory, Gala, Storyteller, and Misc through a shared `EditorialProjectDetail` component that uses one semantic intro and selects a natural-ratio image sequence by image count.

**Tech Stack:** React 19, React Router 7, Framer Motion 12, Vite 4, vanilla CSS.

## Global Constraints

- WOOF-WOOF and MetaKeys remain unchanged.
- All images render at natural ratio with `height:auto` and no cropping.
- Add no dependencies and fabricate no outcomes or metrics.
- At 800px and below, sticky metadata and all image grids become one column.

---

### Task 1: Add archive content for the five projects

**Files:**
- Modify: `src/i18n.jsx`

**Interfaces:**
- Produces: `projects.<id>.detail` for `whelk`, `memory`, `gala`, `storyteller`, and `misc` with `meta`, `sections`, `back`, `nextLabel`, `nextId`, and `nextTitle`.

- [ ] Add the exact Chinese content defined in `docs/superpowers/specs/2026-07-15-all-project-detail-pages-design.md`, using three section objects per project.
- [ ] Add matching English content with the same keys and no invented claims.
- [ ] Set next ids to `woof`, `metakeys`, `storyteller`, `misc`, and `whelk` respectively.
- [ ] Run `npm run build`; expect exit code 0.

### Task 2: Create the shared editorial component

**Files:**
- Create: `src/components/EditorialProjectDetail.jsx`
- Modify: `src/components/ProjectDetail.jsx`

**Interfaces:**
- Consumes: `project`, translated `projectT`, shared `ProjectLabel`, `project.images`, and `projectT.detail`.
- Produces: `EditorialProjectDetail({ project, projectT })`.

- [ ] Create a reduced-motion-aware reveal helper matching the existing specialized components.
- [ ] Render a 68/32 intro with hero on the left and project label, tags, title, description, and metadata on the right.
- [ ] Build `contentImages` by removing the first occurrence of `project.hero` from `project.images`, preventing an immediate repeated hero.
- [ ] Render image groups in this order: first content image full width; next two as a pair; next two as an asymmetric group; remaining images as a pair or single full-width ending.
- [ ] Place the three translated copy blocks before the full-width, pair, and asymmetric image groups.
- [ ] Render back link `/` and next link `/project/${detail.nextId}`.
- [ ] In `ProjectDetail.jsx`, keep not-found logic, preserve the WOOF and MetaKeys branches, and return `EditorialProjectDetail` for every other project.
- [ ] Remove the obsolete narrative field array and generic narrative/grid JSX.
- [ ] Run `npm run build`; expect exit code 0.

### Task 3: Style and verify all pages

**Files:**
- Modify: `src/styles.css`
- Modify: `VERSION.md`

**Interfaces:**
- Consumes all `.editorial-detail-*` and `.editorial-story-*` classes.
- Produces natural-ratio desktop editorial layout and one-column mobile layout.

- [ ] Add intro, sticky aside, metadata, story copy, full-width, pair, asymmetric, remainder, and footer styles using the same spacing system as WOOF and MetaKeys.
- [ ] Add 800px rules that put metadata first, disable sticky, and convert all image groups to one column.
- [ ] Include `.editorial-detail *` in the existing reduced-motion rule.
- [ ] Append `Unified the remaining five projects under a shared editorial archive layout` to `VERSION.md`.
- [ ] Run `git diff --check` and `npm run build`; expect both to exit 0.
- [ ] Browser-check all five routes for bilingual labels, zero old narrative cards/grids, loaded images, correct next links, and no horizontal overflow.
- [ ] Browser-check WOOF and MetaKeys to confirm their specialized layouts remain active.
