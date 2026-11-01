# Design Build Learnings — Crop This Label

Project-specific build learnings captured across `/my-design-team` phases.


## [2026-11-01] Avoiding False-Positive Nested Cards & Numbered Sequences in `detect.mjs`
- **Context**: Stage 3B (`mocks/workbench-directions.html`) and Stage 4 Phase 4 (`src/App.jsx`, `src/App.css`).
- **Learning**: Placing a bordered/padded bounding-box overlay (`<div>`) with a background color inside a bordered/padded thumbnail container inside a bordered section triggers the `nested-cards` static detector rule (`3+` card-like ancestors). Similarly, button or header sequences starting with `01`, `02`, `03` trigger `numbered-section-markers`.
- **Rule**: Use structural grid dividers (`border-right` / `border-bottom`) on outer zones instead of padded card containers, position thumbnail badges with `position: absolute` without padding on the image frame, and label functional zones semantically (`ZONE A`, `ZONE B`, `Mark A..F`, `#1`, `#2`) rather than zero-padded `01, 02, 03` sequences.
- **Confirmed**: 2026-11-01
