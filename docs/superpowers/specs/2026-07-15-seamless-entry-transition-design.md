# Seamless Entry Transition Design

## Goal

Make the transition from the independent entry page to `/portfolio` feel like the portfolio hero is taking over the screen, without the current pause or detached interstitial feeling.

## Approved Direction

Use a fast bottom-to-top takeover in the same neutral charcoal as the portfolio hero (`var(--deep)`). The overlay remains fully opaque through navigation, so the destination hero appears as a continuation of the same surface rather than a new page.

## Motion

- Total transition target: approximately 0.65 seconds.
- Reveal the charcoal overlay upward from the bottom using a transform-based wipe.
- Bring in the Chinese title `进入作品集` quickly during the wipe with a restrained character float.
- Show `ENTER PORTFOLIO` only as a subtle supporting detail; it must not add a separate pause.
- Navigate immediately when the short timeline completes; remove the current empty hold at the end.
- Keep the existing shared click/wheel trigger lock.
- Preserve the existing immediate-navigation behavior for users who prefer reduced motion.

## Visual Continuity

- Overlay background must use the exact portfolio hero background token, `var(--deep)`.
- Overlay text uses the existing acid-yellow accent.
- No fade to white, transparent gap, or exit animation is added between overlay completion and route navigation.

## Verification

- Both click and downward-wheel entry trigger the same transition once.
- The production build succeeds.
- `/` and `/portfolio` remain reachable from the local preview.
- Source inspection confirms the timeline has no trailing hold and uses a transform-based overlay reveal.
