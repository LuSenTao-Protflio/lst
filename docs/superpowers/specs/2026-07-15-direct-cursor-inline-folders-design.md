# Direct Cursor and Inline Project Folders Design

## Goal

Remove perceived cursor lag and replace the long scroll-driven folder chapters with compact, right-aligned folder previews embedded in each project summary.

## Direct Cursor Tracking

- Keep the existing acid-yellow arrow and `卢森涛` label appearance.
- Move the arrow with a direct native `pointermove` DOM transform using `translate3d(clientX, clientY, 0)` so the arrow tip follows the pointer without a spring or Framer Motion scheduling delay.
- Move the label from the same native event with a fixed visual offset from the arrow.
- Remove label position springs and velocity-based rotation.
- Preserve visibility handling, fine-pointer detection, and the click-scale response.
- Keep the native cursor hidden only while the custom cursor is active.

## Inline Folder Placement

- Place one compact folder at the right edge of every project summary row.
- The left side keeps the existing project number, tags, title, English title, and description.
- The folder is visually subordinate when closed and must not enlarge the summary row excessively.
- Hovering or keyboard-focusing anywhere in the project summary opens the folder once; no scroll progress controls any part of the animation.
- The folder itself links to `/project/:id`.

## Folder Motion

- Closed state: flap closed, all three cards inside the folder with `opacity: 0` and reduced scale.
- Open state: flap rotates back and the three cards fan upward into three distinct positions.
- Each card animates from `opacity: 0` to `opacity: 1`; final opacity must be exactly `1` for all three cards.
- Leaving the summary reverses the same motion: cards fade, scale down, return to the folder, and the flap closes.
- Use short CSS/Framer transitions without scroll listeners, sticky positioning, or viewport-length spacer sections.
- Reduced-motion users receive the same open/closed states with near-instant transitions.

## Mobile Interaction

- On devices without hover, tapping the project summary opens its folder preview.
- Tapping the folder link enters the project detail.
- Opening another project closes the previous preview.
- The folder moves below the summary text on narrow screens if the horizontal layout cannot remain readable.

## Removal Scope

- Remove the existing `200vh` project folder sections from the project loop.
- Remove `useScroll`, `useTransform`, sticky folder layout, scroll cue, and scroll-specific responsive rules.
- Keep the existing project image grids and project detail routes unchanged.

## Verification

- Cursor arrow and label positions are updated directly from native pointer coordinates.
- No cursor position springs or velocity rotation remain.
- Seven project summaries each contain one inline folder.
- Hover/focus opens all three cards to opacity `1`; leaving reverses the animation.
- No `useScroll`, sticky folder section, `200vh`, or scroll cue remains in the folder implementation.
- Production build succeeds and the entry, portfolio, and project detail routes remain reachable.
