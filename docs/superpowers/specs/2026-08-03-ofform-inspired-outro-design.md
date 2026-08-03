# LUSENTAO Ofform-Inspired Outro Design

## Objective

Recompose the main portfolio page ending with the editorial hierarchy and progressive reveal seen in the Ofform reference, while preserving the portfolio's existing charcoal, warm-white, and acid-yellow palette, existing routes, project content, typography assets, and overall visual identity.

This change affects layout, content hierarchy, and scroll behavior. It does not recolor the site or redesign the project sections.

## Scope

- Replace the current compact two-column `SiteFooter` presentation on the main portfolio page with a long-form editorial outro.
- Preserve the existing contact anchor so links to `#contact` continue to work.
- Hide the fixed glass navigation only while the outro information is prominently visible.
- Restore the navigation when the user scrolls upward out of the outro.
- Keep project detail page footers and taskbars unchanged unless they share a component that must be made backward compatible.

## Visual Structure

The outro is a continuous section approximately `130svh` to `150svh` tall on desktop. It should feel like the final movement of the current page rather than a separate card or colored strip.

### Information area

The upper portion uses a sparse two-column editorial grid:

- Left column: contact heading, email, and phone number.
- Right column: About heading and a concise self-description.
- Email and phone use the same white typographic treatment and similar visual priority.
- Both are semantic links using `mailto:` and `tel:`.
- Hover and keyboard focus use the existing acid yellow as a restrained underline, arrow, or short translation response.

The information grid uses the site's existing maximum width and horizontal padding so it aligns with the hero, directory, and project content.

### Wordmark

The bottom of the outro contains a large `LUSENTAO` wordmark.

- Use the existing Climate Crisis display font.
- Set the wordmark close to the lower and side edges, echoing the scale of the Ofform reference.
- Use an existing palette color, preferably acid yellow against the dark outro background.
- Size responsively with `clamp()` so it remains a single strong line on desktop without horizontal overflow.
- Keep it decorative but readable. It must not cover contact information.

## Scroll Choreography

The section remains in normal document flow. It must not trap scrolling or require extra wheel gestures.

1. As the outro approaches the viewport, the information grid rises a short distance and fades into full opacity.
2. The wordmark follows with a slightly delayed upward reveal from the lower edge.
3. When the information area becomes substantially visible, the fixed glass navigation fades and translates upward.
4. When the outro leaves that active threshold in reverse, the navigation returns.

Use Framer Motion scroll progress or intersection-based state. Do not attach a continuous raw window scroll listener. Animate only opacity and transforms to keep the interaction smooth.

Suggested motion character:

- Information reveal: approximately 24 to 40 pixels of vertical travel.
- Navigation hide and restore: 220 to 320 milliseconds.
- Wordmark reveal: slightly slower than the information, with restrained easing.
- No pinning, scroll locking, or full-screen snap transition.

## Navigation Behavior

The existing nav remains unchanged throughout the rest of the site.

- Add a hidden state class or motion variant controlled by outro visibility.
- Hidden state: translated slightly above the viewport with zero opacity and no pointer interaction.
- Visible state: current glass appearance and position.
- Direct navigation to `#contact` must reveal the outro correctly without leaving the nav in an inconsistent state.

## Responsive Behavior

### Desktop and tablet landscape

- Two-column information grid.
- Contact column is narrower than the About column.
- Large wordmark sits along the lower edge.

### Phone and narrow tablet

- Information becomes a single vertical stack.
- Email and phone may wrap safely but retain equal styling.
- Outro height becomes content-driven with generous vertical padding rather than forcing a desktop-sized viewport length.
- Wordmark scales down while retaining edge alignment and strong visual weight.
- Navigation hiding follows the same semantic threshold.

## Accessibility

- Retain semantic `footer`, headings, anchors, `mailto:`, and `tel:` behavior.
- Keyboard focus must be clearly visible.
- When `prefers-reduced-motion: reduce` is active, render the information and wordmark fully visible and use either no transition or a short opacity-only transition.
- The nav must never remain hidden after leaving the outro.
- Text contrast must remain suitable against the dark background.

## Content

Retain the existing localized contact and About strings unless implementation exposes a clear content defect. The visible contact values remain:

- `sentaolu371@gmail.com`
- `15875591020`

No new social links, recruitment slogans, collaboration invitation, or booking language will be introduced.

## Acceptance Criteria

- The current palette is unchanged.
- The page ending reads as one continuous editorial composition rather than a separate colored footer block.
- Email and phone are equally prominent white interactive links.
- The About statement sits on the right on desktop and below contact on mobile.
- `LUSENTAO` appears at Ofform-like scale at the bottom in the existing display typeface.
- The fixed nav hides only when the outro information is active and returns reliably when scrolling upward.
- The animation does not trap the user or noticeably delay reaching the end of the page.
- The layout has no horizontal overflow at common desktop, iPad, and phone widths.
- Reduced-motion users receive a complete, stable layout.

