# Mobile Entry Touch Preview and Navigation Refinement

## Goal

Refine two phone-only interactions before publication:

1. Improve the typography and alignment inside the bright yellow portfolio navigation.
2. Add a touch-following project thumbnail to the entry page.

The changes apply only at `max-width: 599px`. Tablet and desktop output must remain unchanged.

## Design Direction

This remains a recruiter-facing visual-design portfolio with a dark editorial base, acid-yellow accent, experimental typography, and purposeful motion.

- Design variance: 8
- Motion intensity: 7
- Visual density: 3
- Mode: redesign-preserve

No route, content, project order, image selection, color token, font, or desktop interaction changes.

## Phone Navigation

The portfolio navigation becomes a stable three-column composition:

- Left: `Lusen Tao`
- Center: `WORK` and `INFO`
- Right: language control

At phone widths:

- all labels stay on one line;
- `WORK` and `INFO` use matching weight and spacing;
- brand, links, and language control are vertically centered;
- each interactive control retains at least a 44px touch height;
- the full navigation remains inside a 320px viewport without clipping;
- the existing bright-yellow glass appearance is preserved.

Tablet and desktop navigation CSS is not changed.

## Entry Touch Preview

The entry project list keeps its existing desktop fine-pointer hover behavior. On phones only, it gains a dedicated touch interaction:

1. A touch begins inside the project list.
2. The row beneath the finger becomes active.
3. One shared 16:10 thumbnail appears diagonally above the finger.
4. The thumbnail follows the finger through transform-based motion.
5. Entering another project row crossfades to that project's hero image.
6. Moving outside the project rows or entering `misc` hides the thumbnail.
7. Releasing or cancelling the touch fades the thumbnail out.

The entry rows remain static previews and do not navigate to project detail pages. The existing `进入作品集` control remains the route-changing action.

## Interaction Architecture

`HoverProjectReveal` owns the interaction:

- fine pointers retain the current mouse proximity behavior;
- phone coarse pointers use pointer capture during the gesture;
- Motion values hold continuous `x` and `y` coordinates so pointer movement does not rerender the React tree;
- React state changes only when the active project index changes;
- one shared mobile preview element renders the current image;
- position is clamped to the viewport so the thumbnail cannot cross the left, right, top, or bottom edge.

No scroll listener or new dependency is added.

## Motion and Accessibility

- Preview movement uses only `transform`.
- Preview appearance and image changes use opacity and scale.
- The preview is decorative and remains hidden from assistive technology.
- With reduced motion, position updates remain direct and image changes become immediate or near-immediate.
- Touch handling is limited to the entry list and must not change desktop hover, keyboard behavior, or other pages.

## Verification

Automated contracts must verify:

- the mobile navigation uses the three-column layout inside the phone media block;
- phone touch targets remain at least 44px;
- the mobile preview is rendered once, not once per project;
- touch pointer handlers and cleanup exist;
- continuous coordinates use Motion values rather than React state;
- the feature is gated to phone coarse pointers;
- `misc` has no preview;
- desktop hover markup and behavior remain present.

Browser checks must cover:

- 320x700 and 390x844 phone viewports;
- navigation text alignment and absence of overflow;
- touch-following position;
- image switching across at least three adjacent rows;
- release-to-hide behavior;
- `misc` hide behavior;
- unchanged desktop hover at 1440x900;
- unchanged tablet layout at 768x1024.
