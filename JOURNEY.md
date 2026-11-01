# JOURNEY.md — Crop This Label

**Date:** 2026-11-01 · **Status:** confirmed
**Project:** Crop This Label (`crop-this-label`)
**Primary Surface:** Responsive Desktop & Mobile Web Workbench (100% Client-Side AI Label Extractor)

---

## 1. Jobs To Be Done (JTBD) & Emotional Arc

### Primary Job Story
> **When** I download a full-page 8.5"×11" shipping label PDF or screenshot from USPS, UPS, FedEx, Poshmark, eBay, Mercari, Depop, or PirateShip,
> **I want to** drop or paste it into my browser and immediately get a cleanly cropped, properly oriented `4" × 6"` (`1200×1800 px`) thermal label without uploading customer addresses to a cloud server,
> **So I can** print directly to my 4×6 thermal printer (or save the PNG) in under 5 seconds and move on to packing my next order.

### Secondary Job Story (Multi-Label / Multi-Page PDFs)
> **When** my PDF has multiple pages (e.g., packing slip + instructions + shipping label, or a batch of labels) or the AI detects more than one candidate region,
> **I want to** see all detected candidates with their page number and confidence score in a visual strip,
> **So I can** pick the exact label I need without clicking a blind "Wrong? Click me" button.

### Emotional Arc Across the Session
| Stage | User State | Target Feeling | Design Response |
|---|---|---|---|
| **1. Arrival / Ready** | Holding a PDF/screenshot, wants speed & privacy | **Instant clarity & trust** | Zero marketing fluff; immediate intake dropzone + `Ctrl+V` clipboard cue + unmistakable local-WASM privacy verification stamp. |
| **2. Intake & AI Scan** | Waiting 0.5s–2s for PDF render + ONNX inference | **Technical confidence** | Page-by-page telemetry (`SCANNING PAGE 1 OF 2 · ONNX WASM`) over the source document preview. |
| **3. 4×6 Lock-In** | Inspecting the cropped thermal label | **Tactile precision & relief** | The 4×6 label snaps onto a calibrated `2:3` (`4.00" × 6.00"` / `1200×1800 px`) inspection stage with physical dimension callouts, candidate strip, and 90°/180° orientation tools. |
| **4. Print / Export** | Sending to thermal printer or saving file | **Effortless completion** | Co-ranked **Print 4×6** and **Download PNG** primary actions + one-keystroke or one-click reset for the next parcel. |

---

## 2. Information Architecture & Sitemap

**Crop This Label** is a focused, single-screen utility workbench (`/`). There are no multi-page marketing funnels or login walls.

```
[Top Instrument Bar / Header]
 ├── Brand Mark + Wordmark ("Crop This Label" · "4×6 Thermal AI Extractor")
 ├── Local WASM Engine Status Badge ("100% Local · Zero Server Uploads · ONNX Ready")
 └── Support / Buy Me a Coffee Action ("Support Tool")

[Primary Workbench Stage — Asymmetric 2-Zone Layout or Central Station]
 ├── Zone A: Source Document & Intake Control (38% width on desktop Split-Stage)
 │    ├── File Dropzone / Click-to-Upload / Window-wide Drag & Ctrl+V Paste Target
 │    ├── Source Document Preview (shows full 8.5×11 page with detected bounding-box highlight)
 │    ├── Multi-Candidate Selector Strip (when ≥2 detections exist: Candidate #1 [96% · P1], #2 [81% · P2])
 │    └── Source Reset / Upload New File Action
 │
 └── Zone B: Calibrated 4×6 Thermal Label Output Stage (62% width on desktop Split-Stage)
      ├── Stage Header: Output Telemetry ("4.00 × 6.00 IN · 1200 × 1800 PX · 300 DPI THERMAL")
      ├── Calibrated 2:3 Label Inspection Frame (with signature brackets / ruler / manifest borders)
      ├── Orientation & Transform Bar: [Rotate 90° CW] · [Flip 180°] · [Reset]
      └── Primary Completion Bar: [Print 4×6 Label] (Secondary/Co-Primary) + [Download 4×6 PNG] (Primary CTA)
```

---

## 3. State Matrix (Mandatory Reachable States)

Every view and mock must support and clearly differentiate all 4 operational states:

| State ID (`data-state`) | Trigger | Zone A (Intake / Source) | Zone B (4×6 Output Stage) | Primary Action |
|---|---|---|---|---|
| **`loading`** | Initial page load while `label-model.onnx` & `pdf.js` initialize | Dropzone disabled with `"Initializing local ONNX vision model…"` status indicator | Calibrated empty 4×6 stage wireframe | Wait (~1s) |
| **`ready`** *(Default Empty)* | Model & `pdf.js` loaded; no file uploaded yet | Active dropzone: `"Drop PDF or image anywhere, click to browse, or press Ctrl+V"` + supported format chips (`PDF`, `PNG`, `JPG`, `WEBP`) | Calibrated empty 4×6 blueprint/stage showing physical `4.00" × 6.00"` guides and `"Awaiting source document"` | Upload / Drop / Paste file |
| **`processing`** | File selected/dropped/pasted; `pdf.js` rendering + ONNX worker running | Source page preview visible with technical scan overlay: `"Scanning page X of Y…"` | Stage displays active calibration state | Automatic transition to `success` or `error` |
| **`success`** | ≥1 shipping label bounding box detected & cropped to `1200×1800` | Compact source sheet preview showing where the label was found + **"Upload New"** button + **Candidate Switcher Strip** (if `allDetections.length > 1`) | High-contrast 4×6 cropped thermal label on calibrated stage + active `[Rotate 90°]`, `[Flip 180°]` tools | **Download 4×6 PNG** or **Print 4×6** |
| **`error`** | 0 bounding boxes above `0.15` confidence threshold or unreadable file | Diagnostic callout: `"No 4×6 shipping label detected in this file"` with clear explanation (check contrast/resolution or try another page) | Stage shows diagnostic empty state | **Try Another File / Reset** |

---

## 4. Microcopy & Content Design Specification (`content-design`)

- **Voice & Tone**: Crisp, utilitarian, trustworthy, and tactile—like a precision postal scale or thermal printer manual. Zero AI-slop buzzwords (no *"Unleash the power of AI"*, no *"Seamlessly streamline your workflow"*, no em-dash overuse).
- **Key Copy Strings**:
  - **Masthead Tagline**: `4×6 THERMAL LABEL EXTRACTOR`
  - **Privacy Badge**: `LOCAL ONNX ENGINE · FILES NEVER LEAVE YOUR BROWSER`
  - **Dropzone Headline (`ready`)**: `Drop carrier PDF or label image`
  - **Dropzone Subcopy (`ready`)**: `Or click to browse · Press Ctrl+V to paste from clipboard · Multi-page PDF, PNG, JPG, WEBP`
  - **Candidate Strip Label (`success`)**: `DETECTED CANDIDATES (3) — SELECT REGION:` → `#1 · 98% CONF · PAGE 1` / `#2 · 74% CONF · PAGE 2`
  - **Output Stage Spec**: `4.00" × 6.00" THERMAL STANDARD · 1200 × 1800 PX · AUTO-ORIENTED`
  - **Error Headline (`error`)**: `No shipping label region detected`
  - **Error Subcopy (`error`)**: `The local vision model scanned all pages but found no bounding box above 15% confidence. Ensure the barcode and address block are visible, then upload another file.`

---

## 5. Page Specs

### Page Spec 1: `mocks/workbench-directions.html` & Production Workbench (`src/App.jsx`)
- **Purpose**: Primary application workbench for extracting, inspecting, rotating, printing, and downloading 4×6 shipping labels.
- **Interactive Controls Required in Stage 3 Mock**:
  1. **Direction Switcher (`data-direction`)**: Live switch between all 5 dealt DNA directions (`1: Cobalt Stage`, `2: Signal Manifest`, `3: Cutting Ledger`, `4: Thermal Modular`, `5: Kraft Press`).
  2. **Logo Switcher (`data-logo`)**: Live switch between all 6 custom SVG logo concepts (`Mark 01` through `Mark 06`) directly in the navbar and favicon preview.
  3. **State Switcher (`data-state`)**: Live switch between `ready` (empty intake), `processing` (multi-page scan), `success` (cropped 4×6 label + 3-candidate selector strip + working 90°/180° rotation), and `error` (no label found).
  4. **Theme Switcher (`data-theme`)**: Light / Dark mode toggle using `palette.mjs` token blocks.

### Page Spec 2: `mocks/logo-options.html` (Brand Mark & Favicon Explorer)
- **Purpose**: Dedicated comparative design sheet presenting 6 original SVG logo & favicon concepts for user selection.
- **Per-Concept Presentation Requirements**:
  - Custom vector SVG artwork (zero stock icon library imports).
  - Rendered in **4 contexts per card**:
    1. **Full Navbar Lockup** (Icon + `"Crop This Label"` + `"4×6 Thermal Extractor"` sub-label)
    2. **App Icon / Favicon Scale Trio** (`64×64`, `32×32`, and real `16×16` browser tab simulation)
    3. **Dark Surface Lockup**
    4. **1-Bit Monochrome Thermal Stamp Test** (pure black on white, verifying the mark works stamped on a physical shipping label)
