# Independent Portfolio Entry Page Design

## Objective

Turn the current introductory section into a true standalone entry page. Visitors first arrive at `/`, then enter the existing portfolio homepage at `/portfolio` by scrolling down or activating the entry button.

## Routing and navigation

- `/` renders only the entry page.
- `/portfolio` renders the existing full portfolio homepage.
- `/project/:id` and `/wechat` remain unchanged.
- A downward wheel gesture on the entry page navigates to `/portfolio` once per gesture.
- The entry button also navigates to `/portfolio`.
- Browser Back returns from `/portfolio` to `/`.
- The entry page does not show the main-site navigation bar or the floating return-to-top control.
- Direct project links in the entry directory continue to open their existing project detail routes.

## Entry-page composition

The page uses the existing warm-white, acid-yellow, and neutral-gray palette. Its content is optically centered on the horizontal axis, with the title group positioned above the mathematical vertical center.

1. A restrained editorial metadata line sits near the top edge.
2. The centered title group shows `卢森涛` and `个人作品集网站`, with a smaller English subtitle beneath it.
3. The title is smaller than the current oversized treatment and uses a heavy, condensed-feeling sans serif style.
4. The seven-project directory sits below the title with deliberate breathing room, but remains compact enough to fit within one desktop viewport.
5. A glass-style entry control sits below the directory and remains visually secondary to the title and projects.

## Project directory and preview

- Project rows use a heavier font weight and a clearer visual hierarchy.
- Each row retains its project number, title, and compact category label.
- Hovering or keyboard-focusing a row reveals that project's existing hero image.
- The floating image preview is reduced to approximately 240–280 px wide on standard desktop screens.
- The preview follows the pointer with restrained spring movement and does not obscure the active project title.
- On touch devices and for reduced-motion users, the floating preview is omitted while all project links remain usable.

## Motion and accessibility

- Initial title and row reveals remain short and restrained.
- Downward wheel navigation is locked briefly to prevent repeated route changes.
- The entry button is keyboard accessible and has a visible focus state.
- Reduced-motion preferences remove nonessential movement and use immediate navigation.
- Semantic headings, links, and button labels remain available to assistive technology.

## Implementation boundaries

- Reuse the existing React, React Router, Framer Motion, project data, language context, and global cursor components.
- Extract the entry page into its own route-level page rather than conditionally hiding the existing homepage.
- Remove `InteractiveCover` from `Home`; do not duplicate the original portfolio content.
- No new dependencies or visual assets are required.
- Existing project pages, homepage content, project ordering, and site-wide palette are outside this change.

## Verification

- Confirm `/` renders only the entry page.
- Confirm `/portfolio` starts at the top of the original portfolio homepage.
- Confirm wheel and button entry both navigate to `/portfolio`.
- Confirm all seven project links resolve correctly.
- Confirm the entry layout remains usable at desktop and mobile breakpoints.
- Run `git diff --check` and a production Vite build.
