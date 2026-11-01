import React from 'react';

/**
 * Mark B: "The Peeled Thermal Corner" (#logo-peel)
 * 2:3 adhesive thermal shipping label with a 45-degree peeled top-right corner flap,
 * exposed dashed silicone liner, carrier service block, and tracking barcode.
 * Uses CSS custom properties from DESIGN.md so it adapts across Light & Dark mode.
 */
export function BrandLogo({ size = 40, className = '', title = 'Crop This Label mark' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title}
    >
      {/* Silicone backing liner sheet exposed beneath the peeled corner */}
      <rect
        x="12"
        y="6"
        width="40"
        height="52"
        fill="var(--accent-bg-subtle)"
        stroke="var(--border-strong)"
        strokeWidth="2.2"
        strokeDasharray="3.5 3.5"
      />
      {/* Main 2:3 (4x6) thermal label sheet with 45-degree top-right corner peel */}
      <polygon
        points="12,6 35,6 52,23 52,58 12,58"
        fill="var(--surface)"
        stroke="var(--text)"
        strokeWidth="3.4"
        strokeLinejoin="miter"
      />
      {/* Curled 45-degree corner peel flap in Kraft Amber (--accent-solid) */}
      <polygon
        points="35,6 35,23 52,23"
        fill="var(--accent-solid)"
        stroke="var(--text)"
        strokeWidth="3"
        strokeLinejoin="bevel"
      />
      {/* Carrier priority service block */}
      <rect x="18" y="13" width="11" height="10" fill="var(--text)" />
      {/* Secondary terracotta manifest rule (--secondary-9) */}
      <line
        x1="18"
        y1="28.5"
        x2="45"
        y2="28.5"
        stroke="var(--secondary-9)"
        strokeWidth="3"
        strokeLinecap="square"
      />
      {/* Recipient address rule */}
      <line
        x1="18"
        y1="34.5"
        x2="38"
        y2="34.5"
        stroke="var(--text)"
        strokeWidth="2.4"
        strokeLinecap="square"
      />
      {/* Vertical tracking barcode bars */}
      <path
        d="M18 41 V52 M22.5 41 V52 M26 41 V52 M30.5 41 V52 M35 41 V52 M38.5 41 V52 M43 41 V52 M46 41 V52"
        stroke="var(--text)"
        strokeWidth="2.3"
        strokeLinecap="butt"
      />
    </svg>
  );
}

export default BrandLogo;
