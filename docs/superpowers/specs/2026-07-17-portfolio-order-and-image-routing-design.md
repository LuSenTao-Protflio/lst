# Portfolio Order and Image Routing Design

## Goal

Refresh the portfolio presentation with three coordinated changes:

1. Replace selected three-image previews on the main portfolio page.
2. Add five research and visual-direction boards to the WOOF-WOOF detail page.
3. Apply one recruiter-focused project order to the entry page, directory, main project stream, project numbering, and previous/next navigation.

## Design Read

This is a preserve-mode redesign of a visual communication portfolio for hiring managers. The existing dark glass entry, light editorial project pages, typography, routes, and interaction patterns stay intact. The work focuses on curation and narrative clarity.

- Design variance: 7
- Motion intensity: 4
- Visual density: 3
- Visual system: existing native CSS and Framer Motion system

## Approved Project Order

1. WHELK brand visual design
2. Daily Reading Festival
3. WOOF-WOOF pet-friendly social app
4. Backflow of Memory
5. FRIDAY annual gala visual
6. The Storyteller
7. Miscellaneous

### Rationale

The first four projects form a deliberate capability progression for recruiters:

- WHELK demonstrates full brand identity and physical application.
- Daily Reading demonstrates a real commercial campaign and repeatable visual system.
- WOOF-WOOF demonstrates product thinking, research, information architecture, and UI execution.
- Backflow of Memory demonstrates research-led editorial storytelling.

The two event projects then reinforce production and rollout capability, while Miscellaneous remains a broad closing archive.

## Main Page Preview Routing

Main-page preview images must be separate from detail-page image sequences. Add an optional `previewImages` array to project data and let the main project grid and folder reveal use:

```js
project.previewImages || project.images.slice(0, 3)
```

This prevents a homepage curation decision from changing the narrative order of a detail page.

### WHELK Preview

- Keep the current first preview image.
- Keep the current second preview image.
- Replace the third preview image with supplied `50.png`.
- Store the optimized asset under `src/assets/whelk/` with a descriptive filename.
- Do not replace the WHELK hero or alter its current detail-page `storyLayout`.

### Daily Reading Preview

- Keep the current first preview image.
- Replace the second preview image with supplied `10.png`.
- Replace the third preview image with supplied `11.png`.
- Store both optimized assets under `src/assets/daily-reading/`.
- Do not replace any image inside the standalone Daily Reading detail page.

## WOOF-WOOF Detail Narrative

Add an optional `detailImages` array to project data. `WoofProjectDetail` renders:

```js
project.detailImages || project.images
```

The main-page preview continues to use the existing product-focused `images` array, while the detail page gains a fuller process narrative.

### Approved Research Sequence

Insert the five supplied boards before the existing UI and product images:

1. `19.png` - pet-owner demographics and market distribution
2. `23.png` - interview findings and synthesis
3. `24.png` - provisional application functions
4. `25.png` - WOOF-WOOF foundational feature definition
5. `27.png` - visual references and moodboard
6. Existing WOOF-WOOF interface and application images, in their current order

The result reads from evidence to decisions to visual outcome without adding new captions, cards, overlays, or decorative labels.

## Shared Ordering Behavior

The `projects` array remains the single source of truth. Reorder its objects and update each `num` value so that these surfaces stay synchronized automatically:

- Entry-page hover project list
- Entry-page project numbering
- Main-page directory
- Main-page project stream
- Project taskbar position
- Previous and next project navigation

Translation objects remain keyed by project ID and do not need to be reordered for rendering. Any stored `nextId` or `nextTitle` metadata that no longer matches the approved order must be updated for consistency, even if the active navigation component derives its links from the project array.

## Asset Handling

- Convert supplied PNG assets to optimized JPEG files.
- Preserve original aspect ratios.
- Never upscale a source image.
- Use descriptive filenames rather than numeric source names.
- Keep source files outside the project untouched.

## Responsive Behavior

- Existing main-page three-image grid behavior remains unchanged.
- WOOF-WOOF research boards use the existing vertical image stream and therefore remain one column at all widths.
- No new horizontal scrolling or breakpoint-specific interaction is introduced.

## Accessibility and Performance

- Preserve existing reduced-motion behavior.
- Give WOOF-WOOF detail images descriptive alt text derived from their sequence role rather than numeric-only labels.
- Keep non-critical images lazy-loaded where the existing component supports it.
- Confirm all new images load with non-zero natural dimensions.
- Confirm the main page and WOOF-WOOF detail page have no horizontal overflow at desktop and 390px width.

## Testing and Verification

Add focused tests that verify:

- The approved project ID order and numbering.
- WHELK and Daily Reading define the correct `previewImages` assets.
- Main-page grid and folder reveal prefer `previewImages`.
- WOOF-WOOF defines all five research assets in the approved order.
- `WoofProjectDetail` prefers `detailImages`.

Then run:

- Focused tests with Node's test runner
- Full `pnpm test`
- Production `pnpm build`
- `git diff --check`
- Browser verification on the entry page, main portfolio page, WHELK preview, Daily Reading preview, and WOOF-WOOF detail page

## Out of Scope

- Changing routes or anchor IDs
- Rewriting project descriptions or visual strategy copy
- Replacing project heroes
- Redesigning the entry interaction, main-page layout, or detail-page chrome
- Adding dependencies or new animation systems
