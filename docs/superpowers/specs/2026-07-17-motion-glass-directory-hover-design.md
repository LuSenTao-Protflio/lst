# Motion, Glass Taskbar, and Directory Hover Design

## Goal

Unify three interactions into the portfolio's existing restrained acid-yellow visual language without changing page structure.

## Approved Design

- Extend the entry-to-portfolio transition from roughly 0.7 seconds to roughly 1.15 seconds. Let the Chinese title and English caption settle for about 0.25 seconds before navigation completes.
- Keep the project taskbar acid yellow, but reduce the opaque fill and increase backdrop blur, saturation, inner highlight, and soft depth shadow so the content behind it remains perceptible.
- On directory-row hover and keyboard focus, enlarge only the project title to about 1.12× and move it slightly right. Keep the number, English subtitle, and tags at their current scale to avoid row-height and grid movement.
- Preserve reduced-motion behavior and responsive layouts.

## Verification

- Production build completes.
- Entry transition completion occurs after the new timeline duration.
- Every project detail page retains one readable taskbar.
- Directory title transform is visible on hover/focus without horizontal overflow.

