# Project Block Link and Image Surface Design

## Goal

Make every homepage project section enter its detail page from any point in the section, while giving white-background project images enough visual separation from the page.

## Approved Design

- Each `.project` contains one semantic block-level link covering its summary, folder preview, and three-image grid.
- Remove the nested links from the folder component and image items. The single outer link becomes the only navigation target.
- Focusing the outer link keeps the existing `focus-within` folder-opening behavior.
- Give each image a warm-gray, lightly textured paper surface with restrained padding, border, and soft shadow.
- On project hover or focus, slightly deepen the image surface shadow while retaining the existing image-item scale feedback.
- Preserve responsive image counts, project ordering, and all project routes.

## Accessibility and Verification

- There must be exactly one `/project/:id` link per homepage work section.
- The outer link receives a visible focus treatment.
- The final DOM must contain no nested anchors.
- Production build and all seven project routes must pass.

