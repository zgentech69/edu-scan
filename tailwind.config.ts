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
        paper: '#F5F1E8',
        ink: '#2B2823',
        brass: '#B8863F',
        moss: '#5C6B4E',
        clay: '#A8503B',
      },
      boxShadow: {
        'plaque': '8px 8px 16px #d8d4cc, -8px -8px 16px #ffffff',
        'plaque-inset': 'inset 8px 8px 16px #d8d4cc, inset -8px -8px 16px #ffffff',
        'buzzer': '4px 4px 8px #d8d4cc, -4px -4px 8px #ffffff',
        'buzzer-pressed': 'inset 4px 4px 8px #d8d4cc, inset -4px -4px 8px #ffffff',
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
