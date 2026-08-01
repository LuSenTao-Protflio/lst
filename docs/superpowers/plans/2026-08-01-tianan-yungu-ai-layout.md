# 天安云谷（日常）读书节 Illustrator 长页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一份可编辑的天安云谷（日常）读书节作品集 AI 文件、HTML 参考、PNG 预览和预检报告。

**Architecture:** 使用一个 ExtendScript 脚本创建 RGB Illustrator 文档、10 个连续画板和 5 个命名图层，置入现有读书节图片并绘制可编辑文字与图形；独立 HTML 文件使用同一套内容和尺寸参数。脚本保存 AI、导出逐画板 PNG，再由 macOS 工具合成长图预览并写出预检报告。

**Tech Stack:** Adobe Illustrator 2026、ExtendScript/JSX、AppleScript `osascript`、HTML/CSS、macOS `sips`

## Global Constraints

- 输出文件：`/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集.ai`
- 画板宽度：1440 px；RGB 模式；10 个命名画板。
- 图层固定为 `00-GUIDES`、`01-TYPE`、`02-GRAPHICS`、`03-IMAGES`、`04-ANNOTATIONS`。
- 个人职责固定为“主要负责视觉设计与落地执行”。
- 只使用现有素材可证明的 42 天、四阶段和日期信息，不增加活动成效数据。
- 不覆盖 `/Users/ttao/Downloads/作品集/` 中任何源文件。
- `.superpowers/` 和未跟踪的 `HANDOFF.md` 不加入提交。

---

## File Structure

- Create: `scripts/illustrator/build-tianan-yungu-portfolio.jsx` — 创建 AI 文档、画板、图层、排版和预检报告。
- Create: `scripts/illustrator/tianan-yungu-reference.html` — 与 AI 一致的浏览器排版参考。
- Create: `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集.ai` — 最终可编辑源文件。
- Create: `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集-preview.png` — 低分辨率长图预览。
- Create: `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集-preflight.txt` — 结构预检报告。
- Create: `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集参考.html` — 用户可独立打开的 HTML 参考。

### Task 1: 创建 Illustrator 与 HTML 构建文件

**Files:**
- Create: `scripts/illustrator/build-tianan-yungu-portfolio.jsx`
- Create: `scripts/illustrator/tianan-yungu-reference.html`

**Interfaces:**
- Consumes: `/Users/ttao/Downloads/作品集/主视觉.png`、`云谷制作-09.jpg`、`云谷制作_画板 1 副本 8.jpg` 至 `12.jpg`、`/Users/ttao/Downloads/卢森涛｜品牌视觉设计作品集｜优化版/11.png`。
- Produces: `addArtboard(name, height)`、`addText(layer, name, text, x, y, width, fontSize, color, leading)`、`placeCover(layer, name, path, rect)`、`addRect(layer, name, rect, color)`、`writePreflight(path)`。

- [ ] **Step 1: 验证源素材存在并记录尺寸**

Run:

```bash
for image in \
  '/Users/ttao/Downloads/作品集/主视觉.png' \
  '/Users/ttao/Downloads/作品集/云谷制作-09.jpg' \
  '/Users/ttao/Downloads/作品集/云谷制作_画板 1 副本 8.jpg' \
  '/Users/ttao/Downloads/作品集/云谷制作_画板 1 副本 10.jpg' \
  '/Users/ttao/Downloads/作品集/云谷制作_画板 1 副本 11.jpg' \
  '/Users/ttao/Downloads/作品集/云谷制作_画板 1 副本 12.jpg' \
  '/Users/ttao/Downloads/卢森涛｜品牌视觉设计作品集｜优化版/11.png'; do
  test -f "$image" || exit 1
  sips -g pixelWidth -g pixelHeight "$image" 2>/dev/null
done
```

Expected: 七张素材全部存在且宽高均大于 900 px。

- [ ] **Step 2: 编写固定画板、图层和辅助函数**

脚本创建以下画板：

```javascript
var boards = [
  { name: "01-COVER", height: 810 },
  { name: "02-CONTEXT", height: 900 },
  { name: "03-MECHANISM", height: 860 },
  { name: "04-CONCEPT", height: 900 },
  { name: "05-SYSTEM", height: 820 },
  { name: "06-FOUR-EXCHANGES", height: 900 },
  { name: "07-CALENDAR", height: 960 },
  { name: "08-ADAPTATION", height: 900 },
  { name: "09-CONTENT", height: 900 },
  { name: "10-GUIDE", height: 760 }
];
```

Expected: 每个画板宽 1440 px、间隔 80 px，五个图层和全部辅助函数均集中定义一次。

- [ ] **Step 3: 构建封面、背景、机制、概念和视觉系统**

实现：

```text
01-COVER：主视觉满版、项目编号、标题、英文名和职责。
02-CONTEXT：暖白双栏、42 天、2025.06.20–07.31、四阶段、职责。
03-MECHANISM：以书换咖 / 书 / 蔬 / 植四张卡片及日期。
04-CONCEPT：黄色转场、核心句、打开书本与手势图形。
05-SYSTEM：开放书页、行动手势、主题色彩三张卡片。
```

Expected: 文案与设计规格一致，无虚构数据；文字对象均位于 `01-TYPE`。

- [ ] **Step 4: 构建四主题、日历、适配、内容传播和指南**

实现：

```text
06-FOUR-EXCHANGES：优化版 11.png 与四主题说明。
07-CALENDAR：云谷制作_画板 1 副本 12.jpg，完整显示日历主体。
08-ADAPTATION：横版主视觉、竖版 KV 和独立图形。
09-CONTENT：云谷制作_画板 1 副本 11.jpg 与人物传播说明。
10-GUIDE：总结、1440 px 画板、72/48 px 边距和字号表。
```

Expected: 图片等比置入或裁切，无拉伸；每组图片有 12–13 px 图注。

- [ ] **Step 5: 编写 HTML 参考**

HTML 使用内嵌 CSS 和相同章节顺序，图片引用绝对 `file://` 路径，顶部明确标注 1440 px 画板和字号规则。

Expected: `rg -n '42 天|四阶段|主要负责视觉设计与落地执行|AI BUILD GUIDE' scripts/illustrator/tianan-yungu-reference.html` 四项均匹配。

- [ ] **Step 6: 检查占位符与基础语法**

Run:

```bash
rg -n 'TBD|TODO|undefined|placeholder|稍后补充' \
  scripts/illustrator/build-tianan-yungu-portfolio.jsx \
  scripts/illustrator/tianan-yungu-reference.html
```

Expected: 无输出。

- [ ] **Step 7: 提交构建文件**

```bash
git add scripts/illustrator/build-tianan-yungu-portfolio.jsx scripts/illustrator/tianan-yungu-reference.html
git commit -m "feat: add Tianan Yungu Illustrator portfolio builder"
```

### Task 2: 在 Adobe Illustrator 中生成交付文件

**Files:**
- Execute: `scripts/illustrator/build-tianan-yungu-portfolio.jsx`
- Create: `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集.ai`
- Create: `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集-preview.png`
- Create: `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集-preflight.txt`
- Create: `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集参考.html`

**Interfaces:**
- Consumes: Task 1 的 JSX 和 HTML 文件。
- Produces: 可编辑 AI、PNG 预览、预检文本和独立 HTML。

- [ ] **Step 1: 复制 HTML 参考到交付目录**

Run:

```bash
cp scripts/illustrator/tianan-yungu-reference.html '/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集参考.html'
```

Expected: 目标 HTML 存在且非空。

- [ ] **Step 2: 通过 Illustrator 执行脚本**

Run:

```bash
osascript -e 'tell application "Adobe Illustrator" to activate' \
  -e 'tell application "Adobe Illustrator" to do javascript file POSIX file "/Users/ttao/Documents/Codex/2026-07-11/new-chat/outputs/portfolio-v4-source-shwung/scripts/illustrator/build-tianan-yungu-portfolio.jsx"'
```

Expected: Illustrator 保存 AI、PNG 预览和预检报告，无错误对话框。

- [ ] **Step 3: 验证输出文件与预检报告**

Run:

```bash
test -s '/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集.ai'
test -s '/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集-preview.png'
test -s '/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集-preflight.txt'
rg -n '^artboards=10$|^layers=5$|^missing_images=0$|^document_color_space=RGB$' \
  '/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集-preflight.txt'
```

Expected: 三个文件非空，预检四项全部匹配。

### Task 3: 视觉检查与交付

**Files:**
- Inspect: `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集.ai`
- Inspect: `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集-preview.png`

**Interfaces:**
- Consumes: Task 2 的交付文件。
- Produces: 通过结构和视觉检查的最终文件。

- [ ] **Step 1: 检查预览尺寸和色彩空间**

Run:

```bash
sips -g pixelWidth -g pixelHeight -g space \
  '/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集-preview.png'
```

Expected: 宽度大于 1000 px，颜色空间为 RGB 或 sRGB。

- [ ] **Step 2: 逐画板视觉检查**

检查封面、背景、四阶段、概念、视觉系统、四主题、日历、尺寸适配、作者传播和排版指南；确认无空白画板、缺图、图片拉伸、明显文字重叠或错误裁切。

Expected: 10 个画板全部包含可读内容，黄色系统与暖白编辑版式形成清晰节奏。

- [ ] **Step 3: 重新打开 AI 并检查图层**

Run:

```bash
open -a 'Adobe Illustrator' '/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集.ai'
```

Expected: AI 正常打开，显示 10 个画板和 5 个命名图层。

- [ ] **Step 4: 最终仓库检查**

Run:

```bash
git status --short
git diff --check
```

Expected: 构建脚本已提交；`.superpowers/` 和既有 `HANDOFF.md` 未加入提交；无未提交的功能性修改。
