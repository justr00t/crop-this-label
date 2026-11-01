/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background: 'var(--background)',
        surface: {
          DEFAULT: 'var(--surface)',
          hover: 'var(--surface-hover)',
          active: 'var(--surface-active)',
        },
        ink: {
          DEFAULT: 'var(--text)',
          secondary: 'var(--text-secondary)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        accent: {
          subtle: 'var(--accent-bg-subtle)',
          DEFAULT: 'var(--accent-solid)',
          hover: 'var(--accent-solid-hover)',
          text: 'var(--accent-text)',
          onSolid: 'var(--accent-on-solid)',
        },
        secondary: {
          subtle: 'var(--secondary-3)',
          DEFAULT: 'var(--secondary-9)',
          text: 'var(--secondary-11)',
        },
      },
      borderRadius: {
        ui: 'var(--radius-ui)',
      },
      boxShadow: {
        ui: 'var(--shadow-ui)',
        'ui-sm': 'var(--shadow-ui-sm)',
      },
    },
  },
  plugins: [],
}
