/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Complete Mauve Scale from CSS variables
        mauve: {
          50: 'var(--mauve-50)',
          100: 'var(--mauve-100)',
          200: 'var(--mauve-200)',
          300: 'var(--mauve-300)',
          400: 'var(--mauve-400)',
          500: 'var(--mauve-500)',
          600: 'var(--mauve-600)',
          700: 'var(--mauve-700)',
          800: 'var(--mauve-800)',
          900: 'var(--mauve-900)',
          950: 'var(--mauve-950)',
        },

        // Theme Token Mappings
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        border: 'var(--color-border)',
        body: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        faint: 'var(--color-text-faint)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'accent-text': 'var(--color-accent-text)',

        // Semantic Status Colours
        critical: 'var(--color-critical)',
        high: 'var(--color-high)',
        medium: 'var(--color-medium)',
        low: 'var(--color-low)',
        info: 'var(--color-info)',

        // Mutation Semantics
        'mutation-killed': 'var(--color-mutation-killed)',
        'mutation-survived': 'var(--color-mutation-survived)',
        'mutation-timeout': 'var(--color-mutation-timeout)',
        'mutation-no-coverage': 'var(--color-mutation-no-coverage)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        'elevation-sm': 'var(--shadow-elevation-sm)',
        'elevation-md': 'var(--shadow-elevation-md)',
        'elevation-lg': 'var(--shadow-elevation-lg)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
