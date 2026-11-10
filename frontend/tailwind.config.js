/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Page & Surface tokens
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-soft': 'var(--surface-soft)',
        border: 'var(--border)',
        'border-secondary': 'var(--border-secondary)',
        body: 'var(--text)',
        muted: 'var(--text-muted)',

        // Dark Mauve Dedicated Components (Sidebar, Hero, Code)
        'sidebar-bg': 'var(--sidebar-bg)',
        'sidebar-text': 'var(--sidebar-text)',
        'sidebar-muted': 'var(--sidebar-muted)',
        'sidebar-active': 'var(--sidebar-active)',
        'code-bg': 'var(--code-bg)',
        'code-text': 'var(--code-text)',

        // Accent that pops
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-text': 'var(--accent-text)',

        // Semantic Status Colors
        critical: 'var(--critical)',
        high: 'var(--high)',
        medium: 'var(--medium)',
        low: 'var(--low)',
        info: 'var(--info)',

        // Mutation Semantics
        'mutation-killed': 'var(--mutation-killed)',
        'mutation-survived': 'var(--mutation-survived)',
        'mutation-timeout': 'var(--mutation-timeout)',
        'mutation-no-coverage': 'var(--mutation-no-coverage)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        modal: 'var(--shadow-modal)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
