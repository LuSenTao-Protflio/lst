# Project Summary and Portrait Blend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify inline folder labels, cap homepage project galleries at three images, and blend the portrait into the page background without a hard band.

**Architecture:** Change only the folder display label and Home render slice; leave project data and detail components untouched. Coordinate the portrait pseudo-element and shared scene pseudo-element gradients in CSS.

**Tech Stack:** React, CSS, Vite

## Global Constraints

- Do not remove images from project data.
- Do not change detail-page galleries.
- Keep folder routes and interaction unchanged.

---

### Task 1: Simplify folder text and homepage galleries

**Files:**
- Modify: `src/components/ProjectFolderReveal.jsx`
- Modify: `src/pages/Home.jsx`

- [ ] Set the folder label to the localized `title` only.
- [ ] Change the homepage grid iteration to `p.images.slice(0, 3).map(...)`.
- [ ] Verify no folder-number prefix remains and Home contains the three-image slice.

### Task 2: Overlap portrait and scene gradients

**Files:**
- Modify: `src/styles.css`
- Modify: `VERSION.md`

- [ ] Replace the portrait fade with a softer lower-35% multi-stop charcoal blend.
- [ ] Raise and reshape the shared scene fade with a charcoal hold before cream.
- [ ] Record the changes in `VERSION.md`.
- [ ] Run `git diff --check`, the Vite production build, and HTTP checks for `/portfolio`, `/project/woof`, and `/project/metakeys`.
