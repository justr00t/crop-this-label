# Design Review Learnings — Crop This Label

Project-specific review learnings captured across `/my-design-team` Dual-Blind critiques.

## [2026-11-01] Physical Thermal Label Media Tokens Across Light & Dark Themes
- **Context**: Stage 3B Dual-Blind Critique of `mocks/workbench-directions.html` across 5 dealt DNA directions and light/dark themes.
- **Learning**: A thermal shipping label specimen (`4" × 6"`) is a physical print artifact (`Ch 8: Gamut & Cross-Media Fidelity`), so its paper surface (`--label-paper: #ffffff`) and thermal ink (`--label-ink: #111315`) should remain high-contrast white/black in both light and dark UI themes while the surrounding workbench chrome shifts to `[data-theme="dark"]` tokens. Additionally, in PowerShell on Windows, `>` writes `utf-16le` which `view_file` flags as binary; piping `detect.mjs` to `Set-Content -Encoding utf8` keeps `detect-*.json` readable as plain text.
- **Rule**: Verify that print/media specimen surfaces use dedicated `:root` media tokens (`--label-paper`, `--label-ink`) rather than inverting barcode contrast in dark mode, and always write temporary `detect-*.json` files with UTF-8 encoding before cleanup.
- **Confirmed**: 2026-11-01

