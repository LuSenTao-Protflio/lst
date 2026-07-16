# Entry Fixed Side Preview Design

## Objective

Replace the entry page's free-following project image with a fixed right-side preview that never covers project names and displays each horizontal hero image in full.

## Layout

- Keep the centered, tightly stacked seven-project word wall.
- On desktop, give the project area a text zone and a reserved preview zone to its right.
- Keep the text composition optically centered while shifting it only enough to create safe preview space.
- The preview aligns near the active project row and remains inside the reserved right-side zone.
- The preview does not follow the pointer horizontally or vertically.

## Preview behavior

- No preview frame is visible before a project is hovered or keyboard-focused.
- Hovering or focusing a project fades its corresponding image card into the right-side zone.
- Switching projects reuses the same card position with a short opacity and vertical-motion transition.
- Pointer leave and focus loss hide the card.
- The preview does not intercept pointer input.

## Image presentation

- Use a horizontal frame close to `16:10`.
- Use `object-fit: contain` so the entire image remains visible without cropping or stretching.
- Fill unused image area with the existing warm-white background.
- Add a subtle neutral border, 12–16 px corner radius, and a soft tinted shadow.
- Keep the card visually subordinate to the project names.

## Responsive and accessibility

- Hide the preview below the existing tablet/mobile breakpoint while preserving every project link.
- Keep keyboard-focus activation and visible focus treatment.
- Respect reduced-motion preferences by hiding nonessential preview motion.

## Boundaries

- Do not change project names, order, links, entry title, cursor, site palette, main portfolio, or project detail pages.
- Add no dependency or visual asset.

## Verification

- Confirm pointer-position motion values and the pointer-move handler are removed from the project preview.
- Confirm preview images use `object-fit: contain`.
- Confirm the preview has rounded corners, a border, and a shadow.
- Run `git diff --check` and the production Vite build.
