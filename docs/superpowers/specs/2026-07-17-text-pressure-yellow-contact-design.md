# TextPressure and Yellow Contact Glass Design

## Purpose

Make the prelude's `PORTFOLIO` word reproduce the supplied TextPressure interaction and make the portrait contact control visually consistent with the portfolio's acid-yellow glass language.

## Prelude interaction

- Keep the title as one oversized acid-yellow `PORTFOLIO` word.
- Replace the current pointer-prop interaction with a TextPressure-style global pointer listener and animation-frame loop. The loop eases the rendered cursor toward the real cursor and updates every glyph each frame.
- Use flex spacing plus width, weight, and alpha response. A nearby glyph becomes wider, heavier, and opaque; a distant glyph is narrow, light, and partially transparent.
- Do not use the italic axis. Use Roboto Flex's supported width range (25–151) and weight range (100–900), and keep the existing reduced-motion static fallback.

## Portrait contact glass

- Keep the same avatar, name, discipline, and contact link.
- Change every layer from blue to acid-yellow translucent frosted glass.
- Constrain the panel to 76% of the portrait width, center it horizontally, and use a 999px border radius for a compact pill silhouette.
- Preserve readable dark typography and a clear contact affordance; keep the reduced-transparency fallback opaque olive-yellow.

## Verification

- Add tests for alpha and non-italic title behavior, and keep the existing single-title and navigation tests.
- Run `pnpm test`, `VITE_BASE_PATH=/lst/ pnpm vite build`, `git diff --check`, and visually verify the hover state on the local preview.
