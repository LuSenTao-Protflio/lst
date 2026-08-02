# 「数字榫卯，重构木艺基因」Selected Works 独立案例 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成可插入“其他视觉实践 / Selected Works”的 6 画板可编辑 Illustrator 案例、连续 PNG 预览和结构预检报告，完整呈现传统木艺科普、桌面端 UI、Arduino 联动与实体交互原型。

**Architecture:** 先从已授权的 Canva 项目导出无水印 PDF，并将代表页渲染为稳定的本地 JPG 素材；随后使用独立 ExtendScript 构建 RGB Illustrator 文档、连续画板、命名图层和原生矢量注释。所有原始页面统一按 `contain` 完整置入，以榫卯结构线、木雕纹样、暖金反馈节点和数字信号流串联“文化问题—交互流程—界面系统—实体反馈—最终原型”的叙事。

**Tech Stack:** Adobe Illustrator 2026、ExtendScript/JSX、Canva、Poppler `pdfinfo` / `pdftoppm`、AppleScript `osascript`、macOS `sips`

## Global Constraints

- 输出 AI：`/Users/ttao/Documents/作品集/大神龛-数字榫卯交互装置-SelectedWorks独立案例.ai`。
- 输出预览：`/Users/ttao/Documents/作品集/大神龛-数字榫卯交互装置-SelectedWorks独立案例-preview.png`。
- 输出预检：`/Users/ttao/Documents/作品集/大神龛-数字榫卯交互装置-SelectedWorks独立案例-preflight.txt`。
- 6 个 1440 × 900 px RGB 画板；5 个命名图层。
- 项目归入“其他视觉实践 / Selected Works”，不加入主项目数组。
- 所有源页面使用 `contain`，不得拉伸、破坏性裁切或遮挡关键信息。
- 视觉色彩固定为深木棕、炭黑、暖金、象牙白；装饰元素必须来自榫卯、木雕、灯光反馈和数字信号语义。
- 项目职责固定为“负责项目策划、资料研究、信息架构、交互流程、UI 视觉、Arduino 程序与实体原型设计”。
- 核心叙事固定为“把木雕知识从静态观看转化为可操作、可反馈、可感知的数字体验，让传统木艺通过界面、灯光与实体装置重新被理解”。
- 交互闭环固定为“选择内容 → 浏览知识 → 触发交互 → 装置反馈 → 建立理解”。
- 不虚构调研人数、测试数据、参展成绩、传播数据或技术规格。
- 不绕过 Canva 付费权限；不得使用带水印素材。若无水印导出不可用，停止素材导出并报告阻塞。
- `.superpowers/` 与 `HANDOFF.md` 不提交。

---

### Task 1: 导出并整理无水印代表页素材

**Files:**
- Create: `/Users/ttao/Downloads/大神龛-数字榫卯-Canva导出.pdf`
- Create: `assets/selected-works/digital-mortise/page-01-cover.jpg`
- Create: `assets/selected-works/digital-mortise/page-04-research.jpg`
- Create: `assets/selected-works/digital-mortise/page-05-user-task.jpg`
- Create: `assets/selected-works/digital-mortise/page-07-wireframe.jpg`
- Create: `assets/selected-works/digital-mortise/page-09-arduino.jpg`
- Create: `assets/selected-works/digital-mortise/page-10-ui-overview.jpg`
- Create: `assets/selected-works/digital-mortise/page-11-ui-flow.jpg`
- Create: `assets/selected-works/digital-mortise/page-14-ui-states.jpg`
- Create: `assets/selected-works/digital-mortise/page-15-device-system.jpg`
- Create: `assets/selected-works/digital-mortise/page-16-lighting.jpg`
- Create: `assets/selected-works/digital-mortise/page-17-prototype.jpg`

**Interfaces:**
- Consumes: Canva 项目 `https://www.canva.cn/design/DAGiFr2PUWI/pleeE5zyfrpbmH-UuMYHNg/edit`。
- Produces: 1 份无水印 PDF 与 11 张代表页 JPG，供 Illustrator 构建器稳定链接。

- [ ] **Step 1: 在 Canva 中确认页面与导出权限**

打开 18 页项目，核对页面 01、04、05、07、09、10、11、14、15、16、17 的内容与缩略图。使用 Canva 正常“导出 / 下载”流程选择 PDF；若界面只允许带水印草稿或要求绕过付费内容，则停止本任务并记录具体阻塞，不下载带水印版本。

- [ ] **Step 2: 下载并固定 PDF 文件名**

将无水印 PDF 保存为：

```text
/Users/ttao/Downloads/大神龛-数字榫卯-Canva导出.pdf
```

不得覆盖其他 Canva 项目的下载文件。

- [ ] **Step 3: 验证 PDF 元数据与页面数**

```bash
pdfinfo '/Users/ttao/Downloads/大神龛-数字榫卯-Canva导出.pdf' | rg 'Pages|Page size'
```

Expected: `Pages: 18`；页面比例一致。若导出页数不是 18，先返回 Canva 修正导出范围。

- [ ] **Step 4: 渲染全部页面并挑选代表页**

```bash
mkdir -p tmp/pdfs/digital-mortise assets/selected-works/digital-mortise
pdftoppm -jpeg -r 110 '/Users/ttao/Downloads/大神龛-数字榫卯-Canva导出.pdf' tmp/pdfs/digital-mortise/page
```

将渲染页 01、04、05、07、09、10、11、14、15、16、17 复制并按文件清单重命名。若导出后页序与 Canva 缩略图不一致，以实际画面内容为准调整映射，但保持目标文件名与内容语义一致。

- [ ] **Step 5: 验证尺寸、内容与水印**

```bash
for image in assets/selected-works/digital-mortise/*.jpg; do
  sips -g pixelWidth -g pixelHeight "$image" 2>/dev/null
done
```

Expected: 11 张图片比例一致、图像可读、无 Canva 水印；人工逐张确认没有截断原页面内容。

### Task 2: 创建 6 画板 Illustrator 构建器

**Files:**
- Create: `scripts/illustrator/build-digital-mortise-interactive-selected-works.jsx`

**Interfaces:**
- Consumes: Task 1 的 11 张 JPG。
- Produces: `addAreaText()`、`placeImageContain()`、`addJointLine()`、`addNode()`、`addSignalFlow()`、`writePreflight()`。

- [ ] **Step 1: 创建文档、画板与命名图层**

画板固定为：

```javascript
var boards = [
  { name: "01-OVERVIEW", height: 900 },
  { name: "02-CONTEXT", height: 900 },
  { name: "03-IA-FLOW", height: 900 },
  { name: "04-UI-SYSTEM", height: 900 },
  { name: "05-DIGITAL-PHYSICAL", height: 900 },
  { name: "06-PROTOTYPE", height: 900 }
];
```

图层固定为 `00-GUIDES`、`01-TYPE`、`02-GRAPHICS`、`03-IMAGES`、`04-ANNOTATIONS`。文档使用 RGB；画板横向连续排列，每张 1440 × 900 px。

- [ ] **Step 2: 实现共用绘制与预检函数**

实现以下接口并保持命名一致：

```javascript
function addAreaText(layer, contents, bounds, style) {}
function placeImageContain(layer, filePath, bounds, label) {}
function addJointLine(layer, points, style) {}
function addNode(layer, x, y, radius, style) {}
function addSignalFlow(layer, points, labels, style) {}
function writePreflight(doc, reportPath, stats) {}
```

`placeImageContain()` 必须按宽高比缩放并完整置入边界；禁止 `cover` 分支、负裁切路径或非等比缩放。`writePreflight()` 必须记录画板数、图层数、置入图片数、缺失图片数、contain 违规、溢出文本、色彩模式和付费素材使用数。

- [ ] **Step 3: 构建画板 01「项目概览」**

完整展示 `page-01-cover.jpg`，配合项目定位、职责、核心叙事与三个能力标签。使用深木棕大底、象牙白文字、暖金节点和一组不遮挡封面的榫卯结构线，建立传统工艺与数字交互的双重语气。

- [ ] **Step 4: 构建画板 02「文化背景 / 设计问题」**

使用 `page-04-research.jpg` 与 `page-05-user-task.jpg` 形成一主一次的完整画面组合。文案只归纳“传统木雕知识理解门槛”“静态展陈缺乏参与感”“工艺结构难以被直观感知”三个问题，不添加未经来源支持的数值。

- [ ] **Step 5: 构建画板 03「信息架构 / 交互流程」**

使用 `page-07-wireframe.jpg` 与 `page-11-ui-flow.jpg`。用 `addSignalFlow()` 绘制“选择内容 → 浏览知识 → 触发交互 → 装置反馈 → 建立理解”五段闭环；用编号节点和榫卯卡扣式连线标示界面层级、用户操作与反馈关系。

- [ ] **Step 6: 构建画板 04「UI 视觉系统」**

以 `page-10-ui-overview.jpg` 为主图，`page-14-ui-states.jpg` 为辅助图。提炼字体层级、木色体系、卡片状态、信息提示和交互反馈，不重画或裁切源 UI；辅助图保持足够尺寸，保证界面状态可辨识。

- [ ] **Step 7: 构建画板 05「数字界面 × Arduino × 实体装置」**

使用 `page-09-arduino.jpg`、`page-11-ui-flow.jpg` 与 `page-15-device-system.jpg`，分成“界面输入 / 程序转换 / 灯光与实体反馈”三段。信号流从左至右，Arduino 页作为技术证据完整展示，装置系统页作为结果主图，不标注未验证的硬件型号或性能参数。

- [ ] **Step 8: 构建画板 06「最终原型 / 项目结论」**

使用 `page-15-device-system.jpg`、`page-16-lighting.jpg` 与 `page-17-prototype.jpg` 组成完整可读的成果网格。重点呈现实物形态、灯光反馈和制作过程；结论文案回扣“通过可操作、可反馈、可感知的体验重新理解传统木艺”，不虚构展览结果。

- [ ] **Step 9: 语法与完整展示约束检查**

```bash
sed '1d' scripts/illustrator/build-digital-mortise-interactive-selected-works.jsx | node --check
rg -n 'Math\.max|mode === "cover"|fitCover|clipping *= *true' scripts/illustrator/build-digital-mortise-interactive-selected-works.jsx
```

Expected: 语法通过，第二条命令无输出。

- [ ] **Step 10: 提交素材与构建器**

```bash
git add assets/selected-works/digital-mortise scripts/illustrator/build-digital-mortise-interactive-selected-works.jsx
git commit -m "feat: add digital mortise interactive Selected Works builder"
```

### Task 3: 生成并验证交付文件

**Files:**
- Create: `/Users/ttao/Documents/作品集/大神龛-数字榫卯交互装置-SelectedWorks独立案例.ai`
- Create: `/Users/ttao/Documents/作品集/大神龛-数字榫卯交互装置-SelectedWorks独立案例-preview.png`
- Create: `/Users/ttao/Documents/作品集/大神龛-数字榫卯交互装置-SelectedWorks独立案例-preflight.txt`

**Interfaces:**
- Consumes: Task 2 的 JSX 与 11 张代表页素材。
- Produces: 可编辑 AI、6 画板连续预览和结构预检。

- [ ] **Step 1: 通过 Illustrator 执行脚本**

```bash
osascript -e 'tell application "Adobe Illustrator" to activate' \
  -e 'tell application "Adobe Illustrator" to do javascript file POSIX file "/Users/ttao/Documents/Codex/2026-07-11/new-chat/outputs/portfolio-v4-source-shwung/scripts/illustrator/build-digital-mortise-interactive-selected-works.jsx"'
```

- [ ] **Step 2: 验证预检结构**

```bash
rg 'artboards=6|layers=5|placed_images=11|missing_images=0|contain_violations=0|overset=0|fit_mode=contain_only|paid_asset_used=0|color_mode=RGB' '/Users/ttao/Documents/作品集/大神龛-数字榫卯交互装置-SelectedWorks独立案例-preflight.txt'
```

Expected: 九项指标全部出现且数值匹配；任一项缺失或不匹配都先修复 JSX，再重新生成交付文件。

- [ ] **Step 3: 检查输出文件存在且非空**

```bash
ls -lh \
  '/Users/ttao/Documents/作品集/大神龛-数字榫卯交互装置-SelectedWorks独立案例.ai' \
  '/Users/ttao/Documents/作品集/大神龛-数字榫卯交互装置-SelectedWorks独立案例-preview.png' \
  '/Users/ttao/Documents/作品集/大神龛-数字榫卯交互装置-SelectedWorks独立案例-preflight.txt'
```

Expected: 三个文件均存在且大小大于 0。

- [ ] **Step 4: 视觉检查连续预览**

检查 6 张画板：所有源页面完整可见；文字无溢出；小元素不遮挡图片；深木棕、炭黑、暖金、象牙白贯穿全案；榫卯线、木雕纹样、灯光节点和信号流均符合所在场景；画板 05 的数字—实体链路一眼可读；画板 06 的实物和制作图片尺寸足够。

- [ ] **Step 5: 最终构建与仓库检查**

```bash
npm run build
git diff --check
git status --short
```

Expected: 生产构建通过、无空白错误；仓库只保留既有未跟踪的 `.superpowers/` 与 `HANDOFF.md`，以及已按任务提交的计划、素材和构建器。
