# Mobile and Tablet Responsive Design

## Goal

Adapt the existing portfolio for 390px phones, 768px portrait tablets, and 1024px landscape tablets without redesigning the desktop visual language or changing project content.

## Current Audit

- The entry page, hero, and detail pages have no horizontal overflow at 390px, 768px, or 1024px.
- At 390px, each homepage project is approximately 1267px tall and the full page is approximately 12,721px tall.
- At 768px, the project summary becomes one column, the folder moves below the text, and the third image wraps to a second row. Each project remains approximately 1053px tall.
- At 390px and 768px, the information section is one column and the portrait remains 260px wide and left-aligned, leaving unused space.
- Deep links such as `/portfolio#work` place the first project too low in the viewport and can expose content from the preceding section.
- At 1024px, the desktop-style project layout remains usable and should be preserved.
- WOOF, MetaKeys, and editorial detail pages already collapse without horizontal overflow.

## Breakpoints

The implementation will use three explicit responsive bands:

- Phone: `max-width: 599px`
- Portrait tablet: `600px` through `899px`
- Landscape tablet and compact desktop: `900px` through `1100px`
- Existing desktop layout: above `1100px`

Existing `500px`, `800px`, and `900px` rules may be consolidated or overridden only where necessary. Desktop selectors must remain unchanged unless a shared rule prevents responsive behavior.

## Entry Page

- Preserve the existing olive glass visual, navigation, project list, and enter control.
- Maintain a single-screen layout on a 390×844 viewport.
- Keep project preview images disabled on touch-sized layouts.
- Keep all seven project names visible without horizontal overflow.
- Reduce only vertical gaps and type size when needed; do not remove projects or navigation.
- Use `100dvh`/`100svh`-safe sizing rather than fixed pixel heights.

## Main Hero and Navigation

- Preserve the current full-viewport hero and experimental type composition.
- The glass navigation remains one row at all target widths.
- Maintain at least 12px outer spacing on phones and a minimum 44px touch target for navigation controls.
- Phone hero typography uses fluid sizes and balanced line wrapping; tablet typography retains more of the desktop scale.
- Hero metadata remains single-column on phones and portrait tablets, but spacing is reduced so it appears within or immediately after the first viewport.

## Information Section

### Phone

- Use one column.
- Center the portrait and size it to `min(100%, 320px)`.
- Stack each information label above its value.
- Reduce the excessive bottom padding while keeping the dark-to-cream transition intact.

### Portrait Tablet

- Restore a two-column layout: approximately 220–240px portrait plus a flexible information column.
- Use a 28–36px gap.
- Keep labels and values in their existing two-column row structure when space permits.

### Landscape Tablet

- Preserve the existing 300px portrait plus flexible information column.

## Directory

- Preserve the current Projects heading, highlighter treatment, and dark row hover.
- Hide tag pills on phones and portrait tablets.
- Keep project number and title readable without overlap.
- Disable hover-only title scaling on coarse pointers while preserving focus-visible feedback.
- Apply section `scroll-margin-top` so navigation lands below the fixed glass navigation.

## Homepage Project Sections

### Phone

- Keep the project copy above the folder.
- Reduce the folder to approximately 240–270px wide and 175–190px tall.
- Present the three images as an editorial `1 + 2` grid:
  - First image spans the full row.
  - Second and third images share the next row.
- Keep all three images visible without horizontal scrolling.
- Reduce project vertical padding while maintaining clear separation between projects.

### Portrait Tablet

- Use a two-column summary: flexible copy plus a 230–260px folder.
- Keep all three preview images on one row.
- Reduce the summary minimum height and vertical padding.

### Landscape Tablet

- Preserve the current desktop summary and three-column image grid.
- Slightly reduce gaps only when needed to prevent compression.

### Interaction

- The entire project block remains one semantic link.
- Folder animation remains available for hover and keyboard focus.
- Touch devices must not depend on hover to reveal essential information.
- Image shadows and warm paper texture remain unchanged.

## Detail Pages

- Preserve existing content order and project-specific components.
- Keep the taskbar fixed with a 48px minimum height on phones.
- Use shortened back/order labels on phones and ellipsis for long project titles.
- Keep WOOF, MetaKeys, and editorial layouts single-column below 800px.
- Reduce text and image gaps where they cause excessive scrolling, but do not crop project images.
- Previous/next project navigation becomes one column on phones and two columns on tablets.
- Footer content stacks on phones and remains readable on tablets.

## Scroll and Viewport Behavior

- Add `scroll-margin-top` to `#info`, `#directory`, `#work`, individual `.project` anchors, and `#contact` as applicable.
- `ScrollManager` continues to use `scrollIntoView`, with CSS providing the fixed-navigation offset.
- Avoid fixed heights on content sections.
- Use `min-height: 100dvh` with a `100svh` fallback for mobile Safari stability.

## Accessibility

- Preserve keyboard navigation and visible focus rings.
- Touch targets must be at least 44px where practical.
- Do not hide content required to understand or enter a project.
- Respect `prefers-reduced-motion`.
- Custom cursor effects remain disabled for coarse pointers.

## Verification

Verify these viewports:

- 390×844
- 768×1024
- 1024×768
- Existing desktop viewport at or above 1280px

Verify these routes:

- `/`
- `/portfolio`
- `/portfolio#info`
- `/portfolio#directory`
- `/portfolio#work`
- `/project/whelk`
- `/project/woof`
- `/project/metakeys`
- `/project/misc`

Acceptance criteria:

- No horizontal overflow.
- Navigation does not overlap section headings or project copy.
- Phone project previews use the approved `1 + 2` grid.
- Portrait tablet summaries use two columns and preview images remain on one row.
- The information portrait is centered on phones and paired with text on tablets.
- Deep links land at the intended section with a clear navigation offset.
- Production build and `git diff --check` pass.
