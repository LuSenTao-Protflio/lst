# Entry Navigation and Plasma Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive glass entry navigation, animated acid-yellow Plasma background, anchor-aware transition routing, and a continuous dark Hero-to-Info composition.

**Architecture:** Encapsulate the supplied OGL shader in a dedicated `Plasma` component. Keep route destination state in `Entry`, pass destination strings through `InteractiveCover`, and reuse the existing transition completion callback. Limit the Hero-to-Info change to CSS plus a stable footer anchor.

**Tech Stack:** React 19, React Router, Framer Motion, OGL, GSAP, CSS, Vite

## Global Constraints

- Preserve the existing entry transition and trigger lock.
- Use only cream, charcoal, and acid yellow.
- Do not run animated Plasma for reduced-motion users.
- Keep all existing entry project hover and bottom-entry interactions.
- Keep `/portfolio`, `/portfolio#work`, `/portfolio#info`, and `/portfolio#contact` valid.

---

### Task 1: Add the Plasma visual layer

**Files:**
- Create: `src/components/Plasma.jsx`
- Modify: `src/components/InteractiveCover.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Produces: `Plasma({ color, speed, direction, scale, opacity, mouseInteractive })`.
- Consumes: OGL `Renderer`, `Program`, `Mesh`, and `Triangle`.

- [ ] Create the supplied WebGL2 shader component with resize, visibility, pointer, context-loss, and unmount cleanup.
- [ ] Render Plasma only when reduced motion is not requested, using `#e6ff1a`, `0.45`, `1.15`, and `0.2`.
- [ ] Add full-screen background, cream veil, stacking, mobile interaction, and static reduced-motion glow styles.
- [ ] Verify component import, settings, cleanup calls, and CSS layers with `rg`; run `git diff --check`.

### Task 2: Add entry navigation and anchor-aware routing

**Files:**
- Modify: `src/components/InteractiveCover.jsx`
- Modify: `src/pages/Entry.jsx`
- Modify: `src/components/SiteFooter.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- `InteractiveCover` calls `onEnter(destination: string)`.
- `Entry.beginEntry(destination = "/portfolio")` stores the first accepted destination.
- `Entry.finishEntry()` navigates to the stored destination.

- [ ] Replace entry metadata with the wide glass navigation and destination-aware buttons.
- [ ] Store destinations in a ref before the transition and preserve `/portfolio` for wheel and bottom entry.
- [ ] Add `id="contact"` to `SiteFooter`.
- [ ] Add desktop and mobile navigation styles and move the project reveal block downward by approximately `5vh`.
- [ ] Verify all destination strings, the trigger lock, and the footer anchor with `rg`.

### Task 3: Extend the Hero treatment through Info

**Files:**
- Modify: `src/styles.css`

**Interfaces:**
- Consumes existing `.hero`, `.info`, `.info-row-label`, `.info-row-value`, and `.info-photo` markup.

- [ ] Change Info to a charcoal surface with its cream transition isolated at the bottom edge.
- [ ] Apply acid-yellow labels, warm off-white values, translucent white dividers, and a charcoal photo fade.
- [ ] Verify the exact selectors and color tokens with `rg` and `git diff --check`.

### Task 4: Document and verify

**Files:**
- Modify: `VERSION.md`

- [ ] Record the entry navigation, Plasma background, anchor routing, and continuous Info treatment.
- [ ] Run the Vite production build.
- [ ] Check `/`, `/portfolio`, `/portfolio#work`, `/portfolio#info`, and `/portfolio#contact` on port 4176.
- [ ] Confirm the build succeeds, every route returns HTTP 200, and `git diff --check` is clean.
