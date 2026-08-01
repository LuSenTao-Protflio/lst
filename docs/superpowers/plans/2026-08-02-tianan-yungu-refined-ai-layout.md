# 天安云谷（日常）读书节 Illustrator 精修版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新建一份素材完整、场景元素准确、版式更具冲击力的天安云谷读书节可编辑 AI 文件。

**Architecture:** 从已验证的天安云谷 JSX 派生独立精修构建器，保留 10 画板和 5 图层。图片统一使用 `contain`，并通过 Illustrator 原生路径绘制书页、交换箭头、咖啡杯、书籍、蔬菜、植物和日历刻度。

**Tech Stack:** Adobe Illustrator 2026、ExtendScript/JSX、AppleScript `osascript`、macOS `sips`

## Global Constraints

- 输出固定为 `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集-精修版.ai`。
- 不覆盖上一版 AI、预览和预检文件。
- 10 个 RGB 画板，宽 1440 px；5 个既有命名图层。
- 所有图片使用 `contain`，不得拉伸或裁切。
- 四类交换符号必须齐全且为可编辑矢量。
- 装饰元素数量不少于 150，且不遮挡主图与正文。
- `.superpowers/` 与 `HANDOFF.md` 不提交。

---

### Task 1: 创建场景化精修构建器

**Files:**
- Create: `scripts/illustrator/build-tianan-yungu-portfolio-refined.jsx`

**Interfaces:**
- Consumes: 原天安云谷七张素材与初版构建器。
- Produces: `addBookPage()`、`addExchangeArrow()`、`addCoffeeIcon()`、`addBookIcon()`、`addVegetableIcon()`、`addPlantIcon()`、`addCalendarTicks()`。

- [ ] **Step 1: 派生独立输出路径**

构建器只写入带 `-精修版` 后缀的 AI、PNG、预检和日志文件。

- [ ] **Step 2: 将所有图片置入统一为 `contain`**

日历、人物内容和适配素材只展示完整版本，不生成重复裁切局部。

- [ ] **Step 3: 绘制四类交换符号与场景元素**

使用路径、矩形、椭圆和线段建立咖啡杯、书籍、蔬菜、植物、书页、双向箭头和日历刻度，并以 `B01-` 至 `B10-` 命名。

- [ ] **Step 4: 加强 10 个画板的非对称版式**

使用跨栏黄色、粉蓝绿错位卡片、大编号、黑色标签、彩色边框和阶段色条增强冲击力，装饰保持在图形层。

- [ ] **Step 5: 检查脚本**

```bash
sed '1d' scripts/illustrator/build-tianan-yungu-portfolio-refined.jsx | node --check
rg -n 'placeImage\([^\n]+"cover"' scripts/illustrator/build-tianan-yungu-portfolio-refined.jsx
rg -n 'addCoffeeIcon|addBookIcon|addVegetableIcon|addPlantIcon' scripts/illustrator/build-tianan-yungu-portfolio-refined.jsx
```

Expected: 语法通过、无 `cover` 调用、四个函数全部匹配。

- [ ] **Step 6: 提交构建器**

```bash
git add scripts/illustrator/build-tianan-yungu-portfolio-refined.jsx
git commit -m "feat: add refined Tianan Yungu Illustrator builder"
```

### Task 2: 生成并验证精修 AI

**Files:**
- Create: `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集-精修版.ai`
- Create: `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集-精修版-preview.png`
- Create: `/Users/ttao/Documents/作品集/天安云谷-日常读书节-作品集-精修版-preflight.txt`

**Interfaces:**
- Consumes: Task 1 的 JSX。
- Produces: 新 AI、长图预览和结构预检。

- [ ] **Step 1: 在 Illustrator 执行构建器**

```bash
osascript -e 'tell application "Adobe Illustrator" to activate' \
  -e 'tell application "Adobe Illustrator" to do javascript file POSIX file "/Users/ttao/Documents/Codex/2026-07-11/new-chat/outputs/portfolio-v4-source-shwung/scripts/illustrator/build-tianan-yungu-portfolio-refined.jsx"'
```

- [ ] **Step 2: 验证结构与完整展示**

预检包含 `artboards=10`、`layers=5`、`missing_images=0`、`fit_mode=contain_only`、`scene_icons=4`；Illustrator 检查 `containViolations=0` 和 `overset=0`。

- [ ] **Step 3: 视觉检查**

逐画板确认素材四边可见，咖、书、蔬、植符号与对应阶段匹配，装饰没有遮挡文字和图片。

- [ ] **Step 4: 最终构建与仓库检查**

```bash
npm run build
git diff --check
git status --short
```

Expected: 生产构建通过，只保留既有未跟踪文件。
