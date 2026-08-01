# 有请讲书人 Illustrator 长页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一份可编辑的“有请讲书人”作品集 AI 文件、HTML 参考、PNG 预览和预检报告。

**Architecture:** 使用一个 ExtendScript 脚本创建 RGB Illustrator 文档、10 个连续画板和 5 个命名图层，置入现有活动图片并绘制可编辑文字与图形；独立 HTML 文件使用同一套内容和版式参数。脚本保存 AI、导出长图预览并写出结构预检报告。

**Tech Stack:** Adobe Illustrator 2026、ExtendScript/JSX、AppleScript `osascript`、HTML/CSS、macOS `sips`

## Global Constraints

- 输出文件：`/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集.ai`
- 画板宽度：1440 px；RGB 模式；10 个命名画板。
- 图层固定为 `00-GUIDES`、`01-TYPE`、`02-GRAPHICS`、`03-IMAGES`、`04-ANNOTATIONS`。
- 个人职责固定为“主要负责主视觉、视觉规范与物料延展”。
- 核心叙事固定为“让阅读从个人理解走向公共表达”。
- 不增加未经素材证明的活动成效数据，不把现有日期擅自解释为未证明的赛制阶段。
- 不覆盖 `/Users/ttao/Downloads/作品集/` 中任何源文件。
- `.superpowers/` 和未跟踪的 `HANDOFF.md` 不加入提交。

---

## File Structure

- Create: `scripts/illustrator/build-storyteller-portfolio.jsx` — 创建 AI 文档、画板、图层、排版、预览和预检报告。
- Create: `scripts/illustrator/storyteller-reference.html` — 与 AI 一致的浏览器排版参考。
- Create: `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集.ai` — 最终可编辑源文件。
- Create: `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集-preview.png` — 长图预览。
- Create: `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集-preflight.txt` — 结构预检报告。
- Create: `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集参考.html` — 独立 HTML 参考。

### Task 1: 创建 Illustrator 与 HTML 构建文件

**Files:**
- Create: `scripts/illustrator/build-storyteller-portfolio.jsx`
- Create: `scripts/illustrator/storyteller-reference.html`

**Interfaces:**
- Consumes: `/Users/ttao/Downloads/作品集/有请讲书人2025横版主kv.png`、`assets/portfolio-pages/38.jpg` 至 `43.jpg`。
- Produces: `addBoard(name, height)`、`addAreaText(layer, name, text, rect, fontSize, color, leading)`、`placeImage(layer, name, path, rect, mode)`、`addRect(layer, name, rect, color)`、`writePreflight(path)`。

- [ ] **Step 1: 验证源素材存在并记录尺寸**

Run:

```bash
for image in \
  '/Users/ttao/Downloads/作品集/有请讲书人2025横版主kv.png' \
  assets/portfolio-pages/38.jpg \
  assets/portfolio-pages/39.jpg \
  assets/portfolio-pages/40.jpg \
  assets/portfolio-pages/41.jpg \
  assets/portfolio-pages/42.jpg \
  assets/portfolio-pages/43.jpg; do
  test -f "$image" || exit 1
  sips -g pixelWidth -g pixelHeight "$image" 2>/dev/null
done
```

Expected: 七张素材全部存在；横版 KV 为 8000 × 4500 px，其余作品集图片为 2880 × 1620 px。

- [ ] **Step 2: 编写固定画板、图层和辅助函数**

脚本创建以下画板：

```javascript
var boards = [
  { name: "01-COVER", height: 810 },
  { name: "02-CONTEXT", height: 900 },
  { name: "03-JOURNEY", height: 860 },
  { name: "04-CONCEPT", height: 900 },
  { name: "05-SYSTEM", height: 900 },
  { name: "06-ENGAGEMENT", height: 900 },
  { name: "07-LAYOUT-RULES", height: 900 },
  { name: "08-SPATIAL", height: 900 },
  { name: "09-TOUCHPOINTS", height: 960 },
  { name: "10-GUIDE", height: 780 }
];
```

Expected: 每个画板宽 1440 px、间隔 80 px，五个图层和辅助函数只定义一次。

- [ ] **Step 3: 构建封面、背景、链路、概念和视觉系统**

实现：

```text
01-COVER：完整横版主 KV，只叠加 PROJECT 07 / EVENT VISUAL 索引。
02-CONTEXT：深圳读书月背景、项目目的、时间和职责。
03-JOURNEY：报名传播 / 评选沟通 / 总决赛 / 分享与留念，以及三项设计挑战。
04-CONCEPT：核心句、书页—台阶—舞台推导、麦克风和流线说明。
05-SYSTEM：上升的书页、持续的讲述、金橙蓝色彩与字体规范。
```

Expected: 文案与设计规格一致；文字对象全部位于 `01-TYPE`；不出现虚构数据。

- [ ] **Step 4: 构建参与传播、版式规范、空间、触点和指南**

实现：

```text
06-ENGAGEMENT：38.jpg 与三维阶梯传播逻辑。
07-LAYOUT-RULES：40.jpg，完整显示横竖版和结构网格。
08-SPATIAL：41.jpg 的完整图与局部放大。
09-TOUCHPOINTS：42.jpg 与 43.jpg，覆盖现场、证件和移动端邀请。
10-GUIDE：项目总结、1440 px 画板、72/48 px 边距和字号表。
```

Expected: 图片等比置入或裁切，无拉伸；每组图片包含 12–13 px 图注。

- [ ] **Step 5: 编写 HTML 参考**

HTML 使用内嵌 CSS 和相同章节顺序，通过绝对 `file://` 路径引用图片，清晰标注 1440 px 画板和字号规则。

Expected:

```bash
rg -n '让阅读从个人理解走向公共表达|主要负责主视觉、视觉规范与物料延展|PROJECT 07|AI BUILD GUIDE' scripts/illustrator/storyteller-reference.html
```

四项均匹配。

- [ ] **Step 6: 检查占位符与基础语法**

Run:

```bash
rg -n 'TBD|TODO|undefined|placeholder|稍后补充' \
  scripts/illustrator/build-storyteller-portfolio.jsx \
  scripts/illustrator/storyteller-reference.html
sed '1d' scripts/illustrator/build-storyteller-portfolio.jsx | node --check
```

Expected: 占位符扫描无输出，Node 语法检查通过。

- [ ] **Step 7: 提交构建文件**

```bash
git add scripts/illustrator/build-storyteller-portfolio.jsx scripts/illustrator/storyteller-reference.html
git commit -m "feat: add Storyteller Illustrator portfolio builder"
```

### Task 2: 在 Adobe Illustrator 中生成交付文件

**Files:**
- Execute: `scripts/illustrator/build-storyteller-portfolio.jsx`
- Create: `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集.ai`
- Create: `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集-preview.png`
- Create: `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集-preflight.txt`
- Create: `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集参考.html`

**Interfaces:**
- Consumes: Task 1 的 JSX 和 HTML 文件。
- Produces: 可编辑 AI、PNG 预览、预检文本和独立 HTML。

- [ ] **Step 1: 复制 HTML 参考到交付目录**

Run:

```bash
cp scripts/illustrator/storyteller-reference.html '/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集参考.html'
```

Expected: 目标 HTML 存在且非空。

- [ ] **Step 2: 通过 Illustrator 执行脚本**

Run:

```bash
osascript -e 'tell application "Adobe Illustrator" to activate' \
  -e 'tell application "Adobe Illustrator" to do javascript file POSIX file "/Users/ttao/Documents/Codex/2026-07-11/new-chat/outputs/portfolio-v4-source-shwung/scripts/illustrator/build-storyteller-portfolio.jsx"'
```

Expected: Illustrator 保存 AI、PNG 预览和预检报告，无错误对话框。

- [ ] **Step 3: 验证输出文件与预检报告**

Run:

```bash
test -s '/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集.ai'
test -s '/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集-preview.png'
test -s '/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集-preflight.txt'
LC_ALL=C tr '\r' '\n' < '/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集-preflight.txt' | \
  rg '^artboards=10$|^layers=5$|^missing_images=0$|^document_color_space=RGB$'
```

Expected: 三个文件非空，预检四项全部匹配。

### Task 3: 视觉检查与交付

**Files:**
- Inspect: `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集.ai`
- Inspect: `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集-preview.png`

**Interfaces:**
- Consumes: Task 2 的交付文件。
- Produces: 通过结构、内容和视觉检查的最终文件。

- [ ] **Step 1: 检查预览尺寸和色彩空间**

Run:

```bash
sips -g pixelWidth -g pixelHeight -g space \
  '/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集-preview.png'
```

Expected: 宽度大于 1000 px，颜色空间为 RGB 或 sRGB。

- [ ] **Step 2: 逐画板视觉检查**

检查封面、背景、活动链路、概念、视觉系统、参与传播、版式规范、空间物料、现场与数字触点和排版指南；确认无空白画板、缺图、图片拉伸、明显文字重叠或错误裁切。

Expected: 10 个画板全部包含可读内容，暖金官方识别与蓝黄传播视觉形成清晰层级和节奏。

- [ ] **Step 3: 检查 Illustrator 当前文档结构**

Run:

```bash
osascript -e 'tell application "Adobe Illustrator" to do javascript "activeDocument.name + \"|artboards=\" + activeDocument.artboards.length + \"|layers=\" + activeDocument.layers.length"'
```

Expected: 返回文件名、`artboards=10` 和 `layers=5`。

- [ ] **Step 4: 生产构建与仓库检查**

Run:

```bash
npm run build
git diff --check
git status --short
```

Expected: Vite 生产构建通过；构建脚本已提交；`.superpowers/` 和既有 `HANDOFF.md` 未加入提交；无未提交的功能性修改。
