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
        background: '#0B0F19',
        card: '#111827',
        'card-border': '#1F2937',
        'subtle-surface': '#161F30',
        brand: {
          indigo: '#6366F1',
          'indigo-hover': '#4F46E5',
          cyan: '#06B6D4',
          'cyan-hover': '#0891B2',
        },
        evidence: {
          mismatch: '#EF4444',
          survived: '#F97316',
          weak: '#FBBF24',
          missing: '#A855F7',
          inconclusive: '#94A3B8',
          verified: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}

