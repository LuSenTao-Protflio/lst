# GitHub Current Version Mobile and Tablet Responsive Design

## Baseline

- Source of truth: GitHub `origin/main`
- Baseline commit: `6730bd1 style: restore bright glass navigation`
- Implementation branch: `feature/github-mobile-responsive`
- The old `HANDOFF.md`, old responsive worktree, and old responsive commits are not inputs to this work.

## Goal

Adapt the current GitHub portfolio for phone and iPad without replacing its current dark visual system, routes, project order, copy, WebP assets, glass navigation, motion language, or desktop interactions.

The portfolio must remain easy for an interviewer to scan:

- no horizontal overflow;
- no clipped display typography;
- no oversized empty gaps;
- project names and actions remain readable without hover;
- all project detail pages remain reachable and begin at the top;
- touch targets are at least 44px where practical.

## Preserved Visual Language

- Acid yellow `#E6FF1A`, warm white, and deep gray remain the core palette.
- The current Prelude, entry page, ambient light rays, Climate Crisis typography, custom cursor, click rings, highlighter tags, glass navigation, project taskbar, and floating navigation remain.
- The `Projects` directory keeps its desktop dark-row hover and title-scale behavior.
- The yellow project folder keeps its three-image reveal.
- No project copy, project order, image selection, or route is changed as part of responsive work.

## Responsive Ranges

The implementation uses the current CSS architecture and adds focused overrides:

- Phone: up to `599px`
- Portrait tablet: `600px–899px`
- Landscape tablet and compact desktop: `900px–1100px`
- Desktop: above `1100px`

Existing `800px`, `900px`, and `500px` rules may be consolidated only where necessary to remove conflicts. Desktop output above `1100px` must remain visually unchanged.

## Entry, Prelude, and Global Navigation

### Prelude and Entry

- Preserve the current full-screen composition and transition into the portfolio.
- On phone, use dynamic viewport units and content-aware spacing so Safari browser chrome does not create clipped or excessively tall sections.
- Project names remain legible and are not covered by hover previews on coarse pointers.
- Fine-pointer desktop keeps the existing hover image reveal.

### Main Glass Navigation

- Keep `Lusen Tao`, `WORK`, `INFO`, and language control on one line.
- Phone navigation uses the available width minus 24px and a minimum 48px bar height.
- Links and the language button receive a minimum 44px touch area without visually inflating the bar.
- Glass color, blur, border refraction, and current bright-yellow treatment remain unchanged.

## Main Hero and Information

### Hero

- Keep the current light-ray background and three-line display title.
- Phone title uses a responsive clamp that fits 390px without clipping.
- Replace rigid viewport height behavior with a dynamic/content-aware minimum where needed.
- Hero metadata becomes a single readable column on phone and may remain multi-column on tablet when space permits.

### About / Information

- Phone: one column, photo centered at up to 320px wide, information labels above values.
- Portrait tablet: photo and information return to two columns, using a 220–240px photo column and flexible text column.
- Landscape tablet and desktop retain the current 300px photo/sticky information composition.
- The photo contact glass card remains intact and must not overflow the portrait.

## Projects Directory

- Desktop fine pointer:
  - hovering a directory row deepens the gray background across the complete row;
  - the project title scales up using the current visual language.
- Touch/coarse pointer:
  - project information is visible without hover;
  - pressing a row gives a dark-gray active response;
  - the whole row remains an anchor to the project section.
- Secondary tags may be hidden below 900px when they compete with project names.
- Hash destinations use scroll margins so the fixed glass bar does not cover headings.

## Project Sections and Scroll-Activated Folder Reveal

### Desktop

- Preserve the current fine-pointer behavior: entering the project link opens that project's yellow folder; leaving closes it.
- Keyboard focus opens the folder and blur closes it.

### Phone and Touch iPad

- The folder does not require a first tap.
- When a project section enters the central viewport activation band, its yellow folder opens automatically.
- The activation band is approximately the central third of the viewport. Only one project is active at a time.
- The three preview images transition from reduced scale and partial transparency to their final transforms at full opacity.
- When the project leaves the activation band, the folder and preview images retract.
- Scrolling to the next project activates the next folder.
- Tapping anywhere in the project block still enters the detail page immediately.

### Implementation Behavior

- Reuse the existing `activeFolder` state and `ProjectFolderReveal` component.
- Fine pointer continues to use `pointerenter`/`pointerleave`.
- Coarse pointer uses `IntersectionObserver`; it must not install a continuous unthrottled scroll listener.
- Observer targets receive stable project IDs from existing project data.
- The observer is disabled for fine-pointer desktop to prevent competing state sources.
- Clean up the observer and media-query listeners on unmount or input-mode changes.

### Project Image Layout

- Phone: three visible images use a `1 + 2` grid—first image full width, second and third side by side.
- Portrait tablet: three images use one row when width allows.
- White-backed images retain the current subtle texture/shadow treatment.
- `misc` follows its current data-driven image behavior; responsive work does not invent images.
- The complete project section remains a single semantic link and click target.

## Project Detail Pages

- Preserve all current detail page types: generic, WOOF, MetaKeys, editorial/event, Whelk, and Daily Reading.
- Fixed project taskbar remains glass yellow:
  - phone uses shortened labels and ellipsis for long project names;
  - left return, centered project name, and right project order remain readable;
  - controls meet touch-size expectations.
- Below 800px:
  - sticky split layouts become natural single columns;
  - explanatory text appears before long image sequences;
  - images preserve their original aspect ratio and use `height: auto`;
  - vertical gaps are reduced without making the pages dense.
- At tablet/desktop widths, WOOF and editorial split-screen sticky descriptions remain.
- Previous/next project navigation becomes single-column on phone and may be two-column on tablet.
- Shared About and job-contact footer content remains available from detail pages.

## Accessibility and Input Behavior

- Touch users never need hover to understand or open a project.
- Keyboard focus continues to trigger meaningful folder and navigation states.
- Use visible focus rings already present in the design system.
- Motion remains enabled according to the current GitHub configuration, but responsive changes use transforms and opacity to avoid layout jank.
- Decorative folder previews remain hidden from assistive technology if they are currently marked decorative.

## Performance and Failure Behavior

- Reuse the current WebP assets and lazy/eager loading strategy.
- Do not introduce another animation library.
- `IntersectionObserver` is progressive enhancement: if unavailable, projects remain readable and directly clickable, with the folder closed.
- No runtime error or missing preview image may block navigation to a project.

## Verification

Required viewports:

- `390 × 844` phone
- `768 × 1024` portrait iPad
- `1024 × 768` landscape iPad
- `1440 × 900` desktop regression

Required routes:

- `/`
- `/entry`
- `/portfolio`
- `/portfolio#directory`
- `/portfolio#work`
- every `/project/:id` route in current project data
- `/daily-reading`

For each target:

- `document.documentElement.scrollWidth <= window.innerWidth`
- navigation remains usable;
- title and images are not clipped;
- project sections remain directly clickable;
- desktop hover interaction still works;
- phone/iPad scroll activation opens one folder at a time and retracts the previous folder;
- route changes and project links begin at the correct top/anchor position;
- production build and existing automated tests pass.

## Non-Goals

- No visual redesign of the desktop portfolio.
- No project curation or copy rewrite.
- No new project, image, font, dependency, route, or CMS.
- No reuse or cherry-pick from the abandoned old responsive worktree.
- No production deployment until the complete GitHub-based responsive version passes verification.
