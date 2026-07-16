# Project Labels and MetaKeys Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every detail-page number explicitly bilingual and give MetaKeys a dedicated editorial layout that respects its portrait, landscape, and square source images.

**Architecture:** Add one reusable formatter for bilingual project labels, consume it in the generic, WOOF-WOOF, and new MetaKeys detail layouts, and branch MetaKeys from the generic detail component. Keep bilingual MetaKeys archive copy in the existing i18n dictionaries and isolate presentation behind `.metakeys-detail` selectors.

**Tech Stack:** React 19, React Router 7, Framer Motion 12, Vite 4, vanilla CSS.

## Global Constraints

- Display `PROJECT NN / 项目 NN` on all seven project detail pages.
- Preserve original image aspect ratios and never crop MetaKeys images.
- Add no dependency and do not modify source image files.
- Keep all non-WOOF, non-MetaKeys image layouts unchanged.
- Respect `prefers-reduced-motion` and use the existing 800px mobile breakpoint.

---

### Task 1: Add reusable bilingual project labels

**Files:**
- Create: `src/components/ProjectLabel.jsx`
- Modify: `src/components/ProjectDetail.jsx`
- Modify: `src/components/WoofProjectDetail.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Produces: `ProjectLabel({ num, className = "" })`, rendering `<span className="project-label ...">PROJECT {num} <i>/</i> 项目 {num}</span>`.
- Consumes: two-character `project.num` strings already present in `src/data/projects.js`.

- [ ] **Step 1: Verify the new label is absent**

Run: `rg -n "PROJECT.*项目" src/components`

Expected: no matches.

- [ ] **Step 2: Create the label component**

```jsx
export default function ProjectLabel({ num, className = "" }) {
  return (
    <span className={`project-label ${className}`.trim()}>
      PROJECT {num} <i aria-hidden="true">/</i> 项目 {num}
    </span>
  );
}
```

- [ ] **Step 3: Replace generic and WOOF number spans**

Import `ProjectLabel` in both detail components. Replace `<span className="detail-num">{project.num}</span>` with `<ProjectLabel num={project.num} />`, and replace `<span className="woof-detail-num">{project.num}</span>` with `<ProjectLabel num={project.num} />`.

- [ ] **Step 4: Add shared label styling**

```css
.project-label{display:block;margin-bottom:1.35rem;font-size:clamp(1rem,1.35vw,1.125rem);font-weight:650;line-height:1.2;letter-spacing:.075em;text-transform:uppercase;color:var(--fg)}
.project-label i{padding:0 .2em;font-style:normal;color:var(--muted)}
```

- [ ] **Step 5: Build**

Run: `npm run build`

Expected: Vite prints `✓ built` and exits 0.

### Task 2: Add MetaKeys bilingual archive content

**Files:**
- Modify: `src/i18n.jsx`

**Interfaces:**
- Produces: `projects.metakeys.detail.meta`, `sections`, `back`, `nextLabel`, and `nextTitle` in Chinese and English.

- [ ] **Step 1: Verify MetaKeys detail copy is absent**

Run: `rg -n "模块化产品逻辑|Modular product logic" src/i18n.jsx`

Expected: no matches.

- [ ] **Step 2: Add Chinese MetaKeys detail copy**

```jsx
detail: {
  meta: [
    { label: "项目类型", value: "品牌设计 · 产品视觉 · 3D视觉" },
    { label: "个人职责", value: "品牌概念 · 视觉识别 · 包装与应用 · 3D呈现" },
    { label: "项目时间", value: "2025" },
  ],
  sections: [
    { label: "品牌概念", title: "让键帽成为可携带、可替换的个性载体", body: "MetaKeys 将客制键帽从单一电脑配件扩展为个人表达媒介。品牌视觉围绕透明、模块与收藏感展开，使产品概念在海报、包装和随身应用中保持一致。" },
    { label: "产品逻辑", title: "以标准化底座承载可替换的内容物", body: "黑透外壳、可替换内容物与统一底座构成模块化系统。产品图和结构视觉强调组装关系，让用户快速理解不同部件如何组合。" },
    { label: "视觉延展", title: "从静态识别延伸到包装、挂绳与三维场景", body: "设计以高对比黑白为基础，通过透明材质、绿色点缀和放大的产品细节建立科技感，并在不同媒介中保持统一的识别节奏。" },
  ],
  back: "返回全部项目",
  nextLabel: "下一个项目",
  nextTitle: "FRIDAY 缘起·热爱 — 帆书年会视觉",
},
```

- [ ] **Step 3: Add matching English MetaKeys detail copy**

Use the same keys with accurate English values: project type `Brand Identity · Product Visual · 3D Visual`, role `Brand Concept · Visual Identity · Packaging & Applications · 3D Presentation`, year `2025`, and three sections titled `A keycap as a portable, replaceable carrier of identity`, `A standardised base for replaceable inner objects`, and `Extending the identity across packaging, lanyards, and 3D scenes`.

- [ ] **Step 4: Build**

Run: `npm run build`

Expected: exit 0.

### Task 3: Create the MetaKeys editorial component

**Files:**
- Create: `src/components/MetaKeysProjectDetail.jsx`
- Modify: `src/components/ProjectDetail.jsx`

**Interfaces:**
- Consumes: `project`, `projectT`, `project.images[0..8]`, shared `ProjectLabel`, React Router `Link`, and Framer Motion `useReducedMotion`.
- Produces: `MetaKeysProjectDetail({ project, projectT })`.

- [ ] **Step 1: Create the dedicated component**

Implement semantic markup with these exact image groups:

```jsx
<section className="metakeys-detail-intro">
  <figure className="metakeys-detail-lead"><img src={project.hero} /></figure>
  <aside className="metakeys-detail-aside">...</aside>
</section>
<section className="metakeys-story">
  <div className="metakeys-story-copy">{detail.sections[0]}</div>
  <div className="metakeys-portrait-pair">{images[0]} {images[1]}</div>
  <div className="metakeys-story-copy metakeys-story-copy-right">{detail.sections[1]}</div>
  <figure className="metakeys-landscape">{images[3]}</figure>
  <div className="metakeys-story-copy">{detail.sections[2]}</div>
  <div className="metakeys-system-grid"><figure>{images[4]}</figure><div><figure>{images[5]}</figure><figure>{images[6]}</figure></div></div>
  <div className="metakeys-square-pair">{images[7]} {images[8]}</div>
</section>
```

Reuse the WOOF detail metadata markup, reveal helper pattern, back link to `/`, and next link to `/project/gala`. Every `<img>` receives descriptive alt text and uses natural dimensions.

- [ ] **Step 2: Branch MetaKeys from the generic component**

Import `MetaKeysProjectDetail` and add after the WOOF branch:

```jsx
if (project.id === "metakeys") {
  return <MetaKeysProjectDetail project={project} projectT={projectT} />;
}
```

- [ ] **Step 3: Build**

Run: `npm run build`

Expected: exit 0 with no JSX or missing import errors.

### Task 4: Style and verify the MetaKeys layout

**Files:**
- Modify: `src/styles.css`
- Modify: `VERSION.md`

**Interfaces:**
- Consumes: all `.metakeys-*` classes from Task 3.
- Produces: 68/32 desktop intro, natural-ratio image groups, one-column mobile flow, and no horizontal overflow.

- [ ] **Step 1: Add desktop layout rules**

Reuse WOOF typography and archive spacing through grouped selectors. Add a 68/32 `.metakeys-detail-intro`, sticky `.metakeys-detail-aside-inner`, two-column `.metakeys-portrait-pair`, full-width `.metakeys-landscape`, 60/40 `.metakeys-system-grid` with the right column stacked, and equal `.metakeys-square-pair`. All image selectors must use `width:100%;height:auto;object-fit:contain`.

- [ ] **Step 2: Add mobile rules inside `@media(max-width:800px)`**

Set the intro, portrait pair, system grid, and square pair to one column; place the aside before the lead; make the aside inner `position:static`; remove staggered vertical offsets.

- [ ] **Step 3: Record the version**

Append:

```markdown
- Standardized bilingual PROJECT NN / 项目 NN labels and added an aspect-ratio-aware MetaKeys editorial detail layout
```

- [ ] **Step 4: Run final verification**

Run:

```bash
git diff --check
npm run build
```

Expected: no diff errors and Vite exits 0.

In the browser verify `/project/metakeys` loads all nine images at non-zero natural width, contains no `.detail-grid`, links to `/project/gala`, and has `scrollWidth <= innerWidth`. Verify `/project/woof` and `/project/memory` both display `PROJECT NN / 项目 NN`.
