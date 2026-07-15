# Project Navigation and Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make project transitions start at the top, add circular previous/next navigation, provide a floating project-directory button, and reuse the career footer on every project page.

**Architecture:** `ScrollManager` handles pathname/hash scrolling at router scope. `ProjectChrome` derives circular siblings from the existing projects array and renders `ProjectPager`, `AllProjectsButton`, and shared `SiteFooter` once outside any project-specific layout.

**Tech Stack:** React 19, React Router 7, Vite 4, vanilla CSS.

### Task 1: Extract shared footer and route scrolling

- Create `src/components/SiteFooter.jsx` using existing footer i18n keys.
- Replace the inline Home footer with `<SiteFooter />`.
- Create `src/components/ScrollManager.jsx` using `useLocation` and `useLayoutEffect`; scroll to hash target when present, otherwise scroll to top.
- Mount `<ScrollManager />` inside `BrowserRouter` before `Routes`.

### Task 2: Create reusable project chrome

- Create `src/components/ProjectChrome.jsx`.
- Find current project index in `projects`, derive previous and next with modular arithmetic, and translate titles using `t('projects.<id>').title`.
- Render previous on the left, next on the right, a fixed `/\#directory` four-grid button, and `<SiteFooter />` after the pager.
- Add accessible Chinese/English labels from the active language.

### Task 3: Integrate all detail layouts

- In `ProjectDetail.jsx`, select the correct WOOF, MetaKeys, or Editorial component, then render one `<ProjectChrome currentId={project.id} />` after it.
- Remove old footer markup and unused `Link` imports from all three detail components.
- Add shared pager, floating button, focus, desktop, mobile, and safe-area CSS.
- Append the navigation/footer change to `VERSION.md`.
- Run `git diff --check` and `npm run build`.
- Verify route changes scroll to top, hash returns to directory, all project pages contain the shared footer, and previous/next links wrap correctly.
