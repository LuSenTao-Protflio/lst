# Seamless Entry Transition Design

## Goal

Make the transition from the independent entry page to `/portfolio` feel like the portfolio hero is taking over the screen, without the current pause or detached interstitial feeling.

## Approved Direction

Use a fast bottom-to-top takeover that recreates the portfolio Hero's visual background rather than showing a flat interstitial. A blurred glass treatment softens the preview while the entry text appears, making the destination feel present beneath the transition.

## Motion

- Total transition target: approximately 0.65 seconds.
- Reveal the Hero-derived background upward from the bottom using a transform-based wipe.
- Bring in the Chinese title `进入作品集` quickly during the wipe with a restrained character float.
- Show `ENTER PORTFOLIO` only as a subtle supporting detail; it must not add a separate pause.
- Navigate immediately when the short timeline completes; remove the current empty hold at the end.
- Keep the existing shared click/wheel trigger lock.
- Preserve the existing immediate-navigation behavior for users who prefer reduced motion.

## Visual Continuity

- The transition background must reuse the same charcoal surface and ray treatment as the portfolio Hero rather than a screenshot, so it remains responsive at every viewport size.
- Add a glass layer with approximately `20px` backdrop blur, mild saturation, and a subtle charcoal tint.
- Overlay text uses the existing acid-yellow accent.
- Keep the Hero-derived background visible through route navigation; no fade to white or transparent gap is allowed.
- The blur may reduce slightly near the end of the transition, but must not create a separate hold or exit phase.

## Verification

- Both click and downward-wheel entry trigger the same transition once.
- The production build succeeds.
- `/` and `/portfolio` remain reachable from the local preview.
- Source inspection confirms the timeline has no trailing hold and uses a transform-based overlay reveal.
- Source inspection confirms the transition contains the Hero ray treatment and glass blur layer.
