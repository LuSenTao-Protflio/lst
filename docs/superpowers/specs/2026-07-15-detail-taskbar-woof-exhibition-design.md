# Detail Taskbar and WOOF Exhibition Layout Design

## Goal

Give every project detail page one consistent acid-yellow taskbar and rebuild WOOF as an exhibition-style two-column case study with sequential images and persistent explanatory text.

## Global Project Taskbar

- Render a fixed acid-yellow rounded taskbar at the top of every valid `/project/:id` page.
- Left: `← 返回作品集` in Chinese and `← Back to work` in English, linking to `/portfolio#work`.
- Center: the localized current project title.
- Right: `PROJECT NN / 07`, derived from project order rather than hard-coded per page.
- Keep the taskbar above all detail content and below the global custom cursor.
- Use the existing cream, charcoal, and acid-yellow palette with a subtle glass border and shadow.
- On narrow screens, retain all three regions but shorten the left label and right counter to `NN·07`; truncate the centered title when required.
- Keep the existing bottom previous/next project navigation and shared contact footer.

## Floating Navigation Removal

- Remove the bottom-right `全部项目 / All projects` floating button from project routes.
- Preserve the homepage `返回顶部 / Back to top` behavior.
- Do not remove `FloatingGlassNav` globally; it remains responsible only for the homepage control.

## WOOF Exhibition Layout

- Replace the current intro-plus-story composition with one continuous two-column exhibition layout.
- Left column: approximately 65% of the content width.
- Right column: approximately 35% of the content width.
- Render all WOOF project images in their original array order as one vertical stream in the left column.
- Use one consistent image width with `16–24px` vertical spacing.
- Remove all WOOF pair, asymmetric, and left/right image alternation layouts.
- Preserve full image content with `height: auto` and no forced cropping.

## Sticky WOOF Explanation

- Keep the entire explanatory panel in the right column with `position: sticky`.
- Offset the sticky panel below the fixed taskbar.
- Include project label, tags, localized title, English title, description, and existing metadata.
- Include all existing detail sections as compact labeled blocks beneath the metadata: project background, core experience, and visual system.
- The explanatory panel remains visible while the left image stream scrolls and exits naturally when the WOOF section ends.
- If the panel is taller than the viewport, constrain its maximum height below the taskbar and allow the panel itself to scroll without covering the taskbar.

## Responsive Behavior

- Below the tablet breakpoint, switch WOOF to one column.
- Show the complete explanation first and the ordered image stream afterward.
- Disable sticky positioning and internal panel scrolling on narrow screens.

## Verification

- Every valid project detail route renders the same taskbar with correct localized title and order.
- Project routes no longer render the bottom-right all-projects button.
- Homepage back-to-top remains available.
- WOOF renders each image exactly once in source order.
- No WOOF pair or asymmetric image layout remains.
- WOOF explanation remains sticky on desktop and becomes static on mobile.
- Production build succeeds and all seven project routes remain reachable.
