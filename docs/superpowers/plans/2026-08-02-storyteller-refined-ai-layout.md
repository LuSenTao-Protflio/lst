# 有请讲书人 Illustrator 精修版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新建一份素材完整展示、配色更丰富、版式元素更精致的“有请讲书人”可编辑 AI 文件。

**Architecture:** 从已验证的初版 JSX 派生独立精修构建器，保留 10 画板和 5 图层结构。所有图片统一通过 `contain` 置入，另用可编辑矢量流线、阶梯、圆点、色条、框线和标签增强版式。

**Tech Stack:** Adobe Illustrator 2026、ExtendScript/JSX、AppleScript `osascript`、macOS `sips`

## Global Constraints

- 新文件固定为 `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集-精修版.ai`。
- 不覆盖上一版 AI、预览和预检文件。
- 10 个 RGB 画板，宽度 1440 px；5 个既有命名图层。
- 所有图片只使用 `contain`，禁止破坏性裁切与拉伸。
- 装饰元素必须可编辑，并避开主要图片与正文。
- 保留 `.superpowers/` 与 `HANDOFF.md` 的未跟踪状态。

---

### Task 1: 创建精修版 Illustrator 构建器

**Files:**
- Create: `scripts/illustrator/build-storyteller-portfolio-refined.jsx`

**Interfaces:**
- Consumes: `有请讲书人2025横版主kv.png` 与 `assets/portfolio-pages/38.jpg` 至 `43.jpg`。
- Produces: `addFlowLines()`、`addStageSteps()`、`addDotCluster()`、`addMicroLabel()` 与 10 个精修画板。

- [ ] **Step 1: 派生独立输出路径并保留初版构建器不变**

精修构建器只写入带 `-精修版` 后缀的 AI、PNG、预检与日志文件。

- [ ] **Step 2: 将全部 `placeImage` 调用统一为 `contain`**

Expected: 脚本中的图片置入调用不出现 `"cover"`。

- [ ] **Step 3: 增加可编辑装饰函数并应用到 10 个画板**

实现流线、阶梯、圆点群、页码、颜色样本、图片细框和微型标签；每个函数创建命名对象并置于图形或标注层。

- [ ] **Step 4: 检查语法与约束**

Run:

```bash
sed '1d' scripts/illustrator/build-storyteller-portfolio-refined.jsx | node --check
rg -n 'placeImage\([^\n]+"cover"' scripts/illustrator/build-storyteller-portfolio-refined.jsx
```

Expected: 语法通过，第二条命令无输出。

- [ ] **Step 5: 提交构建器**

```bash
git add scripts/illustrator/build-storyteller-portfolio-refined.jsx
git commit -m "feat: add refined Storyteller Illustrator builder"
```

### Task 2: 生成并验证新 AI

**Files:**
- Create: `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集-精修版.ai`
- Create: `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集-精修版-preview.png`
- Create: `/Users/ttao/Documents/作品集/有请讲书人-读书月活动视觉-作品集-精修版-preflight.txt`

**Interfaces:**
- Consumes: Task 1 的 JSX。
- Produces: 可编辑 AI、长图预览和预检数据。

- [ ] **Step 1: 通过 Illustrator 执行精修构建器**

```bash
osascript -e 'tell application "Adobe Illustrator" to activate' \
  -e 'tell application "Adobe Illustrator" to do javascript file POSIX file "/Users/ttao/Documents/Codex/2026-07-11/new-chat/outputs/portfolio-v4-source-shwung/scripts/illustrator/build-storyteller-portfolio-refined.jsx"'
```

- [ ] **Step 2: 验证文件结构**

预检必须包含 `artboards=10`、`layers=5`、`missing_images=0`、`fit_mode=contain_only`，Illustrator 文字溢出必须为 0。

- [ ] **Step 3: 检查长图预览**

确认全部素材四边完整可见，色彩与装饰元素没有遮挡正文或图片，10 个画板无空白。

- [ ] **Step 4: 运行生产构建与 Git 检查**

```bash
npm run build
git diff --check
git status --short
```

Expected: 构建通过，仅保留既有未跟踪文件。
