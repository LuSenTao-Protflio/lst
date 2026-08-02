# SmallRig「焦点计划」Selected Works 短案例 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成可插入 Selected Works 的 3 画板 SmallRig「焦点计划」可编辑 AI 模块、PNG 预览和预检报告。

**Architecture:** 先将 Canva 代表页 PDF 渲染为本地 JPG 素材，再使用独立 ExtendScript 构建 RGB Illustrator 文档、连续画板和命名图层。源页面全部按 `contain` 完整置入，摄影取景、焦点坐标、红色定位点和简化 IP 角色使用 Illustrator 原生矢量绘制。

**Tech Stack:** Adobe Illustrator 2026、ExtendScript/JSX、Poppler `pdftoppm`、AppleScript `osascript`、macOS `sips`

## Global Constraints

- 输出 AI：`/Users/ttao/Documents/作品集/SmallRig-焦点计划-SelectedWorks短案例.ai`。
- 3 个 1440 × 900 px RGB 画板；5 个命名图层。
- 素材来自 `/Users/ttao/Downloads/斯莫格.pdf` 的无水印代表页面。
- 所有图片使用 `contain`，不得拉伸或破坏性裁切。
- 个人职责固定为“负责活动概念、视觉系统、活动 IP、内容传播与周边应用设计”。
- 不使用付费波浪装饰页，不增加活动结果、参与人数和传播数据。
- `.superpowers/` 与 `HANDOFF.md` 不提交。

---

### Task 1: 准备代表页素材

**Files:**
- Create: `assets/selected-works/smallrig-focus/page-01-cover.jpg`
- Create: `assets/selected-works/smallrig-focus/page-02-logo.jpg`
- Create: `assets/selected-works/smallrig-focus/page-04-color.jpg`
- Create: `assets/selected-works/smallrig-focus/page-06-photo-system.jpg`
- Create: `assets/selected-works/smallrig-focus/page-07-photo-application.jpg`
- Create: `assets/selected-works/smallrig-focus/page-10-keychain.jpg`
- Create: `assets/selected-works/smallrig-focus/page-11-ip-keychain.jpg`
- Create: `assets/selected-works/smallrig-focus/page-12-umbrella.jpg`

**Interfaces:**
- Consumes: `/Users/ttao/Downloads/斯莫格.pdf`。
- Produces: 8 张 16:9 JPG，供 Illustrator 构建器稳定链接。

- [ ] **Step 1: 验证 PDF 元数据与页面数**

```bash
pdfinfo '/Users/ttao/Downloads/斯莫格.pdf' | rg 'Pages|Page size'
```

Expected: `Pages: 14`，页面尺寸为 `1440 x 810 pts`。

- [ ] **Step 2: 渲染并复制指定页面**

```bash
pdftoppm -jpeg -r 110 '/Users/ttao/Downloads/斯莫格.pdf' tmp/pdfs/smallrig/page
```

将渲染页 01、02、04、06、07、10、11、12 复制并按文件清单重命名。页面 03 不进入交付素材。

- [ ] **Step 3: 验证尺寸与水印**

```bash
for image in assets/selected-works/smallrig-focus/*.jpg; do
  sips -g pixelWidth -g pixelHeight "$image" 2>/dev/null
done
```

Expected: 8 张图片均为同一 16:9 比例；人工检查无 Canva 水印。

### Task 2: 创建 Illustrator 构建器

**Files:**
- Create: `scripts/illustrator/build-smallrig-focus-selected-works.jsx`

**Interfaces:**
- Consumes: Task 1 的 8 张 JPG。
- Produces: `addAreaText()`、`placeImageContain()`、`addFocusMark()`、`addIpCharacter()`、`writePreflight()`。

- [ ] **Step 1: 创建文档、画板与命名图层**

画板固定为：

```javascript
var boards = [
  { name: "01-STRATEGY", height: 900 },
  { name: "02-VISUAL-IP", height: 900 },
  { name: "03-CAMPAIGN-APPLICATION", height: 900 }
];
```

图层固定为 `00-GUIDES`、`01-TYPE`、`02-GRAPHICS`、`03-IMAGES`、`04-ANNOTATIONS`。

- [ ] **Step 2: 构建项目概览画板**

完整展示封面页；增加背景、挑战、职责和核心策略，配合取景框四角、对焦十字和红色定位点。

- [ ] **Step 3: 构建视觉系统与活动 IP 画板**

完整展示 Logo 页与色彩页；绘制简化可编辑三脚架 IP 角色，说明品牌基因、活动标志、角色家族和品牌红焦点。

- [ ] **Step 4: 构建内容传播与落地画板**

以 6 张代表页组成错位网格，全部 `contain`；用“摄影内容 / 主打周边 / IP 衍生 / 参与触点”标签组织信息。

- [ ] **Step 5: 语法与完整展示约束检查**

```bash
sed '1d' scripts/illustrator/build-smallrig-focus-selected-works.jsx | node --check
rg -n 'placeImage[^\n]+cover' scripts/illustrator/build-smallrig-focus-selected-works.jsx
```

Expected: 语法通过，第二条命令无输出。

- [ ] **Step 6: 提交构建器与素材**

```bash
git add assets/selected-works/smallrig-focus scripts/illustrator/build-smallrig-focus-selected-works.jsx
git commit -m "feat: add SmallRig Focus Selected Works builder"
```

### Task 3: 生成并验证交付文件

**Files:**
- Create: `/Users/ttao/Documents/作品集/SmallRig-焦点计划-SelectedWorks短案例.ai`
- Create: `/Users/ttao/Documents/作品集/SmallRig-焦点计划-SelectedWorks短案例-preview.png`
- Create: `/Users/ttao/Documents/作品集/SmallRig-焦点计划-SelectedWorks短案例-preflight.txt`

**Interfaces:**
- Consumes: Task 2 的 JSX。
- Produces: 可编辑 AI、长图预览和结构预检。

- [ ] **Step 1: 通过 Illustrator 执行脚本**

```bash
osascript -e 'tell application "Adobe Illustrator" to activate' \
  -e 'tell application "Adobe Illustrator" to do javascript file POSIX file "/Users/ttao/Documents/Codex/2026-07-11/new-chat/outputs/portfolio-v4-source-shwung/scripts/illustrator/build-smallrig-focus-selected-works.jsx"'
```

- [ ] **Step 2: 验证结构**

预检必须包含 `artboards=3`、`layers=5`、`placed_images=8`、`missing_images=0`、`fit_mode=contain_only`、`paid_wave_asset_used=0`；Illustrator 检查 `contain_violations=0`、`overset=0`。

- [ ] **Step 3: 视觉检查**

确认所有源页面完整、无水印，摄影语境小元素不遮挡图片，画板 3 的六图网格仍可辨识。

- [ ] **Step 4: 最终构建与仓库检查**

```bash
npm run build
git diff --check
git status --short
```

Expected: 生产构建通过，只保留既有未跟踪文件。
