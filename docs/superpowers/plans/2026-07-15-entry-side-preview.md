# Entry Fixed Side Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the pointer-following entry preview with a fixed rounded image card to the right of the project word wall that displays each project hero in full.

**Architecture:** Remove pointer-coordinate motion state from `HoverProjectReveal` and use only the active project index to switch stacked preview images. Reserve a desktop-only right-side preview zone with CSS while preserving the current centered word wall and hiding the preview at tablet/mobile breakpoints.

**Tech Stack:** React 18, Framer Motion, Vite 4, vanilla CSS.

## Global Constraints

- Keep all project names, order, translated content, images, links, and focus behavior unchanged.
- Preview cards appear only on hover or keyboard focus and never intercept pointer input.
- Use `object-fit: contain`, warm-white fill, a subtle border, 12–16 px corner radius, and a soft tinted shadow.
- Hide the preview at the existing tablet/mobile breakpoint and for reduced-motion users.
- Add no dependency or visual asset.

---

### Task 1: Replace the moving preview with a fixed side card

**Files:**
- Modify: `src/components/HoverProjectReveal.jsx`
- Modify: `src/styles.css`
- Modify: `VERSION.md`

**Interfaces:**
- Consumes: `hovered: number | null`, existing project hero images, link hover/focus callbacks.
- Produces: `.cover-project-preview` as a desktop-only fixed card in the right-side reserved zone.

- [ ] **Step 1: Run the failing source check**

```bash
! rg -q 'rawX|rawY|onPointerMove|style=\{\{ x, y \}\}' src/components/HoverProjectReveal.jsx && rg -q 'object-fit:contain' src/styles.css
```

Expected: non-zero exit because pointer-following code remains and preview images still use `object-fit: cover`.

- [ ] **Step 2: Remove pointer-coordinate tracking**

Remove `useRef`, `useMotionValue`, `useSpring`, `containerRef`, `rawX`, `rawY`, `x`, `y`, and `onPointerMove`. Render the root without a pointer-move handler:

```jsx
<div className="cover-project-reveal" onPointerLeave={() => setHovered(null)}>
```

Render the preview without positional motion styles:

```jsx
<motion.div
  className="cover-project-preview"
  animate={{ opacity: hovered == null ? 0 : 1, y: hovered == null ? 8 : 0, scale: hovered == null ? 0.985 : 1 }}
  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
  aria-hidden="true"
>
```

- [ ] **Step 3: Create the desktop right-side preview zone**

Apply these focused rules in `src/styles.css`:

```css
.cover-project-reveal{width:min(100%,1080px);display:grid;grid-template-columns:minmax(0,690px) 300px;gap:clamp(2rem,5vw,4rem);align-items:center}
.cover-project-list{grid-column:1}
.cover-project-preview{position:relative;grid-column:2;grid-row:1;width:100%;aspect-ratio:16/10;margin:0;overflow:hidden;background:var(--bg);border:1px solid rgba(58,58,58,.12);border-radius:14px;box-shadow:0 18px 45px rgba(58,58,58,.16),0 3px 12px rgba(58,58,58,.08);pointer-events:none}
.cover-project-preview img{object-fit:contain;background:var(--bg)}
```

Expand `.cover-main-grid` to `width:min(100%,1080px)` so the preview zone fits without covering the title block. At `max-width:900px`, restore a one-column project reveal and hide `.cover-project-preview`.

- [ ] **Step 4: Update the version note**

Append:

```markdown
- Replaced the free-following entry preview with a fixed rounded side card that displays horizontal project heroes in full.
```

- [ ] **Step 5: Verify the result**

```bash
git diff --check
! rg -q 'rawX|rawY|onPointerMove|style=\{\{ x, y \}\}' src/components/HoverProjectReveal.jsx
rg -q 'object-fit:contain' src/styles.css
rg -q 'border-radius:14px' src/styles.css
rg -q 'grid-template-columns:minmax\(0,690px\) 300px' src/styles.css
PATH='/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:'"$PATH" /Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/vite/bin/vite.js build
curl -sS -o /dev/null -w '%{http_code}\n' --max-time 5 http://127.0.0.1:4176/
```

Expected: source checks exit 0, Vite reports `built`, and the preview server returns `200`.
