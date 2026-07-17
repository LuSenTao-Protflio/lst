# Exact TextPressure and Footer Hierarchy Design

## Title

- Replace the custom prelude title implementation with the supplied TextPressure component behavior: its `dist`, `getAttr`, debounced resize sizing, full-window cursor tracking, cursor easing, and per-character animation loop are retained.
- Render `text="portfolio"` with `flex`, `width`, and `weight` enabled; set `alpha={false}` and `italic={false}`.
- Use the existing local Roboto Flex font and acid-yellow `#E6FF1A` text color. The displayed word remains uppercase because the component applies uppercase styling.
- Preserve the prelude's background, metadata grid, arrow, reduced-motion behavior, and `/entry` navigation.

## Footer

- Keep the email as the primary large contact link.
- Render telephone / WeChat as a smaller bright-yellow secondary line matching the visual hierarchy of the `求职联系` heading, while keeping its `tel:` link and underline interaction.

## Verification

- Test that Prelude configures the exact TextPressure props and does not enable alpha or italic.
- Test the footer phone's compact bright-yellow CSS contract.
- Run the suite, production build, whitespace check, and local hover verification.
