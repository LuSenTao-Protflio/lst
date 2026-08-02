# 南头古城 AR 导航 Selected Works 短案例 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成一份可直接插入 Selected Works 的 3 画板南头古城 AR 导航可编辑 AI 模块、PNG 预览和预检报告。

**Architecture:** 使用独立 ExtendScript 构建 RGB Illustrator 文档、3 个连续画板和 5 个命名图层。三张现有图片统一以 `contain` 方式完整置入，路线、节点、箭头、分类标签与用户路径使用原生可编辑矢量绘制。

**Tech Stack:** Adobe Illustrator 2026、ExtendScript/JSX、AppleScript `osascript`、macOS `sips`

## Global Constraints

- 输出 AI：`/Users/ttao/Documents/作品集/南头古城-古城漫游AR导航-SelectedWorks短案例.ai`。
- 3 个 1440 × 900 px RGB 画板；5 个命名图层。
- 图片素材固定为 `4.jpg`、`5.jpg` 和 `assets/portfolio-pages/48.jpg`。
- 所有图片使用 `contain`，不得拉伸或破坏性裁切。
- 个人职责固定为“负责视觉概念、路线识别系统、AR 界面与场景应用设计”。
- 不增加项目效果、调研人数和运营数据。
- `.superpowers/` 与 `HANDOFF.md` 不提交。

---

### Task 1: 创建 Illustrator 构建器

**Files:**
- Create: `scripts/illustrator/build-nantou-ar-selected-works.jsx`

**Interfaces:**
- Consumes: `/Users/ttao/Downloads/woof项目/4.jpg`、`5.jpg` 和 `assets/portfolio-pages/48.jpg`。
- Produces: `addBoard()`、`addAreaText()`、`placeImage()`、`addRoute()`、`addNode()`、`addArrow()`、`writePreflight()`。

- [ ] **Step 1: 验证三张素材存在与尺寸**

```bash
for image in '/Users/ttao/Downloads/woof项目/4.jpg' '/Users/ttao/Downloads/woof项目/5.jpg' assets/portfolio-pages/48.jpg; do
  test -f "$image" || exit 1
  sips -g pixelWidth -g pixelHeight "$image" 2>/dev/null
done
```

Expected: `4.jpg` 与 `5.jpg` 为 2000 × 1414，`48.jpg` 为 2880 × 1620。

- [ ] **Step 2: 创建文档、画板、图层和辅助函数**

画板固定为：

```javascript
var boards = [
  { name: "01-CONTEXT", height: 900 },
  { name: "02-ROUTE-SYSTEM", height: 900 },
  { name: "03-AR-JOURNEY", height: 900 }
];
```

图层固定为 `00-GUIDES`、`01-TYPE`、`02-GRAPHICS`、`03-IMAGES`、`04-ANNOTATIONS`。

- [ ] **Step 3: 构建背景与项目概览**

左侧放项目背景、挑战、职责与核心叙事，右侧完整显示 `5.jpg`；青蓝、黄色和珊瑚红路线从页边进入信息区，但不覆盖图片。

- [ ] **Step 4: 构建路线语言与视觉规则**

完整显示 `4.jpg`，增加“树根地图”、颜色分类、路线、节点、店铺入口四个说明；使用独立可编辑路线和圆形节点呼应原方案。

- [ ] **Step 5: 构建 AR 用户路径与落地**

完整显示 `48.jpg`，增加“分类 → 定位 → AR 导航 → 到达”的四步路径，并说明灯箱、桌牌与移动界面的线上线下连续性。

- [ ] **Step 6: 语法与完整展示约束检查**

```bash
sed '1d' scripts/illustrator/build-nantou-ar-selected-works.jsx | node --check
rg -n 'placeImage\([^\n]+"cover"' scripts/illustrator/build-nantou-ar-selected-works.jsx
```

Expected: 语法通过，第二条命令无输出。

- [ ] **Step 7: 提交构建器**

```bash
git add scripts/illustrator/build-nantou-ar-selected-works.jsx
git commit -m "feat: add Nantou AR Selected Works builder"
```

### Task 2: 生成并验证交付文件

**Files:**
- Create: `/Users/ttao/Documents/作品集/南头古城-古城漫游AR导航-SelectedWorks短案例.ai`
- Create: `/Users/ttao/Documents/作品集/南头古城-古城漫游AR导航-SelectedWorks短案例-preview.png`
- Create: `/Users/ttao/Documents/作品集/南头古城-古城漫游AR导航-SelectedWorks短案例-preflight.txt`

**Interfaces:**
- Consumes: Task 1 的 JSX。
- Produces: 可编辑 AI、长图预览和结构预检。

- [ ] **Step 1: 通过 Illustrator 执行脚本**

```bash
osascript -e 'tell application "Adobe Illustrator" to activate' \
  -e 'tell application "Adobe Illustrator" to do javascript file POSIX file "/Users/ttao/Documents/Codex/2026-07-11/new-chat/outputs/portfolio-v4-source-shwung/scripts/illustrator/build-nantou-ar-selected-works.jsx"'
```

- [ ] **Step 2: 验证结构**

预检必须包含 `artboards=3`、`layers=5`、`placed_images=3`、`missing_images=0` 和 `fit_mode=contain_only`；Illustrator 检查 `containViolations=0`、`overset=0`。

- [ ] **Step 3: 视觉检查**

确认三张素材完整、背景与概念可读、四步用户路径明确、路线小元素不遮挡原图。

- [ ] **Step 4: 最终构建与仓库检查**

```bash
npm run build
git diff --check
git status --short
```

Expected: 生产构建通过，只保留既有未跟踪文件。
