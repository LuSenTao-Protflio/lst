# Project Summary and Portrait Blend Design

## Goal

Simplify project-folder labels, limit homepage project galleries to three images, and blend the portrait naturally into the shared Hero–Info background.

## Folder Label

- Remove the `PROJECT NN / 项目 NN —` prefix from every inline folder front.
- Keep only the localized project title followed by the existing `OPEN ↗` action.
- Preserve the project number in the main project summary; only the folder-front duplicate is removed.

## Homepage Image Limit

- Render only `project.images.slice(0, 3)` in each homepage project grid.
- Keep every source image in project data and detail pages unchanged.
- Preserve the existing three-column desktop grid and responsive behavior.

## Portrait and Page Gradient

- Replace the current edge-to-edge meeting of the photo fade and page fade with an overlapping blend.
- Raise the portrait's internal charcoal fade so it covers approximately the lower 35% of the photo with a soft multi-stop transition.
- Move the shared Hero–Info scene fade upward so it overlaps the portrait fade by approximately `60–80px`.
- Hold charcoal briefly after the portrait's darkest area, then transition gradually into the cream Directory background.
- Remove the visible dark horizontal band at the portrait's lower edge.
- Keep the portrait itself above the shared scene fade while matching both gradients to `var(--deep)`.

## Verification

- Folder fronts contain no `PROJECT NN` or `项目 NN` prefix.
- Every homepage project grid renders at most three images.
- Project detail pages still receive the complete image arrays.
- The photo and shared background gradients overlap without a hard line.
- Production build succeeds and the portfolio and representative project detail routes remain reachable.
