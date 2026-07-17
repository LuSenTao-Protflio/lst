# Single Portfolio Pressure Title Design

## Purpose

Make the prelude cover's sole visual focal point a single, oversized `PORTFOLIO` title. Its letterforms should react smoothly to the cursor anywhere on the cover, matching the supplied TextPressure reference more closely than the current pointer-event-only implementation.

## Visual behavior

- The title contains only `PORTFOLIO`, in uppercase, centered in the prelude.
- Its responsive size targets approximately 90% of the usable viewport width while retaining a small horizontal safety margin on narrow screens.
- The existing deep olive frosted-glass cover, acid-yellow title color, LightRays background, and top three-column metadata grid remain unchanged.
- On desktop, cursor movement anywhere within the cover continuously influences each glyph. A smoothed cursor position makes nearby letters broader, heavier, and slightly italic; distant letters return to their narrow, light resting state.
- The calculation runs on an animation frame loop while the prelude is mounted. It initializes at the title center so the title has a composed resting state before pointer input.
- When `prefers-reduced-motion` is enabled, the title remains static at its resting variable-font axes. On touch devices, no cursor-specific interaction is required.

## Component design

- Replace the current multi-line event-driven `KineticPortfolioTitle` behavior with a TextPressure-style component implementation.
- The component owns title sizing, smoothed pointer coordinates, character references, and per-character variable-font updates.
- `Prelude` passes the single title string and owns navigation only. It attaches the cursor-position listener to the full prelude surface so motion outside the glyphs still drives the effect.
- The title component remains self-contained and imports the locally installed Roboto Flex variable font; it does not fetch a remote font at runtime.

## Layout and fallback

- The title container is a centered, wide horizontal zone and is sized independently from the metadata and enter arrow.
- It uses one line on desktop and scales down without wrapping on smaller viewports.
- The static fallback preserves the acid-yellow color and title legibility without variable-axis transitions.

## Verification

- Unit tests cover the distance-to-axis calculation for near and far glyphs, plus the single-title input expected by the prelude.
- Run `pnpm test`, `VITE_BASE_PATH=/lst/ pnpm vite build`, and `git diff --check` before handoff.
