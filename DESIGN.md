# DESIGN.md — Crop This Label

**Date:** 2026-11-02 · **Status:** confirmed (Stage 3 Locked: Direction 5 "Kraft Press" + Mark B "The Peeled Thermal Corner" + Option C "Progressive Focus" Separated Stations)
**Archetype:** Hero + Sage + Creator (Precision Shipping Utility) · **Register:** Product Workbench structure · expressive at: (1) Calibrated 4×6 Label Stage, (2) Brand Mark & Favicon Lockup, (3) Multi-Candidate Detection Telemetry
**Dealer Seed:** `crop-this-label|2026-11-01|0` (`.design-foundations/used-dna.json`)
**Locked Production Selection (Stage 3 Sign-Off):**
- **Visual Direction:** **Direction 5: "Kraft Press" (`data-direction="kraft-press"`)** — `Playful Geometric` (`playful-geometric`) + `Progressive Focus Stations` (`stage-progressive`, Option C: centered `620px` single-card `STEP 1 · SOURCE DOCUMENT` intake when empty/error in `loading`/`ready`/`error` states, expanding into `1100px` `38fr 62fr` separated two-station layout with `var(--space-6)` gap and softer `1.5px solid var(--border-subtle)` internal rules once a file is loaded in `processing`/`success` states; zero sample carrier sheet buttons) + `Bricolage Grotesque` / `DM Sans` / `IBM Plex Mono` + `analogous` Kraft Amber (`69.12°`, `#e9a95e` / `#9c5f14`) & Terracotta (`#e0704a`) on warm kraft-paper neutrals (`#fbfaf9` / `#f4f2ef`) + `hard-offset-shadow` (`4px 4px 0px var(--neutral-12)` solid ink offset shadow on `2px solid var(--neutral-12)` borders, depressing `translate(2px, 2px)` on `:active`).
- **Brand Mark & Favicon:** **Mark B (`02`): "The Peeled Thermal Corner" (`logo-peel`)** — A `2:3` adhesive thermal label (`viewBox="0 0 64 64"`) with its top-right corner peeled back at a crisp 45° angle (`--accent-solid`), exposing the dashed silicone backing liner and a bold service header + vertical tracking barcode underneath.

---

## 1. Dealt Visual Directions (5 Complete DNA Systems)

### Direction 1: "Cobalt Stage" (`data-direction="cobalt-stage"`)
- **Grounding**: **Rollo Thermal Printer's** 4×6 label calibration feed + **Teenage Engineering TP-7's** aluminum/cobalt inspection split-stage.
- **DNA**: `Data-Dense Professional` (`data-dense-professional`) + `Split Stage` (`split-stage`, variance 6, hard 38/62 vertical split) · **Dominant axis**: Composition (38/62 Split Stage).
- **Signature Move (`oversize-punctuation`)**: Display-scale `[` and `]` typographic registration brackets (`64px–80px`, `1px` or light-weight monospace) anchor the corners of the 4×6 label inspection stage.
- **Typography**:
  - Display: `'Archivo', sans-serif` (weights 600, 700; tracking `-0.025em`)
  - Body: `'Archivo', sans-serif` (weights 400, 500)
  - Monospace / Telemetry: `'IBM Plex Mono', monospace` (weights 400, 500, 600; `font-variant-numeric: tabular-nums`)

### Direction 2: "Signal Manifest" (`data-direction="signal-manifest"`)
- **Grounding**: **Swiss Post (Die Post)** waybill hairline grid typography + **Uline Industrial Freight Tag** high-visibility signal-red/orange stamp marks.
- **DNA**: `Swiss / International` (`swiss-international`) + `Fractured Grid` (`fractured-grid`, variance 9) · **Dominant axis**: Signature (`box-drawing-borders`) & Swiss grid rules.
- **Signature Move (`box-drawing-borders`)**: Structural manifest headers, telemetry callouts, and zone dividers use exposed box-drawing characters (`┌── FORM 4X6-THERMAL ──┐`, `├─ 1200×1800 PX ─┼─ 300 DPI ─┤`) and `0px` sharp corners.
- **Typography**:
  - Display: `'Instrument Sans', sans-serif` (weights 600, 700; tracking `-0.03em`)
  - Body: `'Instrument Sans', sans-serif` (weights 400, 500)
  - Monospace / Box-Drawing: `'JetBrains Mono', monospace` (weights 400, 600)

### Direction 3: "Cutting Ledger" (`data-direction="cutting-ledger"`)
- **Grounding**: **Olfa Self-Healing Rotary Cutting Mat** (muted sage measurement grid) + **USPS PS Form 3800 Certified Mail Receipt** columnar ruled ledger.
- **DNA**: `Organic / Natural` (`organic-natural`) + `Ledger Grid` (`ledger-grid`, variance 2, columnar ruled paper) · **Dominant axis**: Signature (`baseline-ruler`).
- **Signature Move (`baseline-ruler`)**: A visible graduated `0.0" … 6.0"` (`0px … 1800px`) baseline ruler runs vertically along the left edge of the 4×6 output stage, and the cropped label sits directly aligned to its inch ticks.
- **Typography**:
  - Display: `'Fraunces', serif` (weights 600, 700; soft optical authority)
  - Body: `'Karla', sans-serif` (weights 400, 500, 600)
  - Monospace / Ruler Ticks: `'IBM Plex Mono', monospace` (weights 400, 500)

### Direction 4: "Thermal Modular" (`data-direction="thermal-modular"`)
- **Grounding**: **Zebra ZP450 Direct Thermal** calibration test print + **1970s Vignelli Postal Modular Manual** flush-left hairline grid.
- **DNA**: `Retro-Futurist` (`retro-futurist`) + `Swiss Modular` (`swiss-modular`, variance 3, white ground with exposed `1px` solid hairline dividers, zero cards) · **Dominant axis**: Type voice (`Unbounded`) & modular hairlines.
- **Signature Move (`logo-polygon-mask`)**: Source previews, candidate badges, and action tags use a 45° chamfered shipping-tag polygon clip-path (`polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)`) derived from the brand mark.
- **Typography**:
  - Display: `'Unbounded', sans-serif` (weights 600, 700; extended industrial caps)
  - Body: `'Instrument Sans', sans-serif` (weights 400, 500)
  - Monospace / Telemetry: `'JetBrains Mono', monospace` (weights 400, 500)

### Direction 5: "Kraft Press" (`data-direction="kraft-press"`)
- **Grounding**: **PirateShip / Gumroad** creator-seller warmth + **Corrugated Cardboard Box Certificate Stamp** bold ink borders and kraft-amber palette.
- **DNA**: `Playful Geometric` (`playful-geometric`) + `Monolith Center` (`monolith-center`, variance 1, single commanding centered parcel station) · **Dominant axis**: Signature (`hard-offset-shadow`) & warm kraft-amber palette.
- **Signature Move (`hard-offset-shadow`)**: All interactive elements and the central 4×6 stage share one crisp `4px 4px 0px var(--neutral-12)` solid ink offset shadow (`2px solid var(--neutral-12)` border) that physically shifts (`translate(2px, 2px)`) on press.
- **Typography**:
  - Display: `'Bricolage Grotesque', sans-serif` (weights 700, 800)
  - Body: `'DM Sans', sans-serif` (weights 400, 500, 600)
  - Monospace / Parcel Specs: `'IBM Plex Mono', monospace` (weights 500, 600)

---

## 2. Type Scale & Rhythm

- **Scale Ratio**: `1.25` (Major Third) rooted at `16px` (`1rem`):
  - `--text-xs`: `0.75rem` (`12px`, line-height `1.4`, tracking `0.04em` for mono/telemetry labels)
  - `--text-sm`: `0.875rem` (`14px`, line-height `1.45`)
  - `--text-base`: `1rem` (`16px`, line-height `1.5`)
  - `--text-lg`: `1.25rem` (`20px`, line-height `1.35`)
  - `--text-xl`: `1.563rem` (`25px`, line-height `1.2`)
  - `--text-2xl`: `1.953rem` (`31px`, line-height `1.15`)
  - `--text-3xl`: `2.441rem` (`39px`, line-height `1.08`)
- **Numeric Discipline**: All dimensions (`4.00" × 6.00"`, `1200 × 1800 px`), confidence scores (`98.4%`), and page counters (`PAGE 01 / 02`) MUST use `font-variant-numeric: tabular-nums`.

---

## 3. Color Tokens (`palette.mjs` Verbatim Output — All 5 Dealt Hands, Light & Dark)

```css
/* ==========================================================================
   DIRECTION 1: COBALT STAGE (seed: hue 239.09 · chroma: balanced · harmony: mono)
   ========================================================================== */
:root,
[data-direction="cobalt-stage"] {
  --neutral-1: #fcfdfd;
  --neutral-2: #f8f9fa;
  --neutral-3: #eef1f3;
  --neutral-4: #e4e8eb;
  --neutral-5: #d9dfe3;
  --neutral-6: #cdd3d8;
  --neutral-7: #bdc5cb;
  --neutral-8: #a3acb3;
  --neutral-9: #9ba6af;
  --neutral-10: #89949c;
  --neutral-11: #5e6469;
  --neutral-12: #2b2e31;
  --accent-1: #fbfdff;
  --accent-2: #f3faff;
  --accent-3: #e3f3ff;
  --accent-4: #d3ecfe;
  --accent-5: #c1e3fc;
  --accent-6: #acd9f8;
  --accent-7: #95cbf1;
  --accent-8: #71b3df;
  --accent-9: #5aaee4;
  --accent-10: #4b9bcd;
  --accent-11: #3c6986;
  --accent-12: #1a3140;
  --accent-on-solid: #060e15;
  --error-3: #ffebe9;
  --error-9: #e1524f;
  --error-11: #974843;
  --success-3: #e0f8e0;
  --success-9: #5ad664;
  --success-11: #337437;
  --warning-3: #f9f0dd;
  --warning-9: #dbb155;
  --warning-11: #76602f;
  --info-3: #e3f3ff;
  --info-9: #5baee5;
  --info-11: #3d6886;
  --background: var(--neutral-1);
  --surface: var(--neutral-2);
  --surface-hover: var(--neutral-3);
  --surface-active: var(--neutral-4);
  --border-subtle: var(--neutral-6);
  --border: var(--neutral-7);
  --border-strong: var(--neutral-8);
  --text-secondary: var(--neutral-11);
  --text: var(--neutral-12);
  --accent-bg-subtle: var(--accent-3);
  --accent-solid: var(--accent-9);
  --accent-solid-hover: var(--accent-10);
  --accent-text: var(--accent-11);
}

[data-direction="cobalt-stage"][data-theme="dark"] {
  --neutral-1: #121313;
  --neutral-2: #191a1a;
  --neutral-3: #202224;
  --neutral-4: #282b2d;
  --neutral-5: #2f3336;
  --neutral-6: #373d41;
  --neutral-7: #434a4f;
  --neutral-8: #596268;
  --neutral-9: #9ba6af;
  --neutral-10: #aeb9c1;
  --neutral-11: #b1b8be;
  --neutral-12: #e4e8ec;
  --accent-1: #101315;
  --accent-2: #151a1e;
  --accent-3: #17242d;
  --accent-4: #182d3a;
  --accent-5: #173649;
  --accent-6: #164059;
  --accent-7: #184e6e;
  --accent-8: #22678f;
  --accent-9: #5aaee4;
  --accent-10: #72c1f5;
  --accent-11: #8fbedf;
  --accent-12: #d2ecff;
  --accent-on-solid: #060e15;
  --error-3: #331a18;
  --error-9: #e1524f;
  --error-11: #f49c95;
  --success-3: #152715;
  --success-9: #5ad664;
  --success-11: #88cb8a;
  --warning-3: #282113;
  --warning-9: #dbb155;
  --warning-11: #cdb482;
  --info-3: #17242d;
  --info-9: #5baee5;
  --info-11: #90bedf;
}

/* ==========================================================================
   DIRECTION 2: SIGNAL MANIFEST (seed: hue 16.6 · chroma: balanced · harmony: mono)
   ========================================================================== */
[data-direction="signal-manifest"] {
  --neutral-1: #fdfcfc;
  --neutral-2: #faf8f8;
  --neutral-3: #f3efef;
  --neutral-4: #ece6e6;
  --neutral-5: #e3dcdc;
  --neutral-6: #d9d0d0;
  --neutral-7: #cbc0c1;
  --neutral-8: #b4a7a7;
  --neutral-9: #948585;
  --neutral-10: #817474;
  --neutral-11: #696161;
  --neutral-12: #312d2d;
  --accent-1: #fffcfc;
  --accent-2: #fff6f6;
  --accent-3: #ffebeb;
  --accent-4: #ffdfdf;
  --accent-5: #ffd1d2;
  --accent-6: #ffbfc1;
  --accent-7: #ffa8ac;
  --accent-8: #f8828a;
  --accent-9: #df5162;
  --accent-10: #c64253;
  --accent-11: #96474e;
  --accent-12: #482023;
  --accent-on-solid: #150a0a;
  --error-3: #ffebe9;
  --error-9: #e1524f;
  --error-11: #974843;
  --success-3: #e0f8e0;
  --success-9: #5ad664;
  --success-11: #337437;
  --warning-3: #f9f0dd;
  --warning-9: #dbb155;
  --warning-11: #76602f;
  --info-3: #e3f3ff;
  --info-9: #5baee5;
  --info-11: #3d6886;
}

[data-direction="signal-manifest"][data-theme="dark"] {
  --neutral-1: #131212;
  --neutral-2: #1a1919;
  --neutral-3: #242121;
  --neutral-4: #2d2929;
  --neutral-5: #363131;
  --neutral-6: #413a3a;
  --neutral-7: #4f4647;
  --neutral-8: #695d5d;
  --neutral-9: #948585;
  --neutral-10: #a69798;
  --neutral-11: #beb5b5;
  --neutral-12: #ece6e6;
  --accent-1: #171111;
  --accent-2: #211617;
  --accent-3: #321a1b;
  --accent-4: #421d20;
  --accent-5: #531f24;
  --accent-6: #652129;
  --accent-7: #7d2631;
  --accent-8: #a23443;
  --accent-9: #df5162;
  --accent-10: #f16976;
  --accent-11: #f39ba0;
  --accent-12: #ffdfdf;
  --accent-on-solid: #150a0a;
}

/* ==========================================================================
   DIRECTION 3: CUTTING LEDGER (seed: hue 154.11 · chroma: muted · harmony: mono)
   ========================================================================== */
[data-direction="cutting-ledger"] {
  --neutral-1: #fcfdfc;
  --neutral-2: #f8f9f8;
  --neutral-3: #eef1ef;
  --neutral-4: #e5e9e6;
  --neutral-5: #dae0dc;
  --neutral-6: #cdd4cf;
  --neutral-7: #bec6c0;
  --neutral-8: #a4aea7;
  --neutral-9: #afbbb2;
  --neutral-10: #9da8a0;
  --neutral-11: #5f6560;
  --neutral-12: #2b2f2c;
  --accent-1: #fafefb;
  --accent-2: #f4fbf6;
  --accent-3: #e6f5ea;
  --accent-4: #d9eede;
  --accent-5: #c9e7d1;
  --accent-6: #b7dec2;
  --accent-7: #a2d1b0;
  --accent-8: #82ba94;
  --accent-9: #84ca9b;
  --accent-10: #74b68a;
  --accent-11: #486d54;
  --accent-12: #203326;
  --accent-on-solid: #071009;
  --error-3: #ffebe9;
  --error-9: #c56c65;
  --error-11: #86534f;
  --success-3: #e6f6e6;
  --success-9: #84cc86;
  --success-11: #486e49;
  --warning-3: #f6f0e4;
  --warning-9: #ceb47e;
  --warning-11: #6f6144;
  --info-3: #e7f2fa;
  --info-9: #7aabce;
  --info-11: #4c677a;
}

[data-direction="cutting-ledger"][data-theme="dark"] {
  --neutral-1: #121312;
  --neutral-2: #191a19;
  --neutral-3: #212321;
  --neutral-4: #282b29;
  --neutral-5: #2f3430;
  --neutral-6: #383d39;
  --neutral-7: #444b46;
  --neutral-8: #5a635d;
  --neutral-9: #afbbb2;
  --neutral-10: #c2cec5;
  --neutral-11: #b2b9b4;
  --neutral-12: #e5e9e6;
  --accent-1: #111311;
  --accent-2: #161b17;
  --accent-3: #1a251d;
  --accent-4: #1e2f23;
  --accent-5: #203928;
  --accent-6: #23442e;
  --accent-7: #295438;
  --accent-8: #386e4b;
  --accent-9: #84ca9b;
  --accent-10: #9addaf;
  --accent-11: #9bc3a6;
  --accent-12: #d7efde;
  --accent-on-solid: #071009;
}

/* ==========================================================================
   DIRECTION 4: THERMAL MODULAR (seed: hue 291.62 · chroma: muted · harmony: mono)
   ========================================================================== */
[data-direction="thermal-modular"] {
  --neutral-1: #fdfdfd;
  --neutral-2: #f9f8fa;
  --neutral-3: #f0f0f3;
  --neutral-4: #e8e7eb;
  --neutral-5: #dedde3;
  --neutral-6: #d2d1d9;
  --neutral-7: #c3c2cb;
  --neutral-8: #aba9b4;
  --neutral-9: #696773;
  --neutral-10: #585661;
  --neutral-11: #636269;
  --neutral-12: #2e2d31;
  --accent-1: #fdfcff;
  --accent-2: #f9f8ff;
  --accent-3: #f0eeff;
  --accent-4: #e8e4ff;
  --accent-5: #ded8ff;
  --accent-6: #d2caff;
  --accent-7: #c4baf9;
  --accent-8: #ac9ee9;
  --accent-9: #6b58ad;
  --accent-10: #5a4897;
  --accent-11: #645b8d;
  --accent-12: #2e2943;
  --accent-on-solid: #faf9ff;
}

[data-direction="thermal-modular"][data-theme="dark"] {
  --neutral-1: #131313;
  --neutral-2: #19191a;
  --neutral-3: #222224;
  --neutral-4: #2a2a2d;
  --neutral-5: #323236;
  --neutral-6: #3c3b41;
  --neutral-7: #49484f;
  --neutral-8: #605f68;
  --neutral-9: #696773;
  --neutral-10: #7a7984;
  --neutral-11: #b7b6be;
  --neutral-12: #e8e7ec;
  --accent-1: #131216;
  --accent-2: #19181f;
  --accent-3: #22202f;
  --accent-4: #2a263d;
  --accent-5: #332d4d;
  --accent-6: #3d345f;
  --accent-7: #4a3f75;
  --accent-8: #625498;
  --accent-9: #6b58ad;
  --accent-10: #7c6bbe;
  --accent-11: #b8afe6;
  --accent-12: #e8e4ff;
  --accent-on-solid: #faf9ff;
}

/* ==========================================================================
   DIRECTION 5: KRAFT PRESS (seed: hue 69.12 · chroma: balanced · harmony: analogous)
   ========================================================================== */
[data-direction="kraft-press"] {
  --neutral-1: #fdfdfc;
  --neutral-2: #f9f8f7;
  --neutral-3: #f2f0ee;
  --neutral-4: #eae7e4;
  --neutral-5: #e1ddd8;
  --neutral-6: #d7d1cb;
  --neutral-7: #c9c2bb;
  --neutral-8: #b1a9a1;
  --neutral-9: #bfb6ab;
  --neutral-10: #aca399;
  --neutral-11: #67625d;
  --neutral-12: #302d2a;
  --accent-1: #fffcf9;
  --accent-2: #fef8f0;
  --accent-3: #fdeede;
  --accent-4: #f9e4cd;
  --accent-5: #f5d9b9;
  --accent-6: #f0cba3;
  --accent-7: #e6bb8a;
  --accent-8: #d3a065;
  --accent-9: #e9a95e;
  --accent-10: #d29750;
  --accent-11: #7e5c34;
  --accent-12: #3b2a16;
  --accent-on-solid: #130c05;
  --orange-3: #ffece5;
  --orange-9: #e0704a;
  --orange-11: #8e503b;
  --orange-on-solid: #150a07;
  --yellow-3: #f5f1dc;
  --yellow-9: #cbb850;
  --yellow-11: #6e642d;
  --yellow-on-solid: #0f0d04;
}

[data-direction="kraft-press"][data-theme="dark"] {
  --neutral-1: #131312;
  --neutral-2: #1a1919;
  --neutral-3: #232220;
  --neutral-4: #2c2a27;
  --neutral-5: #35322e;
  --neutral-6: #3f3b36;
  --neutral-7: #4e4842;
  --neutral-8: #665f58;
  --neutral-9: #bfb6ab;
  --neutral-10: #d2c9bf;
  --neutral-11: #bcb6b0;
  --neutral-12: #ebe7e3;
  --accent-1: #15120f;
  --accent-2: #1d1914;
  --accent-3: #2a2014;
  --accent-4: #362714;
  --accent-5: #442d12;
  --accent-6: #52350e;
  --accent-7: #65400d;
  --accent-8: #845515;
  --accent-9: #e9a95e;
  --accent-10: #fbbd76;
  --accent-11: #d6b086;
  --accent-12: #fbe4cb;
  --accent-on-solid: #130c05;
  --orange-3: #301d16;
  --orange-9: #e0704a;
  --orange-11: #eaa48d;
  --orange-on-solid: #150a07;
  --yellow-3: #252213;
  --yellow-9: #cbb850;
  --yellow-11: #c3b980;
  --yellow-on-solid: #0f0d04;
}
```

### Contrast Verification Summary (WCAG 2.x from `palette.mjs`)
- **Direction 1 (Cobalt Stage)**: `[light]` `neutral-12` on `neutral-2` `12.9:1`, `accent-on-solid` on `accent-9` `7.94:1`; `[dark]` `14.27:1` / `7.94:1` (**PASS AA & AAA**).
- **Direction 2 (Signal Manifest)**: `[light]` `neutral-12` on `neutral-2` `12.94:1`, `accent-on-solid` on `accent-9` `5.1:1`; `[dark]` `14.23:1` / `5.1:1` (**PASS AA & AAA**).
- **Direction 3 (Cutting Ledger)**: `[light]` `neutral-12` on `neutral-2` `12.88:1`, `accent-on-solid` on `accent-9` `10.06:1`; `[dark]` `14.28:1` / `10.06:1` (**PASS AA & AAA**).
- **Direction 4 (Thermal Modular)**: `[light]` `neutral-12` on `neutral-2` `12.92:1`, `accent-on-solid` on `accent-9` `5.53:1`; `[dark]` `14.24:1` / `5.53:1` (**PASS AA & AAA**).
- **Direction 5 (Kraft Press)**: `[light]` `neutral-12` on `neutral-2` `12.92:1`, `accent-on-solid` on `accent-9` `9.52:1`; `[dark]` `14.25:1` / `9.52:1` (**PASS AA & AAA**).

---

## 4. Custom SVG Brand Mark & Favicon Candidates (6 Concepts)

All 6 marks must be authored as clean, scalable vector SVGs (`viewBox="0 0 64 64"`) using CSS custom-property tokens (`var(--text)`, `var(--accent-solid)`, `var(--surface)`) so they adapt across light, dark, and 1-bit monochrome thermal contexts:

1. **Mark 01 — "The Registration Cut" (`logo-registration`)**:
   - Four outer L-shaped crop registration brackets framing a central `2:3` (`4×6`) label rectangle, bisected by a high-contrast diagonal laser-crop line and 4 vertical barcode bars.
2. **Mark 02 — "The Peeled Thermal Corner" (`logo-peel`)**:
   - A vertical `4×6` thermal label sheet with its top-right corner physically curled/peeled back at 45°, exposing a dotted silicone liner pattern underneath and a crisp shipping barcode on the label face.
3. **Mark 03 — "The Rotary Blade & Parcel Tag" (`logo-rotary`)**:
   - A chamfered shipping tag with a reinforced eyelet hole, actively sliced along a dotted perforation line by a circular precision rotary cutter disc.
4. **Mark 04 — "The Thermal Roll Feed" (`logo-roll`)**:
   - An architectural side-meets-front silhouette of a continuous thermal label roll feeding a freshly detached 4×6 label across a serrated tear-bar.
5. **Mark 05 — "CTL Freight Stencil Stamp" (`logo-stencil`)**:
   - A bold industrial box-certification stamp with notched stencil letterforms `C·T·L` above a `4×6 IN` micro-spec rule inside a heavy rectangular border.
6. **Mark 06 — "Sliced Monogram Frame" (`logo-sliced`)**:
   - An ultra-minimal Swiss geometric `C` and `L` interlocking to form a `2:3` label proportion, offset across a horizontal razor-cut gap.

---

## 5. Never (Anti-Defaults & AI-Tells Banned for This Project)

- **NEVER** use `Inter`, `Roboto`, `Open Sans`, `Arial`, or `Space Grotesk`.
- **NEVER** use the default Tailwind indigo/violet/purple triplet (`#4f46e5`, `#6366f1`, `#8b5cf6`, `#a855f7`) or default `slate-50` (`#f8fafc`).
- **NEVER** nest rounded cards inside rounded cards (`nested-cards` rule in `detect.mjs`). Use hairline borders, split panes, or ruled ledger rows instead.
- **NEVER** use uniform `0.08–0.12` alpha blurred drop-shadows across elements. Use either zero shadow (hairline architectural grids), hue-tinted stage elevation on the single 4×6 label sheet, or the hard `4px 4px 0` ink offset shadow (in Direction 5).
- **NEVER** use a stock Lucide `<Scissors />` icon inside a rounded square as the brand logo.
- **NEVER** use raw hex/rgb literals in component CSS rules—every color property must reference `:root` CSS custom properties from `palette.mjs`.
