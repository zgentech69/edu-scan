import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#EFE9DC',
        ink: '#1F1A12',
        brass: '#B8863F',
        moss: '#5C6B4E',
        clay: '#A8503B',
        sand: {
          50: '#FAF7F2',
          100: '#EFE9DC',
          200: '#E2D9C5',
          300: '#D2C4A7',
          400: '#BCAC8A',
          500: '#A18E6C',
          600: '#816F4F',
          700: '#61533A',
          800: '#423826',
          900: '#1F1A12',
        },
      },
      boxShadow: {
        'neu-flat': '8px 8px 16px #d5cdbd, -8px -8px 16px #ffffff',
        'neu-pressed': 'inset 4px 4px 8px #d5cdbd, inset -4px -4px 8px #ffffff',
        'neu-sm': '3px 3px 6px #d5cdbd, -3px -3px 6px #ffffff',
        'neu-convex': '6px 6px 12px #d5cdbd, -6px -6px 12px #ffffff',
        'neu-inset': 'inset 6px 6px 12px #d5cdbd, inset -6px -6px 12px #ffffff',
        'plaque': '8px 8px 16px #d5cdbd, -8px -8px 16px #ffffff',
        'plaque-inset': 'inset 6px 6px 12px #d5cdbd, inset -6px -6px 12px #ffffff',
        'buzzer': '4px 4px 8px #d5cdbd, -4px -4px 8px #ffffff',
        'buzzer-pressed': 'inset 4px 4px 8px #d5cdbd, inset -4px -4px 8px #ffffff',
      },
      fontFamily: {
        sans: ['var(--font-ibm-sans)', 'sans-serif'],
        mono: ['var(--font-ibm-mono)', 'monospace'],
        display: ['var(--font-fraunces)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
