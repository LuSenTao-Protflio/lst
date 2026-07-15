# Scroll-Driven Project Folder Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reversible sticky folder reveal beneath all seven homepage projects, with a flap-opening phase, three-image release phase, and click-through to each detail page.

**Architecture:** A focused `ProjectFolderReveal` component observes its own section with Framer Motion `useScroll` and derives every desktop transform from one normalized progress value. `Home` supplies project data and translated content; CSS builds the folder geometry, sticky stage, image cards, and static mobile/reduced-motion presentation.

**Tech Stack:** React 19, React Router 7, Framer Motion 12, Vite 4, vanilla CSS.

## Global Constraints

- Render one folder beneath each of the seven existing homepage project sections.
- Reuse each project's first three `images`; add no dependency or new visual asset.
- Use acid yellow `#e6ff1a`, neutral deep gray `#3a3a3a`, and the current warm-white background.
- Desktop uses reversible scroll-linked transforms; mobile uses a shorter static/open presentation.
- Navigation requires click, tap, or keyboard activation and targets `/project/:id`.
- Preserve all existing homepage, entry-page, directory, and detail-page behavior.

---

### Task 1: Create the scroll-driven folder component

**Files:**
- Create: `src/components/ProjectFolderReveal.jsx`

**Interfaces:**
- Consumes: `{ project, title, lang }`, where `project.id`, `project.num`, and `project.images` come from `src/data/projects.js`.
- Produces: one `.project-folder-section` containing a sticky desktop link and a static mobile link to `/project/${project.id}`.

- [ ] **Step 1: Run the failing component-source check**

```bash
test -f src/components/ProjectFolderReveal.jsx && rg -q 'useScroll' src/components/ProjectFolderReveal.jsx
```

Expected: non-zero exit because the component does not exist.

- [ ] **Step 2: Implement the component and scroll transforms**

Create `src/components/ProjectFolderReveal.jsx` with:

```jsx
import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const fan = [
  { x: -190, y: -132, rotate: -8 },
  { x: 0, y: -168, rotate: 1.5 },
  { x: 190, y: -126, rotate: 8 },
];

export default function ProjectFolderReveal({ project, title, lang }) {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const images = project.images.slice(0, 3);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const flapRotate = useTransform(scrollYProgress, [0.18, 0.48], [0, -72]);
  const backY = useTransform(scrollYProgress, [0.18, 0.48], [0, -12]);
  const cueOpacity = useTransform(scrollYProgress, [0.76, 0.88], [0, 1]);

  const label = lang === "zh" ? `查看${title}完整项目` : `View the full ${title} project`;
  return (
    <section ref={sectionRef} className="project-folder-section" aria-label={label}>
      <div className="project-folder-sticky">
        <Link to={`/project/${project.id}`} className="project-folder-link" aria-label={label}>
          <div className="project-folder-scene">
            <motion.div className="project-folder-back" style={{ y: reduceMotion ? -12 : backY }} />
            <div className="project-folder-cards" aria-hidden="true">
              {images.map((src, index) => {
                const x = useTransform(scrollYProgress, [0.46, 0.78], [0, fan[index].x]);
                const y = useTransform(scrollYProgress, [0.46, 0.78], [72, fan[index].y]);
                const rotate = useTransform(scrollYProgress, [0.46, 0.78], [0, fan[index].rotate]);
                const opacity = useTransform(scrollYProgress, [0.44, 0.56], [0, 1]);
                return <motion.figure key={src} className={`project-folder-card card-${index + 1}`} style={reduceMotion ? { x: fan[index].x, y: fan[index].y, rotate: fan[index].rotate, opacity: 1 } : { x, y, rotate, opacity }}><img src={src} alt="" /></motion.figure>;
              })}
            </div>
            <motion.div className="project-folder-flap" style={{ rotateX: reduceMotion ? -72 : flapRotate }} />
            <div className="project-folder-front">
              <span>PROJECT {project.num} / 项目 {project.num}</span>
              <strong>{title}</strong>
            </div>
          </div>
          <motion.span className="project-folder-cue" style={{ opacity: reduceMotion ? 1 : cueOpacity }}>
            {lang === "zh" ? "点击查看完整项目 ↗" : "Click to view full project ↗"}
          </motion.span>
        </Link>
      </div>
    </section>
  );
}
```

If React's hook linting rejects transforms inside the image loop, extract a `FolderCard` child that owns the four `useTransform` calls and receives `{ src, progress, final, reduceMotion }`.

- [ ] **Step 3: Verify component structure**

```bash
rg -q 'useScroll' src/components/ProjectFolderReveal.jsx
rg -q 'useTransform' src/components/ProjectFolderReveal.jsx
rg -q 'project.images.slice\(0, 3\)' src/components/ProjectFolderReveal.jsx
rg -q 'to={`/project/\$\{project.id\}`}' src/components/ProjectFolderReveal.jsx
```

Expected: all checks exit 0.

---

### Task 2: Integrate one folder after every homepage project

**Files:**
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: `ProjectFolderReveal({ project, title, lang })` from Task 1 and the existing `projects.map` loop.
- Produces: seven rendered folder sections in the same order as the project list.

- [ ] **Step 1: Run the failing integration check**

```bash
rg -q 'ProjectFolderReveal' src/pages/Home.jsx
```

Expected: non-zero exit because the component is not imported or rendered.

- [ ] **Step 2: Import and render the folder**

Add:

```jsx
import ProjectFolderReveal from "../components/ProjectFolderReveal";
```

Inside each `.project` after the existing project grid, render:

```jsx
<ProjectFolderReveal project={p} title={projectT.title} lang={lang} />
```

- [ ] **Step 3: Verify seven-folder data flow and build**

```bash
rg -q 'ProjectFolderReveal project=\{p\} title=\{projectT.title\} lang=\{lang\}' src/pages/Home.jsx
PATH='/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:'"$PATH" /Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/vite/bin/vite.js build
```

Expected: source check exits 0 and Vite reports `built`.

---

### Task 3: Build the folder visual system and responsive states

**Files:**
- Modify: `src/styles.css`
- Modify: `VERSION.md`

**Interfaces:**
- Consumes: folder class names emitted by Tasks 1–2.
- Produces: desktop sticky geometry, 3D flap, image fan cards, link feedback, mobile static/open state, and reduced-motion final state.

- [ ] **Step 1: Run the failing visual-token check**

```bash
rg -q '\.project-folder-section\{.*height:200vh' src/styles.css && rg -q 'position:sticky' src/styles.css
```

Expected: non-zero exit because folder styles do not exist.

- [ ] **Step 2: Add desktop folder geometry**

Add focused CSS containing these required rules:

```css
.project-folder-section{position:relative;height:200vh;margin:2rem calc(var(--pad) * -1) 0}
.project-folder-sticky{position:sticky;top:0;height:100dvh;display:grid;place-items:center;overflow:hidden}
.project-folder-link{width:min(100%,980px);height:100%;display:grid;place-items:center;align-content:center;color:var(--deep);outline:none}
.project-folder-link:focus-visible{outline:2px solid var(--accent);outline-offset:-12px}
.project-folder-scene{position:relative;width:min(62vw,620px);height:420px;perspective:1200px;display:grid;place-items:end center}
.project-folder-back{position:absolute;z-index:1;bottom:58px;width:78%;height:245px;border-radius:24px 24px 14px 14px;background:#cfe800;box-shadow:0 26px 60px rgba(58,58,58,.18)}
.project-folder-back::before{content:"";position:absolute;left:0;top:-34px;width:42%;height:54px;border-radius:16px 22px 0 0;background:#cfe800}
.project-folder-flap{position:absolute;z-index:4;bottom:64px;width:78%;height:218px;border-radius:20px 20px 12px 12px;background:#e6ff1a;transform-origin:bottom center;box-shadow:0 -8px 24px rgba(58,58,58,.09)}
.project-folder-front{position:absolute;z-index:5;bottom:34px;width:82%;min-height:190px;padding:2rem 2.25rem;border-radius:18px 18px 24px 24px;background:#e6ff1a;box-shadow:0 30px 70px rgba(58,58,58,.2);display:flex;flex-direction:column;justify-content:flex-end}
.project-folder-front span{font-size:.62rem;font-weight:800;letter-spacing:.1em}
.project-folder-front strong{margin-top:.6rem;font-size:clamp(1.3rem,2.5vw,2.2rem);line-height:1.05;letter-spacing:-.035em}
.project-folder-cards{position:absolute;z-index:3;left:50%;bottom:175px;width:0;height:0}
.project-folder-card{position:absolute;left:-120px;top:-75px;width:240px;aspect-ratio:4/3;overflow:hidden;border-radius:10px;background:var(--bg);box-shadow:0 22px 50px rgba(58,58,58,.24)}
.project-folder-card img{width:100%;height:100%;object-fit:cover}
.project-folder-cue{display:block;margin-top:-2rem;font-size:.72rem;font-weight:800;letter-spacing:.06em}
```

- [ ] **Step 3: Add mobile and reduced-motion states**

At `max-width:800px`, set the section to `height:auto`, the sticky area to `position:relative;height:auto;min-height:620px`, reduce the folder scene, and use CSS transforms to show the three cards in their final fanned state. In `prefers-reduced-motion`, disable transitions and ensure the final open composition remains visible and clickable.

- [ ] **Step 4: Update version history**

Append:

```markdown
- Added reversible sticky folder reveals beneath all seven homepage projects, with scroll-open flaps, three-image fans, click-through navigation, and mobile/reduced-motion states.
```

- [ ] **Step 5: Run final verification**

```bash
git diff --check
rg -q '\.project-folder-section\{.*height:200vh' src/styles.css
rg -q '\.project-folder-sticky\{position:sticky' src/styles.css
rg -q 'ProjectFolderReveal project=\{p\}' src/pages/Home.jsx
PATH='/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:'"$PATH" /Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/vite/bin/vite.js build
curl -sS -o /dev/null -w '%{http_code}\n' --max-time 5 http://127.0.0.1:4176/portfolio
```

Expected: source checks exit 0, Vite reports `built`, and the local portfolio returns `200`.
