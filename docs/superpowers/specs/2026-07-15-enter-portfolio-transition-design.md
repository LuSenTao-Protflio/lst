# Enter Portfolio GSAP Transition Design

## Objective

Add a full-screen typographic transition between the standalone entry page and `/portfolio`. The transition is triggered by either the entry button or the existing downward-wheel gesture.

## Trigger and navigation flow

1. The user clicks the entry button or performs the qualifying downward-wheel gesture.
2. Navigation is delayed and the entry page enters a locked `transitioning` state.
3. A full-screen overlay covers the entry page.
4. The Chinese title `进入作品集` animates character by character with the supplied ScrollFloat visual language.
5. The English subtitle `ENTER PORTFOLIO` fades into place beneath it.
6. After approximately 1.2 seconds, React Router navigates to `/portfolio`.

Repeated clicks and wheel gestures are ignored while the transition is active. Browser Back continues to return to the standalone entry route.

## Motion treatment

- Split `进入作品集` into individual character spans.
- Animate from opacity `0`, `yPercent: 120`, `scaleY: 2.3`, and `scaleX: 0.7` to the neutral state.
- Use staggered character timing close to `0.05` seconds.
- Use a controlled back-style ease without excessive bounce.
- Fade the overlay in quickly before the characters resolve.
- Animate only transforms and opacity.

## Visual design

- Use the existing neutral deep-gray background and acid-yellow foreground.
- Centre the transition title in the viewport at display scale.
- Keep the English subtitle small, tracked, and secondary.
- The overlay sits above the global page content and navigation but below the custom cursor layer.

## Implementation

- Add `gsap` as a project dependency.
- Create `src/components/EntryTransition.jsx` for overlay markup, character splitting, GSAP timeline creation, cleanup, and completion callback.
- `Entry.jsx` owns the `transitioning` state and performs route navigation only after the transition completes.
- `InteractiveCover` keeps one `onEnter` interface; both button and wheel call the same guarded handler.
- Do not register or use `ScrollTrigger`, because the animation is event-triggered rather than controlled by scroll progress.

## Accessibility and reduced motion

- The overlay carries an accessible `aria-label` for the transition message.
- Decorative per-character spans are hidden from assistive technology.
- When reduced motion is requested, skip the overlay timeline and navigate immediately.
- Lock repeated triggers without trapping keyboard focus.

## Verification

- Confirm click and wheel both call the same entry handler.
- Confirm navigation occurs from the transition completion callback rather than immediately.
- Confirm no `ScrollTrigger` import or registration is added.
- Confirm GSAP timeline cleanup runs on unmount.
- Run `git diff --check` and the production Vite build.
