# Entry Project Word Wall and Cursor Calibration Design

## Objective

Refine the standalone portfolio entry page so its project directory reads as a centered, tightly stacked typographic word wall, and remove the perceived gap between the physical pointer and the custom yellow cursor.

## Project word wall

- Keep the existing seven project names and detail-page destinations.
- Remove project numbers, category labels, row dividers, and the duplicated vertical title-flip animation.
- Center every project name within one vertical column.
- Use a heavy `800` weight and a responsive display size of approximately 28–42 px on desktop.
- Reduce vertical distance so the titles read as one composed block rather than a table.
- Render inactive titles in a soft neutral gray.
- On hover or keyboard focus, render the active title in the main deep gray and fade the remaining titles further.
- Keep the floating project image at the previously reduced scale and position it near the right side of the text without covering the active title.
- On touch devices and for reduced-motion users, omit the floating preview while preserving all project links.

## Cursor calibration

- The custom yellow arrow follows the raw pointer motion values without a spring.
- Adjust the SVG geometry so the visible arrow tip begins at the pointer hotspot `(0,0)`.
- Retain a small spring delay on the `卢森涛` label only, preserving personality without compromising pointing accuracy.
- Retain press feedback, visibility behavior, and reduced-motion behavior.
- Apply the calibrated cursor consistently across the entry page, portfolio page, and project pages.

## Boundaries

- Do not change project order, titles, images, routes, entry-page title, site palette, or detail-page content.
- Add no dependency or new visual asset.
- Continue using React, Framer Motion, the existing language context, and vanilla CSS.

## Verification

- Confirm project-row markup contains only one visible project title per link.
- Confirm no index or category markup remains in the entry directory.
- Confirm the cursor arrow uses raw `x` and `y` motion values.
- Confirm the cursor SVG tip begins at `(0,0)`.
- Confirm keyboard focus still activates the project state.
- Run `git diff --check` and the production Vite build.
