# FRIDAY 2026 年会 Illustrator 长页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一份可编辑的 `FRIDAY-2026-年会作品集.ai`，在 Illustrator 中复刻已确认的 HTML 长页原型，并为用户保留清晰图层、版式参数和源素材。

**Architecture:** 使用一份 ExtendScript 脚本在 Adobe Illustrator 中新建 RGB 文档、创建连续纵向画板、建立五个命名图层、置入 31–35 号图片并生成全部可编辑文字与图形。脚本保存 `.ai` 主文件并导出一张低分辨率总览 PNG；随后重新打开 AI 文件并以脚本和导出图双重检查结构与视觉结果。

**Tech Stack:** Adobe Illustrator 2026、ExtendScript/JSX、AppleScript `osascript`、macOS `sips`

## Global Constraints

- 输出文件：`/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集.ai`
- 色彩模式：RGB。
- 基准画板宽度：1440 px。
- 使用现有 `assets/portfolio-pages/31.jpg` 至 `35.jpg`，不覆盖源图。
- 标题、正文、图注、色块、分割线和标记保持为独立可编辑对象。
- 图层固定为 `00-GUIDES`、`01-TYPE`、`02-GRAPHICS`、`03-IMAGES`、`04-ANNOTATIONS`。
- 中文字体优先使用苹方或思源黑体；缺失时使用系统可用中文字体，不转曲。
- 不虚构参与人数、业务结果或用户反馈。
- `.superpowers/` 和现有未跟踪的 `HANDOFF.md` 不加入任何提交。

---

## File Structure

- Create: `scripts/illustrator/build-gala-portfolio.jsx` — 唯一的 Illustrator 构建脚本，包含文档、画板、图层、文字、图形、图片置入、保存和导出逻辑。
- Create: `/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集.ai` — 用户可继续编辑的最终源文件。
- Create: `/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集-preview.png` — 用于快速视觉检查的总览预览。
- Create: `/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集-preflight.txt` — 构建脚本写出的画板、图层、图片和文本数量报告。

### Task 1: 编写 Illustrator 文档构建脚本

**Files:**
- Create: `scripts/illustrator/build-gala-portfolio.jsx`

**Interfaces:**
- Consumes: `assets/portfolio-pages/31.jpg`、`32.jpg`、`33.jpg`、`34.jpg`、`35.jpg`。
- Produces: Illustrator 文档对象，以及 `addText(layer, text, x, y, width, fontSize, color, leading)`、`placeCover(layer, filePath, artboardRect)`、`addArtboard(name, height)` 和 `writePreflight(document, outputPath)` 辅助函数。

- [ ] **Step 1: 验证五张源图存在且尺寸一致**

Run:

```bash
for image in assets/portfolio-pages/{31,32,33,34,35}.jpg; do
  test -f "$image" || exit 1
  sips -g pixelWidth -g pixelHeight "$image" 2>/dev/null
done
```

Expected: 五张图片均存在，尺寸均为 `2880 × 1620`。

- [ ] **Step 2: 创建脚本并定义固定画板结构**

脚本创建 10 个纵向排列、间隔 80 px 的画板：

```javascript
var boards = [
  { name: "01-COVER", height: 810 },
  { name: "02-CONTEXT", height: 900 },
  { name: "03-SCENE", height: 810 },
  { name: "04-CHALLENGE", height: 760 },
  { name: "05-CONCEPT", height: 920 },
  { name: "06-SYSTEM", height: 800 },
  { name: "07-SPACE", height: 810 },
  { name: "08-DIGITAL", height: 810 },
  { name: "09-MATERIALS", height: 810 },
  { name: "10-GUIDE", height: 720 }
];
```

Expected: 每个画板宽 1440 px，名称与高度完全匹配规格。

- [ ] **Step 3: 建立命名图层与绘图辅助函数**

脚本必须按以下顺序创建图层并设置名称：

```javascript
var layerNames = ["00-GUIDES", "01-TYPE", "02-GRAPHICS", "03-IMAGES", "04-ANNOTATIONS"];
```

辅助函数必须集中处理 RGB 颜色、矩形、分割线、文本框、图片等比裁切和对象命名，避免在章节代码中重复坐标换算。

Expected: 所有新增对象进入对应图层并使用 `B01-` 至 `B10-` 前缀命名。

- [ ] **Step 4: 构建封面、背景、挑战和概念画板**

实现以下内容：

```text
01-COVER: 31.jpg 满版；项目编号、标题、英文副标题和个人职责。
02-CONTEXT: 暖白双栏；约 350 位核心书友、300–400 人、2025–2026、全案独立设计与落地。
03-SCENE: 32.jpg 以 1344 × 756 px 展示，带 13 px 图注。
04-CHALLENGE: 情感表达、气质平衡、跨媒介一致三项横向条目。
05-CONCEPT: 深酒红背景、红黄光斑、颗粒化圆点与 82 px 核心概念句。
```

Expected: 文案与 `2026-08-01-gala-ai-layout-design.md` 一致，无超出画板边界的对象。

- [ ] **Step 5: 构建视觉系统、三组应用和排版指南画板**

实现以下内容：

```text
06-SYSTEM: 聚合的光、记忆的颗粒、节奏化字标三张并列卡片。
07-SPACE: 33.jpg 与空间主场景图注。
08-DIGITAL: 34.jpg 与移动端邀请函、现场导视图注。
09-MATERIALS: 35.jpg 与流程单、门票、帆布袋图注。
10-GUIDE: 画板、边距、字号、行距、间距和正文行宽参数表。
```

Expected: 三张应用图片均保持 16:9，不拉伸；指南列出 `72 px` 文本边距、`48 px` 大图边距和 `24 / 48 / 72 / 120 px` 间距阶梯。

- [ ] **Step 6: 添加保存、预览导出和预检报告**

脚本保存 AI 后写出以下键值：

```text
artboards=10
layers=5
placed_images=5
missing_images=0
document_color_space=RGB
```

同时导出 `FRIDAY-2026-年会作品集-preview.png`。

Expected: 三个输出路径均指向 `/Users/ttao/Documents/作品集/`。

- [ ] **Step 7: 检查脚本中的占位符和语法风险**

Run:

```bash
rg -n 'TBD|TODO|undefined|\.\.\.' scripts/illustrator/build-gala-portfolio.jsx
```

Expected: 无输出。

- [ ] **Step 8: 提交构建脚本**

```bash
git add scripts/illustrator/build-gala-portfolio.jsx
git commit -m "feat: add gala Illustrator portfolio builder"
```

### Task 2: 在 Adobe Illustrator 中生成 AI 文件

**Files:**
- Execute: `scripts/illustrator/build-gala-portfolio.jsx`
- Create: `/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集.ai`
- Create: `/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集-preview.png`
- Create: `/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集-preflight.txt`

**Interfaces:**
- Consumes: Task 1 的 JSX 脚本和五张源图。
- Produces: 可打开的 Illustrator 文件、PNG 预览和预检文本。

- [ ] **Step 1: 通过 Illustrator 执行构建脚本**

Run:

```bash
osascript -e 'tell application "Adobe Illustrator" to activate' \
  -e 'tell application "Adobe Illustrator" to do javascript file POSIX file "/Users/ttao/Documents/Codex/2026-07-11/new-chat/outputs/portfolio-v4-source-shwung/scripts/illustrator/build-gala-portfolio.jsx"'
```

Expected: Illustrator 打开新文档并保存三个输出文件，无脚本错误对话框。

- [ ] **Step 2: 验证输出文件存在且非空**

Run:

```bash
test -s '/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集.ai'
test -s '/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集-preview.png'
test -s '/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集-preflight.txt'
```

Expected: 三条命令均以状态 0 结束。

- [ ] **Step 3: 验证预检报告**

Run:

```bash
rg -n '^artboards=10$|^layers=5$|^placed_images=5$|^missing_images=0$|^document_color_space=RGB$' \
  '/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集-preflight.txt'
```

Expected: 五项全部匹配。

### Task 3: 视觉检查与最终交付

**Files:**
- Inspect: `/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集.ai`
- Inspect: `/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集-preview.png`

**Interfaces:**
- Consumes: Task 2 的最终文件。
- Produces: 通过视觉和结构检查的用户交付物。

- [ ] **Step 1: 检查 PNG 预览尺寸和颜色模式**

Run:

```bash
sips -g pixelWidth -g pixelHeight -g space \
  '/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集-preview.png'
```

Expected: 图片可读取、宽度大于 1000 px、颜色空间为 RGB 或 sRGB。

- [ ] **Step 2: 打开预览并逐画板检查**

检查项目：封面无裁切错误；文字不溢出；五张图片均未拉伸；挑战、概念、视觉系统和图注完整；深酒红转场与暖白编辑版式关系和 HTML 原型一致。

Expected: 无空白画板、重叠文字、缺图、明显失真或不可读的小字。

- [ ] **Step 3: 在 Illustrator 中重新打开最终 AI 文件**

Run:

```bash
open -a 'Adobe Illustrator' '/Users/ttao/Documents/作品集/FRIDAY-2026-年会作品集.ai'
```

Expected: 文件正常打开，显示 10 个画板和 5 个命名图层。

- [ ] **Step 4: 完成最终文件状态检查**

Run:

```bash
git status --short
git diff --check
```

Expected: 仅 `.superpowers/` 和用户已有 `HANDOFF.md` 保持未跟踪；仓库内无未提交的构建脚本改动，`git diff --check` 无输出。
