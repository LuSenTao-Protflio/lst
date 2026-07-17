# WHELK Physical Applications Integration

## Objective

Add five supplied WHELK photographs to the existing project detail page without creating a detached gallery. The new material should strengthen the existing narrative by showing how the identity system moves from graphic rules into physical objects.

## Design read

This is a preserve-mode update to a designer portfolio for recruiters. Keep the existing editorial grid, off-white site background, sharp image edges, large whitespace, and restrained scroll reveal.

- Design variance: 7
- Motion intensity: 4
- Visual density: 3

## Asset treatment

The five source PNG files will be copied into a dedicated WHELK asset directory and converted to web-friendly JPEG files. Source aspect ratios and photographic color will be preserved. Images will not receive decorative captions, rounded cards, overlays, or additional effects.

## Narrative placement

1. Keep the current hero and opening concept pages unchanged.
2. After the logo construction material, place the wash label and rug mockup as an asymmetric pair. This connects the logo system to textile production.
3. After the Pop Shop and fabric signage material, place the long printed fabric bag as a narrow portrait interruption.
4. Within the product application sequence, place the yellow shell charm as a single photographic emphasis.
5. Use the stacked mug photograph as the final large application image. Its warm scene closes the project with a clear real-world brand moment.

## Layout behavior

- Desktop: alternate full-width landscape pages, asymmetric portrait pairs, and single portrait emphasis images.
- Mobile: collapse every multi-column group to one column while preserving the narrative order.
- Use the existing Motion reveal behavior and reduced-motion fallback.
- Do not add a new section heading solely for these photographs.

## Implementation boundary

The change should be specific to WHELK so the other projects using `EditorialProjectDetail` keep their current layouts. WHELK can provide a small placement map that the component uses to interleave new assets with the existing project images.

## Verification

- An automated test confirms all five WHELK asset names are referenced by project data or the WHELK placement map.
- Existing tests remain green.
- Production build succeeds.
- Desktop and 390px mobile browser checks show no horizontal overflow.
- The final browser review confirms the five photographs appear in the approved narrative order.
