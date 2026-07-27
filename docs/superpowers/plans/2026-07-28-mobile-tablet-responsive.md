# Mobile and Tablet Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不改变现有桌面端视觉语言、项目内容和路由结构的前提下，完成手机与 iPad 的响应式适配，并完整保留目录页与项目列表的两套项目预览交互。

**Architecture:** 优先通过 `src/styles.css` 的分层媒体查询修正布局，避免重写现有组件。只在触控语义、可访问性或结构无法由 CSS 完成时修改 React 组件。桌面继续使用 hover 动画；触控设备使用 focus/active 反馈，项目理解与跳转不依赖 hover。

**Tech Stack:** React、React Router、Framer Motion、CSS、Vite

## Global Constraints

- 保留主色：荧光黄 `#E6FF1A`、暖白、深灰。
- 保留入口页、主作品集页、7 个项目详情页和现有路由。
- 不删除自定义鼠标、点击效果、玻璃任务栏、荧光笔视觉语言。
- 保留第二页两套预览：
  1. `Projects` 目录整行变深灰、项目标题放大的交互。
  2. 每个项目右侧黄色文件夹展开三张预览图的交互。
- 手机与平板不得产生横向滚动。
- 项目卡整块区域继续可点击，不缩小点击热区。
- 不改写项目文案，不更换项目图片。

---

## Task 1: 建立响应式基础规则和锚点偏移

**Files:**

- Modify: `src/styles.css`
- Verify: `src/components/ScrollManager.jsx`

- [ ] **Step 1: 记录当前关键选择器，避免重复定义**

Run:

```bash
rg -n "@media|scroll-margin|hero|info-section|directory|project-section|detail-taskbar" src/styles.css
```

Expected: 输出现有断点和关键模块位置，确认新增规则放在文件末尾的响应式覆盖区。

- [ ] **Step 2: 添加统一的媒体尺寸与安全宽度规则**

在 `src/styles.css` 响应式覆盖区加入以下布局原则：

```css
img,
video,
canvas {
  max-width: 100%;
}

#info,
#directory,
#work,
#contact,
.project-section {
  scroll-margin-top: 88px;
}

@media (max-width: 899px) {
  html,
  body,
  #root {
    max-width: 100%;
    overflow-x: clip;
  }
}

@media (max-width: 599px) {
  #info,
  #directory,
  #work,
  #contact,
  .project-section {
    scroll-margin-top: 72px;
  }
}
```

若现有类名不同，使用实际锚点和项目区块类名，不新增无效选择器。

- [ ] **Step 3: 确认滚动管理不强制把详情页停在底部**

Read:

```bash
sed -n '1,240p' src/components/ScrollManager.jsx
```

Expected: 路由切换到项目详情时回到顶部；带 hash 时定位对应锚点。只有确有问题时才修改。

- [ ] **Step 4: 做 CSS 语法和构建基线检查**

Run:

```bash
pnpm build
```

Expected: Vite build 成功，无 CSS 解析错误。

- [ ] **Step 5: 提交基础规则**

```bash
git add src/styles.css src/components/ScrollManager.jsx
git commit -m "style: add responsive layout foundations"
```

---

## Task 2: 适配入口页、Hero 和玻璃任务栏

**Files:**

- Modify: `src/styles.css`
- Modify only if required: `src/pages/Entry.jsx`
- Modify only if required: `src/pages/Home.jsx`

- [ ] **Step 1: 为手机任务栏建立单行可触控布局**

在 `max-width: 599px` 下：

```css
.site-nav {
  width: calc(100% - 24px);
  min-height: 48px;
  padding-inline: 14px;
}

.site-nav a,
.site-nav button {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
```

使用项目实际任务栏类名。保持 `Lusen Tao / WORK / INFO / CONTACT` 单行；必要时缩小间距和字号，不换行。

- [ ] **Step 2: 收紧手机 Hero 的固定高度与空白**

手机端使用内容驱动的最小高度：

```css
@media (max-width: 599px) {
  .hero {
    min-height: 100svh;
    height: auto;
    padding: 88px 20px 48px;
  }

  .hero-title {
    font-size: clamp(52px, 17vw, 76px);
    line-height: 0.9;
  }
}
```

保留当前深色渐变、字体和信息层级，不把 Hero 改成新的设计。

- [ ] **Step 3: 适配入口页项目目录**

入口页在手机端：

- 主标题保持居中偏上。
- 项目列表整体向下但仍在首屏自然范围内。
- 项目名紧凑排列。
- 项目悬停图片在 `(hover: none)` 下隐藏，避免遮挡文字。
- 导航按钮触控高度不低于 44px。

建议规则：

```css
@media (hover: none) {
  .entry-project-preview {
    display: none;
  }
}
```

使用实际类名。

- [ ] **Step 4: 检查 390×844 和 768×1024**

使用浏览器分别打开：

```text
http://127.0.0.1:4176/
http://127.0.0.1:4176/portfolio
```

Expected:

- 无横向滚动。
- 任务栏不换行、不超出屏幕。
- Hero 标题不被裁切。
- 入口项目名不被预览图遮挡。

- [ ] **Step 5: 提交入口和 Hero 适配**

```bash
git add src/styles.css src/pages/Entry.jsx src/pages/Home.jsx
git commit -m "style: adapt entry and hero for touch screens"
```

---

## Task 3: 重排关于我与个人信息区域

**Files:**

- Modify: `src/styles.css`
- Modify only if required: `src/pages/Home.jsx`

- [ ] **Step 1: 手机端将照片居中并扩大有效宽度**

```css
@media (max-width: 599px) {
  .info-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .profile-photo {
    width: min(100%, 320px);
    margin-inline: auto;
  }
}
```

使用实际类名。消除当前 260px 左对齐造成的右侧空洞。

- [ ] **Step 2: 手机端将信息标签置于内容上方**

```css
@media (max-width: 599px) {
  .info-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding-block: 20px;
  }
}
```

保留 EDUCATION、EXPERIENCE、TOOLS、CONTACT 的原文字与顺序。

- [ ] **Step 3: 竖屏平板恢复双栏**

```css
@media (min-width: 600px) and (max-width: 899px) {
  .info-layout {
    grid-template-columns: minmax(220px, 240px) minmax(0, 1fr);
    gap: clamp(28px, 4vw, 36px);
    align-items: start;
  }
}
```

- [ ] **Step 4: 浏览器验证**

Expected:

- 390px：照片居中，信息单列，不存在大块无意义留白。
- 768px：照片与信息双栏，文字不挤压。
- 1024px：维持现有桌面结构。

- [ ] **Step 5: 提交信息区适配**

```bash
git add src/styles.css src/pages/Home.jsx
git commit -m "style: improve responsive profile information"
```

---

## Task 4: 保留并适配 Projects 目录交互

**Files:**

- Modify: `src/styles.css`
- Modify only if required: `src/pages/Home.jsx`

- [ ] **Step 1: 保持桌面端整行深灰与标题放大**

确认现有规则仍覆盖精细指针设备：

```css
@media (hover: hover) and (pointer: fine) {
  .directory-row:hover {
    background: var(--directory-hover-gray);
  }

  .directory-row:hover .directory-title {
    transform: scale(1.04);
  }
}
```

使用当前真实颜色变量或现有深灰值，不引入橄榄绿。

- [ ] **Step 2: 给键盘和触控设备等价反馈**

```css
.directory-row:focus-visible,
.directory-row:focus-within {
  background: var(--directory-hover-gray);
}

@media (hover: none) {
  .directory-row {
    touch-action: manipulation;
  }

  .directory-row:active {
    background: var(--directory-hover-gray);
  }

  .directory-row:active .directory-title {
    transform: scale(1.02);
  }
}
```

触控反馈不能作为查看项目名或进入详情页的必要条件。

- [ ] **Step 3: 手机与平板隐藏次要标签**

在 `max-width: 899px` 下隐藏目录行右侧类别/年份等次要标签，只保留项目名和必要方向指示；保持整行链接。

- [ ] **Step 4: 验证目录页**

Route:

```text
http://127.0.0.1:4176/portfolio#directory
```

Expected:

- 桌面：悬停时整行变深灰，标题明显但克制地放大。
- 手机/iPad：按压时有深灰反馈，项目名始终可读。
- 每行任意位置均能进入对应项目。

- [ ] **Step 5: 提交目录交互适配**

```bash
git add src/styles.css src/pages/Home.jsx
git commit -m "style: preserve directory previews across inputs"
```

---

## Task 5: 重排首页项目区与黄色文件夹三图预览

**Files:**

- Modify: `src/styles.css`
- Modify only if required: `src/pages/Home.jsx`
- Verify: `src/components/InteractiveCover.jsx`

- [ ] **Step 1: 确认整个项目区仍是单一大点击热区**

Read:

```bash
rg -n "project-hit|InteractiveCover|project-section|to=.*/project" src/pages/Home.jsx src/components/InteractiveCover.jsx
```

Expected: 标题、说明、文件夹和图片都位于同一个项目链接内。若存在嵌套链接，调整为一个语义链接，避免非法 DOM。

- [ ] **Step 2: 手机端压缩项目垂直距离**

```css
@media (max-width: 599px) {
  .project-section {
    min-height: auto;
    padding: 64px 20px;
  }

  .project-summary {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .project-folder {
    width: min(270px, 78vw);
    height: 185px;
    margin-inline: auto;
  }
}
```

文件夹位于项目文字之后，不能因绝对定位遮挡标题。

- [ ] **Step 3: 手机端使用“1 + 2”图片网格**

```css
@media (max-width: 599px) {
  .project-image-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .project-image-grid > :first-child {
    grid-column: 1 / -1;
  }
}
```

所有项目保持三张图；`杂项`继续遵循现有“不显示预览图”的设计决定。

- [ ] **Step 4: 平板端让三图同排**

```css
@media (min-width: 600px) and (max-width: 899px) {
  .project-summary {
    grid-template-columns: minmax(0, 1fr) 250px;
    gap: 28px;
  }

  .project-image-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
}
```

- [ ] **Step 5: 保留黄色文件夹展开三图动画**

桌面端继续使用 hover/focus：

```css
.project-hit-area:hover .folder-preview-image,
.project-hit-area:focus-visible .folder-preview-image,
.project-hit-area:focus-within .folder-preview-image {
  opacity: 1;
  transform: var(--folder-open-transform);
}
```

触控端使用按压反馈，但不要求用户先打开文件夹才能跳转：

```css
@media (hover: none) {
  .project-hit-area:active .project-folder {
    transform: scale(0.98);
  }

  .project-hit-area:active .folder-preview-image {
    opacity: 1;
  }
}
```

三张图打开后最终透明度必须为 `1`，移开后再缩回文件夹。

- [ ] **Step 6: 验证首页项目区**

Route:

```text
http://127.0.0.1:4176/portfolio#work
```

Expected:

- 390px：项目紧凑、文件夹不遮挡、图片为 1+2。
- 768px：文字与文件夹双栏、三图一行。
- 1024px：维持桌面现有排版。
- 桌面悬停：文件夹完整展开三图，最终不透明。
- 整个项目方块区域可点击。

- [ ] **Step 7: 提交项目区适配**

```bash
git add src/styles.css src/pages/Home.jsx src/components/InteractiveCover.jsx
git commit -m "style: adapt project folders and image grids"
```

---

## Task 6: 统一所有项目详情页的任务栏与内容布局

**Files:**

- Modify: `src/styles.css`
- Modify only if required: `src/components/ProjectDetail.jsx`
- Modify only if required: project-specific detail components under `src/pages` or `src/components`

- [ ] **Step 1: 找出详情页共享结构**

Run:

```bash
rg -n "detail-taskbar|project-detail|project-pager|PROJECT|项目" src
```

Expected: 确认优先修改共享类，而非逐页复制 CSS。

- [ ] **Step 2: 手机端压缩玻璃任务栏**

```css
@media (max-width: 599px) {
  .detail-taskbar {
    width: calc(100% - 24px);
    min-height: 48px;
    padding-inline: 12px;
    gap: 10px;
  }

  .detail-taskbar__title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
```

保留左侧返回、居中项目名、右侧项目排序。右下角旧“全部项目”按钮保持删除状态。

- [ ] **Step 3: 保留 WOOF 左图右文的桌面陈列结构**

- 大于等于 800px：左侧图片滚动，右侧说明 `position: sticky`。
- 小于 800px：自然单列，文字在图片前，取消 sticky。
- 不强行把竖图裁成横图，使用 `height: auto` 和原始比例。

- [ ] **Step 4: 统一其他详情页的移动端间距**

在 `max-width: 799px` 下：

- 详情 Hero、正文、图片间距缩小约 20–30%。
- 图片保持原比例。
- 双栏模块改为单栏。
- 项目上下页导航改为单列。
- 关于我和求职联系区保持可读，不溢出。

在 `600–899px` 下，上下页导航可保持两列。

- [ ] **Step 5: 验证所有详情路由**

Open:

```text
/project/whelk
/project/woof
/project/memory
/project/metakeys
/project/gala
/project/storyteller
/project/misc
```

Expected:

- 每页打开位于顶部。
- 任务栏无溢出且保留玻璃质感。
- 图片不被横向裁切。
- WOOF 在桌面右侧文字 sticky，手机自然单列。
- 上一项目/下一项目可触控。

- [ ] **Step 6: 提交详情页适配**

```bash
git add src/styles.css src/components src/pages
git commit -m "style: unify responsive project detail pages"
```

---

## Task 7: 全尺寸视觉回归与最终验证

**Files:**

- Modify as needed: `src/styles.css`
- Modify as needed: affected React components

- [ ] **Step 1: 启动开发服务器**

Run:

```bash
pnpm dev --host 127.0.0.1 --port 4176
```

Expected: `http://127.0.0.1:4176/` 可访问。

- [ ] **Step 2: 验证四个目标视口**

逐一检查：

```text
390 × 844
768 × 1024
1024 × 768
1440 × 900
```

每个视口检查：

- 入口页
- `/portfolio`
- `/portfolio#directory`
- `/portfolio#work`
- `/portfolio#info`
- WOOF 详情
- MetaKeys 详情
- 一个活动类详情

- [ ] **Step 3: 检查双预览效果**

桌面：

- 目录行 hover：深灰背景延伸整行，标题放大。
- 项目 hover：黄色文件夹打开，三图由透明到完全不透明。

触控模拟：

- 目录按压有深灰反馈。
- 项目按压有文件夹反馈。
- 不触发 hover 也能阅读项目信息并直接进入详情页。

- [ ] **Step 4: 检查横向溢出**

在浏览器控制台对每个目标路由执行：

```js
document.documentElement.scrollWidth <= window.innerWidth
```

Expected: `true`

- [ ] **Step 5: 运行生产构建**

Run:

```bash
pnpm build
```

Expected: 构建成功，无 lint/编译错误。

- [ ] **Step 6: 检查修改范围**

Run:

```bash
git diff --check
git status --short
git diff --stat
```

Expected: 无空白错误；不包含素材替换、文案改写或无关文件。

- [ ] **Step 7: 最终提交**

```bash
git add src
git commit -m "feat: complete mobile and tablet portfolio adaptation"
```

