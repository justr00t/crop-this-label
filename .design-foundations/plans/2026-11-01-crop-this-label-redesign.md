# Phased Design Plan: Crop This Label Full Redesign & Logo Exploration

**Date:** 2026-11-01
**Project:** Crop This Label (`crop-this-label`)
**Research Brief:** `.design-foundations/research/2026-11-01-crop-this-label-redesign.md`
**Dealer Seed:** `crop-this-label|2026-11-01|0` (`.design-foundations/used-dna.json`)

---

## 1. Dealt Design DNA Candidates (`dealer.mjs` + `palette.mjs`)

Because the user requested visual mockups of all major aesthetic directions before locking the final production theme, all 5 mechanically dealt hands from `dealer.mjs` are preserved below with contrast-verified `palette.mjs` token sets. In **Stage 3 (`mock`)**, `mocks/workbench-directions.html` will allow live switching across these directions and across all 6 custom SVG logo concepts (`mocks/logo-options.html`).

---

### Candidate 1: "Cobalt Stage" (Precision Studio / Split-Stage Workbench)
```
GROUNDING   Rollo Thermal Printer's 4×6 label calibration feed + Teenage Engineering TP-7's aluminum/cobalt inspection split-stage
Produces a high-precision technical inspection bench where the 4×6 thermal label sits on a calibrated dark/light split stage framed by architectural crop brackets.

TYPE        Archivo (600/700 tight-tracked display) over Archivo (400/500 body) & IBM Plex Mono (tabular dimension/confidence telemetry)
COLOR       seed blue (239.09°) · cool technical paper/slate grounds · monochromatic harmony · swatches: #fcfdfd #eef1f3 #5aaee4 #3c6986 #2b2e31 (dark: #121313 #191a1a #5aaee4)
COMPOSITION <dealt> — Data-Dense Professional + Split Stage (variance 6, hard asymmetric 38/62 vertical split) · justification: Separates compact document intake/candidate telemetry (38% left pane) from an expansive, unobstructed 4×6 label inspection stage (62% right pane).
MOTION      State-change only, 120ms sharp ease-out; instant 90°/180° canvas rotation snaps.
REGISTER    Product workbench structure · expressive at: (1) 4×6 stage corner registration brackets, (2) live scan progress bar, (3) candidate confidence strip.
DNA         Data-Dense Professional + borrowed signature scale from Editorial Minimalism · dominant: composition (Split Stage)
SIGNATURE   oversize-punctuation — Display-scale `[` and `]` registration brackets (64px–80px) act as structural crop frames around the 4×6 label stage.
```
**Critique Verdict:**
- **Distinctiveness**: Escapes generic SaaS card grids by eliminating cards in favor of a hard 38/62 architectural split pane and oversized typographic crop brackets (`[` `]`). Nearest cluster risk: generic dev tool — mitigated by physical `4.00" × 6.00"` print calibration marks.
- **Register fit**: High alignment with power shippers who want a fast, zero-fluff inspection bench.
- **Tells scan**: 0 hits (`Archivo` + `IBM Plex Mono` avoids `Inter`/`Space Grotesk`; `#5aaee4` steel-cobalt on `#fcfdfd`/`#121313` avoids purple-indigo `#6366f1` and cyan-on-dark neon clichés; zero nested cards).

---

### Candidate 2: "Signal Manifest" (Tactile Industrial & Postal Utility)
```
GROUNDING   Swiss Post (Die Post) waybill hairline grid typography + Uline Industrial Freight Tag high-visibility signal-red/orange stamp marks
Produces an authentic postal manifest surface where every control reads like a precision freight instrument on warm paper stock.

TYPE        Instrument Sans (600/700 grotesque display) over Instrument Sans (400/500 body) & JetBrains Mono (box-drawing borders & manifest codes)
COLOR       seed orange/signal-red (16.6°) · warm manifest paper (#fdfcfc / #f3efef) · monochromatic harmony · swatches: #fdfcfc #f3efef #df5162 #96474e #312d2d (dark: #131212 #1a1919 #df5162)
COMPOSITION <dealt> — Swiss / International + Fractured Grid (variance 9, overlapping manifest layers with open counter-space) · justification: Treats the source 8.5×11 PDF sheet and the extracted 4×6 thermal label as two physical paper layers colliding at an asymmetric angle with exposed spec headers.
MOTION      100ms linear mechanical snaps; stamp-like active states.
REGISTER    Restrained Swiss postal grid · expressive at: (1) box-drawing manifest headers, (2) signal-red/orange print CTA stamp, (3) overlapping source-to-crop layer transition.
DNA         Swiss / International + borrowed box-drawing structure from Terminal / Mono-Core · dominant: composition & signature
SIGNATURE   box-drawing-borders — Structural manifest headers and telemetry rows use exposed Unicode box-drawing rules (`┌── FORM 4X6-THERMAL ──┐`, `├─ DPI: 300 ─┼─ 1200×1800 PX ─┤`).
```
**Critique Verdict:**
- **Distinctiveness**: Unmistakably tied to physical shipping manifests and thermal waybills; could never be mistaken for a generic AI template.
- **Register fit**: Turns a mundane utility into an authoritative postal instrument; expressive moments land directly on the label extraction and print action.
- **Tells scan**: 0 hits (zero border-radius, exposed hairlines + box-drawing rules, `#df5162` signal stamp hue).

---

### Candidate 3: "Cutting Ledger" (Self-Healing Rotary Mat & Physical Ruler)
```
GROUNDING   Olfa Self-Healing Rotary Cutting Mat (sage measurement grid) + USPS PS Form 3800 Certified Mail Receipt columnar ruled ledger
Produces a craft-table workspace where the 4×6 label rests directly against a physical inch/pixel ruler on a muted sage cutting-mat ledger.

TYPE        Fraunces (600 optical display) over Karla (400/500 humanist body) & IBM Plex Mono (inch/pixel ruler ticks)
COLOR       seed green (154.11°, muted cutting-mat sage) · ruled ledger paper (#fcfdfc / #eef1ef) · monochromatic harmony · swatches: #fcfdfc #eef1ef #84ca9b #486d54 #2b2f2c (dark: #121312 #191a19 #84ca9b)
COMPOSITION <dealt> — Organic / Natural + Ledger Grid (variance 2, columnar ruled paper where hairlines structure everything) · justification: Green/sage is explicitly justified by the physical self-healing rotary cutting mat metaphor ("Crop This Label"); the ledger grid replaces all cards with ruled tabular rows.
MOTION      200ms smooth ease-out; ruler tick highlight when label locks to 4×6 aspect ratio.
REGISTER    Calm ruled ledger · expressive at: (1) vertical 0"–6" baseline ruler along the label edge, (2) tactile Fraunces header, (3) local-privacy verification stamp.
DNA         Organic / Natural + borrowed tabular precision from Data-Dense Professional · dominant: signature (baseline-ruler)
SIGNATURE   baseline-ruler — A visible 0.0" to 6.0" (0px to 1800px) graduated baseline ruler runs down the left edge of the stage and the cropped 4×6 label sits directly on its ticks.
```
**Critique Verdict:**
- **Distinctiveness**: The physical `0" … 6"` cutting-mat ruler along the label edge makes the product's name (*Crop This Label*) literal and memorable.
- **Register fit**: Warm, reassuring, and tactile for both home-office and craft sellers.
- **Tells scan**: 0 hits (passes the Green/Lime guard via explicit physical rotary-cutting-mat content cue; muted chroma `#486d54`/`#84ca9b` avoids neon acid-green tells).

---

### Candidate 4: "Thermal Modular" (Stark Swiss / Thermal Hairline Grid)
```
GROUNDING   Zebra ZP450 Direct Thermal calibration test print + 1970s Vignelli Postal Modular Manual flush-left hairline grid
Produces a zero-container Swiss modular sheet where stark black-and-white thermal contrast meets a single ultraviolet verification-ink accent.

TYPE        Unbounded (700 extended display) over Instrument Sans (400/500 body) & JetBrains Mono (metadata)
COLOR       seed violet (291.62°, muted archival UV stamp ink) · stark thermal paper (#fdfdfd / #f0f0f3) · monochromatic harmony · swatches: #fdfdfd #f0f0f3 #6b58ad #645b8d #2e2d31 (dark: #131313 #19191a #6b58ad)
COMPOSITION <dealt> — Retro-Futurist + Swiss Modular (variance 3, flush-left rag-right on exposed 1px solid hairline dividers, zero containers) · justification: Mirrors the geometry of a printed 4×6 shipping label itself—divided into functional zones by crisp black hairlines with zero decorative cards.
MOTION      120ms crisp state switches; chamfered tag hover shifts.
REGISTER    Stark Swiss modular grid · expressive at: (1) extended Unbounded masthead, (2) chamfered shipping-tag polygon mask on previews, (3) 1-bit barcode divider strip.
DNA         Retro-Futurist + borrowed zero-container grid from Swiss / International · dominant: type voice & modular hairlines
SIGNATURE   logo-polygon-mask — Source previews and status badges are masked to a 45° chamfered shipping-tag polygon (`polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)`) derived from the brand mark.
```
**Critique Verdict:**
- **Distinctiveness**: Extended `Unbounded` display typography + zero-card exposed thermal hairlines + chamfered shipping-tag polygon masks create sharp industrial authority.
- **Register fit**: Clean, fast, and scannable.
- **Tells scan**: Caution on Hue 291.62° (`#6b58ad` muted archival violet): while generated at muted chroma by `palette.mjs` (not the banned `#6366f1`/`#8b5cf6` neon indigo-purple triplet), it sits in the violet band, so thermal ink (`#2e2d31`) dominates 90% of the surface with `#6b58ad` restricted strictly to the UV verification stamp and active focus ring.

---

### Candidate 5: "Kraft Press" (Warm Seller / Kraft-Paper Parcel Craft)
```
GROUNDING   PirateShip / Gumroad creator-seller warmth + Corrugated Cardboard Box Certificate Stamp bold ink borders and kraft-amber palette
Produces an approachable, tactile parcel-packing station built for everyday Poshmark, eBay, Depop, and Etsy sellers.

TYPE        Bricolage Grotesque (700/800 expressive display) over DM Sans (400/500 friendly body) & IBM Plex Mono (parcel specs)
COLOR       seed amber (69.12°, kraft parcel tape) · warm kraft paper (#fdfdfc / #f2f0ee) · analogous harmony (kraft amber #e9a95e + parcel-sticker orange #e0704a + manila yellow #cbb850) · swatches: #fdfdfc #f2f0ee #e9a95e #e0704a #302d2a
COMPOSITION <dealt> — Playful Geometric + Monolith Center (variance 1, single commanding centered parcel-stage monolith on a warm unbroken field) · justification: Focuses the entire viewport on a single tactile "shipping station" monolith with zero split-pane complexity for casual sellers.
MOTION      180ms tactile press physics — buttons and stage shift `translate(2px, 2px)` into their hard ink shadow on press.
REGISTER    Friendly tactile product structure · expressive at: (1) hard 4px ink offset shadows, (2) kraft-amber & fragile-orange stamp badges, (3) celebratory 4×6 label reveal.
DNA         Playful Geometric + borrowed hard ink borders from Neo-Brutalist · dominant: signature (hard-offset-shadow) & warm kraft color strategy
SIGNATURE   hard-offset-shadow — All interactive elements and the central 4×6 frame share one hard `4px 4px 0px var(--neutral-12)` ink offset shadow that shifts physically on press.
```
**Critique Verdict:**
- **Distinctiveness**: Warm corrugated-kraft neutrals (`#f2f0ee`), packing-tape amber (`#e9a95e`), and hard `4px` ink offset shadows feel like physical packaging rather than software.
- **Register fit**: Ideal for solo resellers (Poshmark/eBay/Etsy) who want a friendly, tactile tool that puts a smile on their face during packing runs.
- **Tells scan**: 0 hits (avoids soft 0.1-opacity shadows in favor of a single structural `4px` hard ink shadow; warm analogous kraft palette; `Bricolage Grotesque` + `DM Sans`).

---

## 2. Primary Token Block (`palette.mjs` Verbatim Output)

All 5 contrast-verified `palette.mjs` CSS custom-property blocks (Light + Dark schemes) will be embedded in `DESIGN.md` and `mocks/workbench-directions.html` so the user can toggle between all 5 directions live. Below is the baseline default token block (**Candidate 2: "Signal Manifest"** + **Candidate 1: "Cobalt Stage"** + **Candidate 3: "Cutting Ledger"** + **Candidate 5: "Kraft Press"**):

```css
/* Candidate 2 ("Signal Manifest" — Seed 16.6° Signal Red-Orange, Balanced, Mono) */
:root, [data-direction="signal-manifest"] {
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
```

---

## 3. Dependency-Ordered Phase Breakdown (DAG)

| Phase | Name | Depends On | Primary Deliverables | Gate |
|---|---|---|---|---|
| **Phase 1** | **Journey, IA & Multi-State Workbench Spec** | Stage 1 Brief | `JOURNEY.md` | `design-review-agent` PASS |
| **Phase 2** | **Visual DNA, Token System & Logo Spec** | Phase 1 | `DESIGN.md` | `design-review-agent` PASS |
| **Stage 3 (Mock Gate)** | **Interactive Logo Sheet & Multi-Direction Workbench Mockups** | Phase 1 & 2 | `mocks/logo-options.html`, `mocks/workbench-directions.html` | `design-review-agent` PASS + **User Sign-Off Gate (Pick Winning Direction & Logo)** |
| **Phase 3** | **Selected SVG Brand Mark, Favicon & Design System CSS Tokens** | Stage 3 Sign-Off | `public/favicon.svg`, `src/components/BrandLogo.jsx`, `src/index.css`, `index.html` | `design-review-agent` PASS |
| **Phase 4** | **Production React Workbench Rebuild & UX Upgrades** | Phase 3 | `src/App.jsx`, `src/App.css` | `design-review-agent` PASS |

---

### Phase 1: Journey, IA & Multi-State Workbench Spec (`JOURNEY.md`)
- **Goal**: Define the Jobs-To-Be-Done, user flow state matrix (`loading`, `ready`, `processing`, `success` single/multi-candidate, `error`), keyboard/drag-and-drop/clipboard intake, and exact page/component specs in `JOURNEY.md`.
- **Deliverables**: `JOURNEY.md`
- **Doctrine**: `[journey, usability, content-design]`
- **Verification Criteria**:
  1. `JOURNEY.md` contains JTBD job stories for high-frequency thermal label shippers, a complete state matrix (`loading`, `ready`, `processing`, `success`, `error`), and detailed Page Specs for the Workbench and the Logo Explorer.
  2. Specifies the UX upgrades: window-wide drag-and-drop + `Ctrl+V` clipboard paste, visual multi-candidate switcher (replacing `"Match #1 (Wrong? Click me)"`), and true `4" × 6"` (`1200×1800 px`) print-scale preview framing.
  3. Microcopy follows `content-design` doctrine (zero AI-tell buzzwords, clear technical feedback, humane error recovery).

### Phase 2: Visual DNA, Token System & Logo Spec (`DESIGN.md`)
- **Goal**: Lock the governance artifact `DESIGN.md` containing the dealt DNA candidates, verbatim `palette.mjs` CSS custom properties (light + dark), typography scales, spacing/border systems, and specifications for the 6 custom SVG logo concepts.
- **Deliverables**: `DESIGN.md`
- **Doctrine**: `[design-dna, archetypes, foundations, color, fonts, design-systems, ai-tells]`
- **Verification Criteria**:
  1. `DESIGN.md` includes the complete verbatim `palette.mjs` token blocks and WCAG contrast reports for the dealt directions.
  2. Explicitly bans all cataloged AI tells (`Inter`/`Roboto`/`Space Grotesk`, `#4f46e5`/`#6366f1` indigo-purple triplet, nested cards, uniform `0.1` opacity shadows, stock Lucide scissors logo).
  3. Specifies construction geometry and evaluation criteria for all 6 SVG logo candidates across Geometric/Registration, Tactile/Peeled-Label, and Typographic/Stencil families.

### Stage 3 (Mock Gate): Interactive Logo Sheet & Multi-Direction Workbench Mockups
- **Goal**: Render self-contained HTML prototypes for both the **6-Concept Logo Mockup Sheet** (`mocks/logo-options.html`) and the **Multi-Direction Interactive Workbench** (`mocks/workbench-directions.html`) so the user can visually compare all aesthetic directions and logo options in the browser and pick their winners before React code is touched.
- **Deliverables**: `mocks/logo-options.html`, `mocks/workbench-directions.html`
- **Doctrine**: `[design-dna, color, fonts, usability, content-design, ai-tells]` (plus `skills/prototype/SKILL.md` and `skills/prototype/references/mock-recipe.md`)
- **Verification Criteria**:
  1. `mocks/logo-options.html` renders 6 bespoke, original SVG logo concepts (Registration Cut, Peeled Thermal Corner, Rotary Blade & Tag, Thermal Roll Feed, CTL Stencil Stamp, Sliced Wordmark) shown in navbar lockup, `64px`/`32px`/`16px` favicon scale, dark/light surfaces, and 1-bit thermal monochrome test.
  2. `mocks/workbench-directions.html` renders the complete Crop This Label workbench with an interactive switcher for the dealt visual directions (`Cobalt Stage`, `Signal Manifest`, `Cutting Ledger`, `Thermal Modular`, `Kraft Press`), interactive state switcher (`ready`, `processing`, `success` with multi-candidate strip, `error`), light/dark toggle, and live navbar logo switcher (`Logo 1..6`).
  3. Zero raw hexes in component rules (100% CSS custom properties from `palette.mjs`), Google Fonts `<link>` loaded, and `0` errors from `scripts/detect.mjs`.

### Phase 3: Selected SVG Brand Mark, Favicon & Design System CSS Tokens
- **Goal**: Implement the user's chosen aesthetic direction tokens, Google Fonts links, and chosen custom SVG logo + favicon into the Vite/React foundation (`index.html`, `public/favicon.svg`, `src/index.css`, `src/components/BrandLogo.jsx`).
- **Deliverables**: `public/favicon.svg`, `src/components/BrandLogo.jsx`, `src/index.css`, `index.html`
- **Doctrine**: `[design-dna, color, fonts, design-systems, ai-tells]`
- **Verification Criteria**:
  1. `src/index.css` defines the locked `:root` and `[data-theme="dark"]` CSS custom properties from `DESIGN.md` with zero default Tailwind indigo/slate bleed.
  2. `public/favicon.svg` and `src/components/BrandLogo.jsx` implement the user-selected SVG logo mark with crisp geometry at both `16×16` favicon and header lockup scales.
  3. `index.html` loads the selected Google Fonts (`<link>`) and updated page metadata.

### Phase 4: Production React Workbench Rebuild & UX Upgrades
- **Goal**: Rebuild `src/App.jsx` (and `src/App.css`) to match the approved Stage 3 mockup, integrating the UX upgrades (window drag-and-drop, `Ctrl+V` clipboard paste, visual multi-candidate thumbnail/confidence switcher, 4×6 physical dimension calibration stage) while preserving 100% of the local ONNX Web Worker + `pdf.js` inference and 4×6 print/download functionality.
- **Deliverables**: `src/App.jsx`, `src/App.css`
- **Doctrine**: `[usability, content-design, interaction, responsive, ai-tells]`
- **Verification Criteria**:
  1. Preserves intact `WORKER_CODE` ONNX inference, `pdf.js` multi-page rendering, `1200×1800` crop/auto-landscape rotation math, `@page { size: 4in 6in }` print dialog, and PNG download.
  2. Adds window-wide drag-and-drop, `Ctrl+V` paste handler, and visual candidate switcher showing candidate index, confidence %, and page number.
  3. `npm run build` succeeds with zero errors, and `design-review-agent` (Assessment A + Assessment B) returns `VERDICT: PASS`.
