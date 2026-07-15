# Entry Navigation and Plasma Background Design

## Goal

Upgrade the independent entry page with a wide glass navigation bar and a restrained interactive Plasma background while preserving the portfolio's cream, charcoal, and acid-yellow visual system.

## Entry Navigation

- Replace the existing three-part metadata row with a wide rounded glass navigation bar inspired by the supplied reference.
- Left brand: `LUSEN TAO`.
- Right navigation: `WORK`, `INFO`, and a white filled `联系我` action.
- `WORK` enters the portfolio and lands on `/portfolio#work`.
- `INFO` enters the portfolio and lands on `/portfolio#info`.
- `联系我` enters the portfolio and lands on `/portfolio#contact`.
- All three actions use the existing entry transition before navigation.
- Add `id="contact"` to the shared portfolio footer so the final action has a stable destination.
- On mobile, retain all four labels, reduce spacing and control size, and allow the center links to remain readable without wrapping.

## Plasma Background

- Create a focused `Plasma` component from the supplied OGL/WebGL shader code.
- Place it as a full-screen decorative layer behind all entry content.
- Use the portfolio acid yellow `#e6ff1a` with `speed={0.45}`, `scale={1.15}`, and `opacity={0.2}`.
- Keep subtle pointer interaction on desktop.
- Disable pointer interaction on narrow screens and for reduced-motion users.
- For reduced motion, do not run the animated shader; show a static acid-yellow radial glow instead.
- Add a translucent cream veil above the shader so titles and project names retain contrast.
- The Plasma background is exclusive to the independent entry route and must not affect `/portfolio` or project pages.

## Layout Adjustment

- Keep the centered bilingual title in its current visual position.
- Move the project-name reveal block downward by approximately `5vh`.
- Preserve the existing project hover previews and bottom enter button.
- The navigation and all interactive content stay above the Plasma and veil layers.

## Hero-to-Info Continuity

- Remove the abrupt charcoal-to-cream boundary between the portfolio Hero and the Info section.
- Keep the upper and content-bearing area of Info on the same `var(--deep)` charcoal as the Hero.
- Concentrate the transition back to `var(--bg)` in the lower tail of the Info section so all text remains on a reliably dark surface.
- Use acid yellow for Info row labels and warm off-white at approximately 82% opacity for row values.
- Use subtle translucent white dividers between Info rows.
- Replace the photo's cream fade with a charcoal fade so the portrait integrates into the continuous dark area.
- The following Directory section remains on the existing cream background.

## Navigation Data Flow

- Extend the entry trigger from `onEnter()` to `onEnter(destination)`.
- Store the requested destination in the route-level Entry component before starting the transition.
- When the transition completes, navigate to the stored destination.
- The existing bottom enter button and downward wheel gesture continue to use `/portfolio` without an anchor.
- The existing trigger lock prevents competing destinations after the first accepted action.

## Verification

- WORK, INFO, and 联系我 resolve to their intended anchors after the entry transition.
- Button and wheel entry still resolve to `/portfolio`.
- The footer exposes `id="contact"`.
- Plasma sits behind the entry content and uses the supplied acid-yellow settings.
- Reduced-motion logic avoids running the animated Plasma.
- Hero and Info read as one continuous dark composition, while Info labels, values, dividers, and the photo fade remain legible.
- Production build succeeds and `/`, `/portfolio`, and `/portfolio#contact` remain reachable.
