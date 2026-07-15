# Interactive Portfolio Cover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a permanent animated editorial cover before the existing Home hero with seven hover-preview project links and dual scroll/button entry.

**Architecture:** `InteractiveCover` owns the full-screen cover and entry behavior. `HoverProjectReveal` owns the project list, spring-follow preview, dimming, and direct links while consuming existing projects and translations.

### Task 1: Build the hover project directory

- Create `src/components/HoverProjectReveal.jsx`.
- Render seven translated project links from `projects`.
- Track hovered index, pointer coordinates, and spring-follow image position.
- Dim inactive rows and vertically flip active row text.
- Use each project hero in a 16:9 pointer-transparent preview.
- Disable the floating preview on coarse pointers.

### Task 2: Build and mount the interactive cover

- Create `src/components/InteractiveCover.jsx`.
- Add warm-white editorial metadata, compressed Chinese display title, English subtitle, project directory, and glass Enter Portfolio button.
- Use Framer Motion staggered mask reveals for a total intro duration near 1.5 seconds.
- Add one-shot downward wheel handling at the cover and a shared scroll-to-`#portfolio-home` function.
- Mount before the existing nav/hero in Home and add `id="portfolio-home"` to the existing hero.

### Task 3: Style and verify

- Add full-height cover grid, title masks, irregular highlight, directory rows, floating image, glass entry button, and responsive styles.
- Keep the fixed Home nav visually behind the opaque cover until the cover scrolls away.
- Disable preview and wheel interception for reduced motion/coarse pointer.
- Append the feature to `VERSION.md`.
- Run `git diff --check` and `npm run build`.
- Verify seven links, hero anchor entry, ability to scroll back to cover, Home back-to-top threshold, and no mobile overflow.
