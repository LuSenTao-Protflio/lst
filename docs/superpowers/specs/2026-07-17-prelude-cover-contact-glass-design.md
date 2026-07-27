# Prelude Cover and Contact Glass Design

## Goal

Add a distinct opening screen before the existing project entry. It introduces Lusen Tao through responsive English typography, then advances to the current project index. Update the portfolio home portrait with a contact panel and make the footer contact information complete.

## Route flow

`/` becomes the new prelude screen. It advances to `/entry` through a downward wheel gesture, the Down Arrow key, or a visible enter action. The existing project-index screen moves from `/` to `/entry`; its project proximity reveal, light-ray pointer interaction, and navigation into `/portfolio` remain unchanged.

The existing `/portfolio`, `/project/:id`, and `/wechat` routes remain unchanged. Browser back navigation returns from `/entry` to the prelude.

## Prelude visual system

The prelude is a dark olive, frosted-glass full viewport. A 12-column text grid places `Lusentao`, `深圳大学`, and `视觉传达设计` at the top without a taskbar container.

The center uses `GRAPHIC DESIGN PORTFOLIO` in a variable typeface. Per-character weight, width, and italic angle react to pointer proximity, inspired by the supplied TextPressure component. The implementation will use a local variable font package rather than a runtime Google-font import. The type settles when the pointer leaves and becomes static for reduced-motion users and touch-first screens.

Acid yellow remains the accent. The glass surface uses deep olive, pale highlight edges, and the existing light-ray treatment. No new navigation labels, decorative status dots, or unrelated content are added.

## Transition behavior

Wheel intent is thresholded so trackpad noise cannot skip the prelude. The Down Arrow key works when focus is not inside an interactive element. The same short opacity and blur transition currently used at entry is reused before navigation. Reduced-motion users navigate immediately without animated distortion.

## Home portrait contact glass

The existing image in the home information section remains the portrait. A bottom-aligned panel overlays the image with two layered, blue-black frosted surfaces, an inner border, and controlled highlight refraction. It contains:

- portrait thumbnail
- `卢森涛`
- `视觉传达设计`
- `联系我` action

The action uses `href="#contact"` so it scrolls to the existing job-contact footer. Keyboard focus and a non-transparent fallback are included. On small screens, the panel remains inside the portrait width and stacks without covering the face.

## Footer contact

The job-contact column retains the email link and adds `电话 / 微信同号：15875591020` directly beneath it. Both lines share the same large type scale, underline animation, alignment, and hover/focus response. The phone line uses a `tel:` link.

## Verification

- Build with the GitHub Pages base path.
- Verify `/`, `/entry`, and `/portfolio` navigation plus browser-back behavior.
- Verify wheel and keyboard advance only once per gesture.
- Verify the home contact action targets `#contact`.
- Verify desktop and 390px layouts, reduced motion, and no horizontal overflow.
- Verify the production artifact has `/lst/` asset paths and passes `git diff --check`.
