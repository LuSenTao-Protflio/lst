# 全站鼠标点击圆环设计规范

## 目标

将用户提供的 Originkit `rings` 点击反馈加入作品集所有页面，同时避免引入 GSAP 和 TypeScript 依赖。

## 视觉参数

- 颜色：`#E6FF1A`
- 初始效果尺寸：80px
- 初始描边：3px
- 动画：从 0.5 倍放大到 2 倍，描边逐渐变细并淡出
- 动画时长：约 300ms
- 不显示说明文字

## 交互

- 在 `document` 级监听 `pointerdown`，仅响应主鼠标键或单点触控。
- 点击链接、按钮或其他交互元素时仍正常出现圆环，但覆盖层使用 `pointer-events:none`，不阻挡原始操作。
- 使用 `clientX/clientY` 和 fixed 覆盖层定位，页面滚动不会导致圆环错位。
- 每个圆环动画结束后从状态中移除，不长期保留 DOM 节点。

## 实现

- 创建 `src/components/ClickRings.jsx`。
- 在 `App.jsx` 的 `BrowserRouter` 内、`Routes` 外挂载一次，使首页、七个项目页和微信页面全部生效。
- 使用 CSS keyframes 实现动画，不新增依赖。
- 覆盖层使用固定定位、100% 视口尺寸和高层级，但不影响现有导航与点击。

## 无障碍与性能

- `prefers-reduced-motion: reduce` 时不渲染点击圆环。
- 每个效果只保留约 350ms。
- 圆环标记为 `aria-hidden="true"`。
- 不修改现有自定义悬停光标。

## 验证

- 首页、WOOF-WOOF、MetaKeys 和普通编辑式项目页点击后均产生圆环。
- 点击项目链接后导航仍正常。
- 连续点击后圆环会按时清理。
- 页面无横向溢出，生产构建通过。
