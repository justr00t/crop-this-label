# Design Plan: Zone A / Zone B Separation & Sample Label Removal (`--quick`)

**Date:** 2026-11-02
**Project:** Crop This Label (`crop-this-label`)
**Route:** ⚡ Quick Track (`--quick`)
**Locked DNA:** Direction 5 "Kraft Press" (`playful-geometric` + `Bricolage Grotesque` / `DM Sans` / `IBM Plex Mono` + Kraft Amber `#e9a95e` & Terracotta `#e0704a` + Mark B `logo-peel`)

---

## Problem Statement

1. **Remove Sample Label Clutter:** The `"No label file handy? Load Sample Carrier Sheet"` bar (`buildSampleSheetDataUrl` / `loadSampleCarrierSheet`) is unnecessary and adds visual noise to the intake state and error state.
2. **Eliminate Confusing Fused Black Lines Between Zone A & Zone B:** Currently, `main.workbench-shell` fuses Zone A and Zone B into a single bordered box with `0px` column gap, separated by a `2px solid var(--neutral-12)` vertical black line that collides with the horizontal `2px solid` header and control borders (`+` and `T` junctions). Combined with internal spec jargon (`"Zone A · Source Carrier Sheet"` / `"Zone B · Calibrated 4.00" × 6.00" Output Stage"`), it is hard to tell at a glance how the two sides relate.

---

## Stage 3 Deliverable: Interactive Layout Explorer Mock (`mocks/zone-layout-options.html`)

- **Goal:** Let the user interactively compare **3 distinct spatial/border architectures** for separating Input (Step 1) and Output (Step 2)—with the Sample Label completely removed—across both `ready` (Empty) and `success` (Cropped 4×6 Label) states.
- **Deliverables:** `mocks/zone-layout-options.html`
- **Doctrine:** `[design-dna, color, fonts, usability, content-design, ai-tells]`
- **Three Interactive Layout Options (`data-layout`):**
  1. **Option A (`split-stations` — Two Separated Stations + Flow Connector):**
     - Replaces the fused monolith with **two physically separated containers** (`gap: var(--space-6)`) connected by a visual directional badge (`→`).
     - Left Station (`38fr`): **`1 · SOURCE DOCUMENT`** (muted surface, clean dashed dropzone without nested outer/inner black boxes).
     - Right Station (`62fr`): **`2 · 4×6 THERMAL LABEL`** (commanding elevated paper stage with the signature `4px 4px 0px` hard-offset shadow).
  2. **Option B (`soft-tray` — Recessed Intake Well + Single Elevated Stage):**
     - Keeps a unified outer workbench frame, but **removes all internal `2px solid` black dividing lines** (zero `+` or `T` junctions).
     - The left intake area sits in a warm recessed tray (`background: var(--neutral-3)`) with soft `1px solid var(--border-subtle)` metadata dividers, so **only** the 4×6 label sheet and primary action buttons carry bold ink borders and offset shadows.
  3. **Option C (`stage-progressive` — State-Driven Progressive Focus):**
     - In **`ready` (Empty)** state: Shows **only a single centered Upload Dropzone** (`max-width: 620px`)—no empty Zone B placeholder box competing for attention.
     - In **`success` (Cropped)** state: Transitions to the 2-column workspace where the cropped 4×6 label is the unmistakable hero on the right and the source sheet thumbnail + candidate switcher sit cleanly on the left.
- **Verification Criteria:**
  1. Single-file self-contained HTML with verbatim `:root` and `[data-theme="dark"]` Kraft Press tokens from `DESIGN.md` and zero raw hex/rgb literals in component CSS rules.
  2. Sample label button and sample bar completely absent across all states (`ready`, `processing`, `success`, `error`).
  3. Interactive top comparison bar switching live between `Option A: Separated Stations`, `Option B: Recessed Tray (No Inner Black Lines)`, and `Option C: State-Driven Single → Split`, plus state switcher (`ready`, `processing`, `success`, `error`) and theme toggle (`light` / `dark`).
  4. Zero `detect.mjs` errors (`nested-cards` avoided via element-qualified selectors, `prefers-reduced-motion` present).

---

## Stage 4 Phase 1: Production React Implementation (Approved Option C: `stage-progressive`)

- **Approved Mock Architecture:** **Option C (`stage-progressive` — Progressive Focus: Single centered Upload card when empty, expanding into 2 separated cards when loaded)** from `mocks/zone-layout-options.html` (with zero middle `"STEP 1 → 2"` badge).
- **Goal:** Apply Option C (`stage-progressive`) to the React production app and remove all sample label code.
- **Deliverables:** `src/App.jsx`, `src/index.css`, `src/App.css`, `DESIGN.md`, `JOURNEY.md`
- **Doctrine:** `[design-dna, usability, content-design, responsive, ai-tells]`
- **Verification Criteria:**
  1. `buildSampleSheetDataUrl`, `loadSampleCarrierSheet`, `.intake-sample-bar`, and unused `FileText` icon import completely removed from `src/App.jsx` and `src/App.css`.
  2. Option C (`stage-progressive`) faithfully implemented in `src/App.jsx`, `src/index.css`, and `src/App.css`:
     - When `data-state` is `loading`, `ready`, or `error`: `main.workbench-shell` centers a single `max-width: 620px` (`grid-template-columns: 1fr`) `section.zone-intake` card (`STEP 1 · SOURCE DOCUMENT`), hides `section.zone-stage`, and displays the progressive hint (`"Step 2 (4.00\" × 6.00\" Thermal Stage) opens automatically once you drop or paste a file."`).
     - When `data-state` is `processing` or `success`: `main.workbench-shell` expands into a 2-column separated layout (`max-width: 1100px; grid-template-columns: 38fr 62fr; gap: var(--space-6); background: transparent; border: none; box-shadow: none;`) where `section.zone-intake` (`STEP 1 · SOURCE DOCUMENT`) and `section.zone-stage` (`STEP 2 · 4.00" × 6.00" THERMAL LABEL`) are two physically separated cards (`border: 2px solid var(--neutral-12); border-radius: var(--radius-ui); box-shadow: var(--shadow-ui);`) with softer internal dividers (`1.5px solid var(--border-subtle)`) and zero middle `"STEP 1 → 2"` badge.
  3. `DESIGN.md` and `JOURNEY.md` updated to reflect the locked Option C (`stage-progressive`) layout and removal of the Sample Carrier Sheet.
  4. Zero raw hex/rgb literals outside `:root` / `[data-theme="dark"]` token blocks; `npm run lint`, `npm run build`, and `detect.mjs` pass with zero errors, and `design-review-agent` returns `VERDICT: PASS`.
