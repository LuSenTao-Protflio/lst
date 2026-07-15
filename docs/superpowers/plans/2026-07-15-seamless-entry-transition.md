# Seamless Entry Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the detached entry interstitial with a fast charcoal takeover that visually continues into the portfolio hero.

**Architecture:** Keep the existing `EntryTransition` component and shared entry trigger. Change only its GSAP timeline and overlay reveal styles so navigation happens at the end of a roughly 0.65-second transform-based wipe with no trailing hold.

**Tech Stack:** React, GSAP 3.15, CSS, Vite

## Global Constraints

- Use `var(--deep)` for the overlay so it exactly matches the portfolio hero.
- Keep acid-yellow transition typography.
- Keep the shared click/wheel trigger lock and reduced-motion bypass unchanged.
- Do not add ScrollTrigger or an exit animation.

---

### Task 1: Compress and blend the entry transition

**Files:**
- Modify: `src/components/EntryTransition.jsx`
- Modify: `src/styles.css`
- Modify: `VERSION.md`

**Interfaces:**
- Consumes: `EntryTransition({ active, onComplete })` and the existing `finishEntry` callback.
- Produces: the same component interface with a faster, transform-based timeline.

- [ ] **Step 1: Record the current behavior check**

Run:

```bash
rg -n "duration: 0.72|duration: 0.12|entry-transition" src/components/EntryTransition.jsx src/styles.css
```

Expected: the old 0.72-second character tween and 0.12-second trailing hold are present.

- [ ] **Step 2: Implement the takeover timeline**

Change the root animation to reveal from `yPercent: 100` over `0.26` seconds, overlap a `0.38` second character animation with `0.035` stagger, and overlap the English line within the same timeline. Remove the empty trailing tween so `onComplete` navigates immediately.

- [ ] **Step 3: Make the overlay reveal transform-safe**

Add `will-change: transform` and `overflow: hidden` to `.entry-transition` while retaining `background: var(--deep)`.

- [ ] **Step 4: Update the version record**

Add one line to `VERSION.md` describing the fast charcoal takeover and seamless hero continuity.

- [ ] **Step 5: Run focused checks**

Run:

```bash
rg -n "yPercent: 100|duration: 0.26|duration: 0.38|stagger: 0.035" src/components/EntryTransition.jsx
! rg -q "to\(\{\}, \{ duration" src/components/EntryTransition.jsx
git diff --check
```

Expected: all commands exit successfully and no trailing hold remains.

- [ ] **Step 6: Build and check local routes**

Run:

```bash
PATH='/Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:'"$PATH" /Users/ttao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/vite/bin/vite.js build
curl -sS -o /dev/null -w 'entry=%{http_code}\n' --max-time 5 http://127.0.0.1:4176/
curl -sS -o /dev/null -w 'portfolio=%{http_code}\n' --max-time 5 http://127.0.0.1:4176/portfolio
```

Expected: Vite builds successfully and both routes return HTTP 200.
