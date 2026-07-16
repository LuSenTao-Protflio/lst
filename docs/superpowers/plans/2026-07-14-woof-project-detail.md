# WOOF-WOOF Project Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a WOOF-WOOF-specific editorial project page with a large visual column, sticky project archive information, responsive image storytelling, and a next-project link.

**Architecture:** Keep the existing generic `ProjectDetail` component unchanged for six projects and branch only the `woof` route into a focused `WoofProjectDetail` component. Store WOOF-specific bilingual copy in the existing i18n dictionaries, consume the existing project object and six image URLs as props, and isolate all new styling behind `.woof-detail` classes.

**Tech Stack:** React 19, React Router 7, Framer Motion 12, Vite 4, vanilla CSS.

## Global Constraints

- Only `/project/woof` receives the new layout; every other project detail page keeps the existing structure.
- Use only the existing React, React Router, Framer Motion and CSS stack; add no third-party dependency.
- Use existing WOOF-WOOF assets without modifying or fabricating images.
- Do not invent research, launch, performance or commercial outcome data.
- Set the neutral deep gray to exactly `#3a3a3a`; retain `#fffdf5` and `#e6ff1a`.
- Desktop uses an approximately 68/32 visual/info split; mobile becomes one column with no sticky panel.
- Respect `prefers-reduced-motion`.

---

## File Structure

- Create `src/components/WoofProjectDetail.jsx`: WOOF-only page composition and semantic image sequence.
- Modify `src/components/ProjectDetail.jsx`: route the `woof` project to the dedicated component and retain the generic fallback.
- Modify `src/i18n.jsx`: bilingual WOOF archive labels, section titles, explanatory copy, and navigation labels.
- Modify `src/styles.css`: `#3a3a3a` palette update and isolated desktop/mobile WOOF layout rules.
- Modify `VERSION.md`: record the detail-page prototype and palette adjustment.

### Task 1: Add WOOF bilingual archive content

**Files:**
- Modify: `src/i18n.jsx`

**Interfaces:**
- Produces: `projects.woof.detail`, an object with `meta`, `sections`, `back`, `nextLabel`, and `nextTitle` values returned by `t("projects.woof.detail")`.
- Consumes: Existing `useLanguage().t(path)` nested-object lookup.

- [ ] **Step 1: Verify the new translation object is absent**

Run:

```bash
rg -n "nextTitle.*记忆的回流|Project type|项目类型" src/i18n.jsx
```

Expected: no matches.

- [ ] **Step 2: Add the Chinese detail object under the Chinese `projects.woof` entry**

Add this exact object after `desc`:

```jsx
detail: {
  meta: [
    { label: "项目类型", value: "UI/UX · 产品视觉" },
    { label: "个人职责", value: "用户场景梳理 · 信息架构 · UI设计 · 视觉呈现" },
    { label: "项目时间", value: "2024" },
  ],
  sections: [
    { label: "项目背景", title: "让遛狗成为人与城市重新连接的入口", body: "WOOF-WOOF 从日常遛狗场景出发，将路线记录、宠物友好地点与轻量社交整合在同一套移动体验中。设计重点不是增加功能数量，而是让地图信息、宠物状态与行动入口保持清晰。" },
    { label: "核心体验", title: "以地图组织路线、地点与即时行动", body: "主界面以地图为核心，通过路线、地点标记和宠物状态形成连续使用路径。高饱和绿色负责行动提示，暖橙用于品牌识别和重点反馈。" },
    { label: "视觉系统", title: "在工具感与宠物陪伴感之间保持平衡", body: "圆角容器、地图图钉和宠物角色共同降低导航产品的距离感；界面层级保持克制，使用户在户外移动场景中仍能快速读取。" },
  ],
  back: "返回全部项目",
  nextLabel: "下一个项目",
  nextTitle: "阿尔兹海默症·记忆的回流",
},
```

- [ ] **Step 3: Add the matching English detail object under the English `projects.woof` entry**

```jsx
detail: {
  meta: [
    { label: "Project type", value: "UI/UX · Product Visual" },
    { label: "Role", value: "Scenario Mapping · Information Architecture · UI Design · Visual Presentation" },
    { label: "Year", value: "2024" },
  ],
  sections: [
    { label: "Context", title: "Turning a daily walk into a way to reconnect with the city", body: "WOOF-WOOF begins with the everyday dog-walking journey and brings route tracking, pet-friendly places, and lightweight social interaction into one mobile experience. The design prioritises clarity across map information, pet status, and immediate actions." },
    { label: "Core experience", title: "A map-led system for routes, places, and action", body: "The map anchors the experience, connecting walking routes, place markers, and pet status into a continuous flow. Vivid green signals action while warm orange carries brand recognition and priority feedback." },
    { label: "Visual system", title: "Balancing utility with a sense of companionship", body: "Rounded containers, map pins, and pet characters soften the functional navigation layer. A restrained hierarchy keeps the interface readable while the user is moving outdoors." },
  ],
  back: "Back to all projects",
  nextLabel: "Next project",
  nextTitle: "Backflow of Memory",
},
```

- [ ] **Step 4: Build to validate i18n syntax**

Run: `npm run build`

Expected: Vite reports `✓ built` with exit code 0.

- [ ] **Step 5: Commit**

```bash
git add src/i18n.jsx
git commit -m "content: add woof project archive copy"
```

### Task 2: Create the WOOF editorial detail component

**Files:**
- Create: `src/components/WoofProjectDetail.jsx`
- Modify: `src/components/ProjectDetail.jsx`

**Interfaces:**
- Consumes: `project: Project`, `projectT: {title,en,desc,detail}`, existing `project.images: string[]`, and `project.hero: string`.
- Produces: `WoofProjectDetail({ project, projectT }) => JSX.Element`.
- Produces routing behavior: `id === "woof"` renders the dedicated component; every other valid id follows the existing generic markup.

- [ ] **Step 1: Verify the dedicated component does not exist**

Run:

```bash
test ! -f src/components/WoofProjectDetail.jsx
```

Expected: exit code 0.

- [ ] **Step 2: Create `WoofProjectDetail.jsx` with the full page composition**

Create a component with these imports and structure:

```jsx
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const reveal = (reduceMotion, delay = 0) => ({
  initial: reduceMotion ? false : { opacity: 0, y: 24 },
  whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.55, delay },
});

export default function WoofProjectDetail({ project, projectT }) {
  const reduceMotion = useReducedMotion();
  const detail = projectT.detail;
  const images = project.images;

  return (
    <main className="woof-detail">
      <section className="woof-detail-intro">
        <motion.figure className="woof-detail-lead" {...reveal(reduceMotion)}>
          <img src={project.hero} alt={`${projectT.title} — project overview`} />
        </motion.figure>
        <aside className="woof-detail-aside">
          <div className="woof-detail-aside-inner">
            <span className="woof-detail-num">{project.num}</span>
            <div className="detail-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <h1>{projectT.title}</h1>
            <p className="woof-detail-en">{projectT.en}</p>
            <p className="woof-detail-desc">{projectT.desc}</p>
            <dl className="woof-detail-meta">
              {detail.meta.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
            </dl>
          </div>
        </aside>
      </section>

      <section className="woof-story">
        <motion.div className="woof-story-copy" {...reveal(reduceMotion)}>
          <span>{detail.sections[0].label}</span><h2>{detail.sections[0].title}</h2><p>{detail.sections[0].body}</p>
        </motion.div>
        <motion.figure className="woof-story-wide" {...reveal(reduceMotion)}><img src={images[1]} alt="WOOF-WOOF experience overview" /></motion.figure>
        <motion.div className="woof-story-copy woof-story-copy-right" {...reveal(reduceMotion)}>
          <span>{detail.sections[1].label}</span><h2>{detail.sections[1].title}</h2><p>{detail.sections[1].body}</p>
        </motion.div>
        <div className="woof-story-pair">
          {[images[2], images[3]].map((src, index) => <motion.figure key={src} {...reveal(reduceMotion, index * 0.06)}><img src={src} alt={`WOOF-WOOF core interface ${index + 1}`} /></motion.figure>)}
        </div>
        <motion.div className="woof-story-copy" {...reveal(reduceMotion)}>
          <span>{detail.sections[2].label}</span><h2>{detail.sections[2].title}</h2><p>{detail.sections[2].body}</p>
        </motion.div>
        <div className="woof-story-asymmetric">
          {[images[4], images[5]].map((src, index) => <motion.figure key={src} {...reveal(reduceMotion, index * 0.06)}><img src={src} alt={`WOOF-WOOF visual system ${index + 1}`} /></motion.figure>)}
        </div>
      </section>

      <footer className="woof-detail-footer">
        <Link to="/">← {detail.back}</Link>
        <Link to="/project/memory"><span>{detail.nextLabel}</span><strong>{detail.nextTitle} →</strong></Link>
      </footer>
    </main>
  );
}
```

- [ ] **Step 3: Route only WOOF to the new component**

In `ProjectDetail.jsx`, import the component:

```jsx
import WoofProjectDetail from "./WoofProjectDetail";
```

After `const projectT = t(...)`, add:

```jsx
if (project.id === "woof") {
  return <WoofProjectDetail project={project} projectT={projectT} />;
}
```

- [ ] **Step 4: Build to validate component and routing syntax**

Run: `npm run build`

Expected: Vite reports `✓ built` and no missing import or JSX errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/WoofProjectDetail.jsx src/components/ProjectDetail.jsx
git commit -m "feat: add editorial woof detail layout"
```

### Task 3: Add isolated editorial styling and lighten the global gray

**Files:**
- Modify: `src/styles.css`
- Modify: `VERSION.md`

**Interfaces:**
- Consumes: `.woof-detail`, `.woof-detail-intro`, `.woof-detail-lead`, `.woof-detail-aside`, `.woof-detail-aside-inner`, `.woof-detail-meta`, `.woof-story-*`, and `.woof-detail-footer` markup from Task 2.
- Produces: responsive 68/32 desktop layout, sticky aside, natural-ratio images, mobile one-column flow, and reduced-motion-safe presentation.

- [ ] **Step 1: Verify the old gray and missing WOOF styles**

Run:

```bash
rg -n -- "--deep: #2b2b2b|\.woof-detail-intro" src/styles.css
```

Expected: the old gray matches and `.woof-detail-intro` does not.

- [ ] **Step 2: Replace neutral palette tokens and rgba values**

Change `#2b2b2b` to `#3a3a3a`, `rgba(43,43,43,.68)` to `rgba(58,58,58,.68)`, `rgba(43,43,43,.14)` to `rgba(58,58,58,.14)`, and `rgba(43,43,43,.1)` to `rgba(58,58,58,.1)`.

- [ ] **Step 3: Add desktop WOOF layout styles before the responsive section**

```css
.woof-detail{background:var(--bg);color:var(--fg);padding:6.5rem var(--pad) 5rem}
.woof-detail-intro,.woof-story,.woof-detail-footer{max-width:var(--max-w);margin:0 auto}
.woof-detail-intro{display:grid;grid-template-columns:minmax(0,2.1fr) minmax(280px,1fr);gap:clamp(2.5rem,6vw,7rem);align-items:start}
.woof-detail-lead{margin:0;min-width:0}
.woof-detail-lead img,.woof-story img{width:100%;height:auto;display:block}
.woof-detail-aside{min-width:0}
.woof-detail-aside-inner{position:sticky;top:6.5rem;padding-top:.2rem}
.woof-detail-num{display:block;margin-bottom:2.2rem;font-size:.68rem;font-weight:700;letter-spacing:.12em}
.woof-detail-aside h1{font-size:clamp(1.8rem,3vw,3rem);line-height:1.05;letter-spacing:-.04em;text-wrap:balance}
.woof-detail-en{margin-top:.7rem;font-size:.72rem;color:var(--muted)}
.woof-detail-desc{margin-top:2rem;font-size:.78rem;line-height:1.85;color:var(--muted)}
.woof-detail-meta{margin-top:3rem;border-top:1px solid var(--line)}
.woof-detail-meta>div{display:grid;grid-template-columns:5.5rem 1fr;gap:1rem;padding:.8rem 0;border-bottom:1px solid var(--line);font-size:.66rem;line-height:1.55}
.woof-detail-meta dt{font-weight:700}.woof-detail-meta dd{color:var(--muted)}
.woof-story{margin-top:clamp(6rem,12vw,11rem)}
.woof-story-copy{max-width:38rem;margin:0 0 4rem}
.woof-story-copy-right{margin-left:auto}
.woof-story-copy>span{font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.woof-story-copy h2{margin-top:.8rem;font-size:clamp(1.7rem,3.2vw,3rem);line-height:1.12;letter-spacing:-.035em;text-wrap:balance}
.woof-story-copy p{max-width:60ch;margin-top:1.2rem;font-size:.82rem;line-height:1.9;color:var(--muted)}
.woof-story-wide{margin:0 0 clamp(6rem,11vw,10rem)}
.woof-story-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(1rem,3vw,2.5rem);align-items:start;margin-bottom:clamp(6rem,11vw,10rem)}
.woof-story-pair figure:nth-child(2){margin-top:clamp(3rem,8vw,8rem)}
.woof-story-asymmetric{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,.75fr);gap:clamp(1rem,3vw,2.5rem);align-items:end}
.woof-detail-footer{display:flex;justify-content:space-between;gap:2rem;align-items:flex-end;margin-top:clamp(7rem,12vw,12rem);padding-top:1.5rem;border-top:1px solid var(--line);font-size:.72rem}
.woof-detail-footer>a:last-child{display:flex;flex-direction:column;align-items:flex-end;gap:.4rem;text-align:right}
.woof-detail-footer span{color:var(--muted)}
.woof-detail-footer strong{font-size:clamp(1rem,2vw,1.5rem)}
```

- [ ] **Step 4: Add responsive and reduced-motion rules**

```css
@media(max-width:800px){
  .woof-detail{padding-top:5.5rem}
  .woof-detail-intro{grid-template-columns:1fr;gap:2.5rem}
  .woof-detail-aside{grid-row:1}
  .woof-detail-lead{grid-row:2}
  .woof-detail-aside-inner{position:static}
  .woof-detail-num{margin-bottom:1.2rem}
  .woof-detail-meta{margin-top:2rem}
  .woof-story-pair,.woof-story-asymmetric{grid-template-columns:1fr}
  .woof-story-pair figure:nth-child(2){margin-top:0}
  .woof-detail-footer{align-items:flex-start;flex-direction:column}
  .woof-detail-footer>a:last-child{align-items:flex-start;text-align:left}
}
@media(prefers-reduced-motion:reduce){
  .woof-detail *{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important}
}
```

- [ ] **Step 5: Record the version change**

Append to `VERSION.md`:

```markdown
- Lightened the neutral base to #3a3a3a and introduced a WOOF-WOOF editorial detail-page prototype with sticky project metadata and responsive image storytelling
```

- [ ] **Step 6: Build and commit**

Run: `npm run build`

Expected: Vite reports `✓ built` with exit code 0.

```bash
git add src/styles.css VERSION.md
git commit -m "style: finish woof editorial detail page"
```

### Task 4: Verify routing, layout, assets, and responsive behavior

**Files:**
- Verify: `src/components/WoofProjectDetail.jsx`
- Verify: `src/components/ProjectDetail.jsx`
- Verify: `src/styles.css`

**Interfaces:**
- Consumes: running Vite preview at `http://127.0.0.1:4176/`.
- Produces: evidence that WOOF is specialized, other routes remain generic, links work, six images load, and both desktop and mobile layouts fit the viewport.

- [ ] **Step 1: Run final static checks**

Run:

```bash
rg -n "#2b2b2b|rgba\(43,43,43" src/styles.css
rg -n "WoofProjectDetail|project.id === \"woof\"" src/components
npm run build
```

Expected: the first command has no matches; the second shows the import, branch and component; build exits 0.

- [ ] **Step 2: Verify desktop WOOF page in the in-app browser**

Open `http://127.0.0.1:4176/project/woof` at approximately 1280px width. Verify:

- lead image is left and archive copy is right;
- the right archive panel remains visible while scrolling the lead area;
- all six image URLs finish loading with non-zero natural width;
- no generic narrative skeleton cards appear;
- “Back to all projects” resolves to `/`;
- “Next project” resolves to `/project/memory`.

- [ ] **Step 3: Verify mobile WOOF page**

Resize to approximately 390px width and verify:

- metadata appears before the lead image;
- the metadata panel is not sticky;
- image pairs become a readable single column;
- `document.documentElement.scrollWidth <= window.innerWidth`.

- [ ] **Step 4: Verify an unaffected generic route**

Open `http://127.0.0.1:4176/project/metakeys` and verify the existing generic header, hero, narrative section and image grid still render.

- [ ] **Step 5: Commit any verification-only corrections**

If verification requires corrections, stage only the files changed for those corrections and commit:

```bash
git add src/components/WoofProjectDetail.jsx src/components/ProjectDetail.jsx src/i18n.jsx src/styles.css VERSION.md
git commit -m "fix: polish woof detail responsive layout"
```

If no corrections are required, do not create an empty commit.
