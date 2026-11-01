# Crop This Label

**4×6 Thermal Shipping Label Extractor · 100% Client-Side YOLOv8 ONNX + `pdf.js` Workbench**

Crop This Label extracts shipping labels from standard `8.5" × 11"` carrier PDFs and screenshots (USPS, UPS, FedEx, DHL, Pirate Ship, Poshmark, eBay, Mercari, Depop) and normalizes them into a calibrated `4.00" × 6.00"` (`1200 × 1800 px` at `300 DPI`) thermal label ready for Rollo, Zebra, Brother, Munbyn, or Dymo 4XL printers.

All PDF rasterization and YOLOv8 object detection run locally in your browser via WebAssembly — zero files or customer addresses ever leave your device.

---

## Key Capabilities

- **3-Way Carrier Intake (`Zone A`)**:
  - Drag-and-drop or browse multi-page `.pdf`, `.png`, `.jpg`, or `.webp` carrier sheets.
  - Press `Ctrl+V` / `Cmd+V` anywhere in the window to paste a shipping label screenshot directly from your clipboard.
  - Click **Load Sample Carrier Sheet** to test the multi-candidate 4×6 stage immediately without uploading a file.
- **Highlighted Source Sheet & Multi-Candidate Selector**:
  - Displays a thumbnail of the `8.5" × 11"` source carrier sheet with an SVG bounding-box overlay showing the active detection region.
  - Switch between up to 3 detected label regions per document sorted by YOLOv8 confidence score.
- **Calibrated `4.00" × 6.00"` Thermal Output Stage (`Zone B`)**:
  - Automatically rotates landscape labels into portrait `1200 × 1800 px` (`300 DPI`) thermal orientation.
  - Tactile orientation controls (`90° CW`, `90° CCW`, `Flip 180°`, `Reset 0°`).
  - Direct `@page { size: 4in 6in; margin: 0 }` thermal print popup and 1-click `1200 × 1800 px` PNG download.

---

## Design System & Architecture (`Kraft Press`)

The interface is built on the **Kraft Press (`playful-geometric` · `monolith-center` · `bricolage-dm-sans` · `analogous` · `hard-offset-shadow`)** design system and **Mark B: The Peeled Thermal Corner (`#logo-peel`)**:

- [`DESIGN.md`](./DESIGN.md) — Visual direction, OKLCH token scales (Kraft Amber + Terracotta Stamp on warm kraft-paper neutrals, plus Dark Ink mode), typography scale (`Bricolage Grotesque`, `DM Sans`, `IBM Plex Mono`), and hard `4px` offset ink shadow specification.
- [`JOURNEY.md`](./JOURNEY.md) — User journey, information architecture (`38fr / 62fr` monolith parcel station), and interactive state machine (`loading`, `ready`, `processing`, `success`, `error`).
- [`mocks/workbench-directions.html`](./mocks/workbench-directions.html) & [`mocks/logo-options.html`](./mocks/logo-options.html) — Interactive Stage 3 exploration artifacts comparing all 5 candidate workbench directions and 6 custom SVG brand marks.

---

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

---

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.
