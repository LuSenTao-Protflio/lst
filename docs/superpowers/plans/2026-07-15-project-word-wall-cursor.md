# Entry Project Word Wall and Cursor Calibration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the entry directory into a centered heavy typographic word wall and make the custom arrow cursor align exactly with the physical pointer.

**Architecture:** Simplify `HoverProjectReveal` so every link owns one centered project-title node while preserving its hover/focus state and preview image. In `GlobalCursor`, bind the arrow directly to raw pointer motion values and reserve spring interpolation for the trailing name label.

**Tech Stack:** React 18, Framer Motion, Vite 4, vanilla CSS.

## Global Constraints

- Keep all seven projects, their order, translated titles, images, and routes unchanged.
- Remove entry-directory numbers, categories, dividers, and duplicate title-flip markup.
- Use centered responsive 28–42 px project titles at weight `800`.
- Preserve keyboard focus, touch links, reduced-motion behavior, press feedback, and global cursor visibility behavior.
- Add no dependency or new visual asset.

---

### Task 1: Simplify the entry directory into a project word wall

**Files:**
- Modify: `src/components/HoverProjectReveal.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `projects`, `t(key)`, hover index state, and the existing floating preview motion values.
- Produces: one `.cover-project-title` node per project link with active and dimmed link states.

- [ ] **Step 1: Run a failing markup check**

```bash
! rg -q 'cover-project-index|cover-project-type|cover-project-title-window' src/components/HoverProjectReveal.jsx
```

Expected: non-zero exit because the old index, type, and title-window markup still exists.

- [ ] **Step 2: Replace each project row with one centered title**

Use this link body inside the existing project map:

```jsx
<Link
  to={`/project/${project.id}`}
  className={`cover-project-row${active ? " is-active" : ""}${dimmed ? " is-dimmed" : ""}`}
  onPointerEnter={() => finePointer && setHovered(index)}
  onFocus={() => setHovered(index)}
  onBlur={() => setHovered(null)}
>
  <span className="cover-project-title">{translated.title}</span>
</Link>
```

- [ ] **Step 3: Replace the row-table styling with a word-wall composition**

Apply these rules in `src/styles.css`:

```css
.cover-project-list{display:flex;flex-direction:column;align-items:center;border:0}
.cover-project-row-wrap{width:100%;border:0;text-align:center}
.cover-project-row{display:flex;align-items:center;justify-content:center;min-height:0;padding:.03em 0;color:rgba(58,58,58,.34);transition:opacity .22s ease,color .22s ease,transform .22s ease}
.cover-project-row.is-active,.cover-project-row:hover,.cover-project-row:focus-visible{color:var(--deep);transform:scale(1.025)}
.cover-project-row.is-dimmed{opacity:.2}
.cover-project-title{display:block;font-size:clamp(1.75rem,3.15vw,2.65rem);font-weight:800;line-height:1.03;letter-spacing:-.045em;text-wrap:balance}
```

Keep the preview at `width:min(270px,24vw)` and move its pointer anchor to the right side of the active title by setting `rawX` from `event.clientX - rect.left + 40`.

- [ ] **Step 4: Verify the markup and build**

```bash
! rg -q 'cover-project-index|cover-project-type|cover-project-title-window' src/components/HoverProjectReveal.jsx
rg -q 'cover-project-title.*font-size:clamp\(1.75rem,3.15vw,2.65rem\).*font-weight:800' src/styles.css
PATH='/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:'"$PATH" /Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/vite/bin/vite.js build
```

Expected: source checks exit 0 and Vite reports `built`.

---

### Task 2: Calibrate the global custom cursor

**Files:**
- Modify: `src/components/GlobalCursor.jsx`
- Modify: `VERSION.md`

**Interfaces:**
- Consumes: raw `x` and `y` motion values updated by the `pointermove` event.
- Produces: an arrow rendered at the exact pointer coordinates and a spring-following label offset from it.

- [ ] **Step 1: Run a failing cursor check**

```bash
! rg -q 'arrowXSpring|arrowYSpring' src/components/GlobalCursor.jsx && rg -q 'style=\{\{ x, y, scale' src/components/GlobalCursor.jsx
```

Expected: non-zero exit because arrow spring values remain in the component.

- [ ] **Step 2: Bind the arrow to raw coordinates**

Remove `arrowXSpring`, `arrowYSpring`, `arrowX`, and `arrowY`. Keep the label springs and render the arrow with:

```jsx
<motion.div className="global-cursor-arrow" style={{ x, y, scale, opacity: visible ? 1 : 0 }}>
```

- [ ] **Step 3: Move the visible arrow tip to the SVG hotspot**

Replace the arrow path with geometry whose first tip point is `(0,0)`:

```jsx
<svg width="31" height="31" viewBox="0 0 28 28" fill="none" aria-hidden="true">
  <path d="M0 0 L22 13 L12.5 15 L9 25 Z" fill="#E6FF1A" stroke="rgba(58,58,58,.32)" strokeWidth="0.7" strokeLinejoin="round" />
</svg>
```

- [ ] **Step 4: Update the version note and verify**

Append:

```markdown
- Rebuilt the entry directory as a centered heavy project-name word wall and calibrated the global cursor hotspot for direct arrow tracking.
```

Run:

```bash
git diff --check
! rg -q 'arrowXSpring|arrowYSpring' src/components/GlobalCursor.jsx
rg -q 'style=\{\{ x, y, scale' src/components/GlobalCursor.jsx
rg -q 'M0 0 L22 13' src/components/GlobalCursor.jsx
PATH='/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:'"$PATH" /Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/vite/bin/vite.js build
curl -sS -o /dev/null -w '%{http_code}\n' --max-time 5 http://127.0.0.1:4176/
```

Expected: all source checks exit 0, Vite reports `built`, and the local preview returns `200`.
