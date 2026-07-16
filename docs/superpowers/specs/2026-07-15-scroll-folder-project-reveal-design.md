# Scroll-Driven Project Folder Reveal Design

## Objective

Add a scroll-driven folder interaction beneath every project on the `/portfolio` homepage. Each folder opens as its section becomes pinned, releases three project images during the next part of the scroll, and becomes a clear link to the corresponding project detail page.

## Placement and project coverage

- Add one folder-reveal section beneath each of the seven homepage project presentations.
- Keep the existing project content, directory, grids, and detail-page routes unchanged.
- Use the first three available images from each project's existing `images` array.
- The `misc` folder uses its own three project images on the homepage. The separate entry-page rule that hides the `misc` hover preview remains unchanged.

## Desktop scroll sequence

Each folder section is approximately `200vh` tall and contains a `100dvh` sticky stage.

1. **Approach / closed, 0–25%:** The folder sits closed at the centre of the stage.
2. **Open, 25–50%:** The folder flap rotates upward and the back panel gains depth.
3. **Image release, 50–78%:** Three images rise from behind the folder and fan left, centre, and right with small rotation offsets.
4. **Ready, 78–100%:** The full composition settles and a bilingual “click to view full project” cue fades in.
5. **Exit:** The sticky stage releases and normal document scrolling continues to the next content block.

The sequence is driven by normalized scroll progress rather than discrete wheel interception. Scrolling upward reverses every state naturally.

## Folder visual system

- Use acid yellow `#e6ff1a` for the folder body and neutral deep gray `#3a3a3a` for text and edge definition.
- Build the folder from semantic HTML elements and CSS shapes; add no image or component dependency.
- The front panel displays the bilingual project label `PROJECT NN / 项目 NN` and the translated project title.
- Use restrained rounded corners, layered edge highlights, and a soft tinted shadow consistent with the existing site.
- Keep the folder large enough to read as an interaction object but subordinate to the three released project images.

## Image fan

- Display three existing project images in cards behind the folder front.
- Use each image's natural content with `object-fit: cover` inside controlled editorial cards; do not distort images.
- Final desktop positions form an asymmetric fan: left card rotated slightly counter-clockwise, centre card elevated, and right card rotated slightly clockwise.
- Cards use small corner radii and soft neutral shadows.
- The folder front remains above the lower edges of the cards so the images appear to emerge from inside it.

## Navigation and interaction

- Wrap the complete sticky-stage composition in a real React Router link to `/project/:id`.
- The link is usable by keyboard and exposes a descriptive accessible label.
- Do not navigate merely because the user scrolls; navigation requires click, tap, or keyboard activation.
- Show the click cue only after the reveal is substantially complete, but keep the link functional throughout.
- Preserve the global cursor and click feedback.

## Mobile and reduced motion

- Below the existing tablet breakpoint, use a shorter non-pinned section.
- Reveal the open folder and fanned images when the section enters the viewport; do not require multiple scroll stages.
- Stack or tighten the image fan so it remains inside the viewport.
- For `prefers-reduced-motion`, show the final open state without scroll-linked transforms.

## Component boundaries

- Create `src/components/ProjectFolderReveal.jsx` to own scroll progress, folder geometry, image fan transforms, accessibility, and responsive behavior.
- `Home.jsx` only supplies the project and translated title and places the component after each project body.
- `styles.css` owns visual geometry and breakpoints; project data remains the source of image and route truth.
- Reuse Framer Motion's `useScroll`, `useTransform`, and reduced-motion support. Add no dependency.

## Performance

- Animate only transforms and opacity.
- Use one scroll-progress observer per folder section.
- Render only three existing images per project.
- Avoid wheel event interception, layout animation, and continuously updated React state during scroll.

## Verification

- Confirm seven folder components render from the existing project loop.
- Confirm each folder receives three images and links to its own detail route.
- Confirm scroll progress drives flap, image fan, and cue transforms.
- Confirm reverse scroll is derived from the same progress values.
- Confirm mobile and reduced-motion final states remain navigable.
- Run `git diff --check` and the production Vite build.
