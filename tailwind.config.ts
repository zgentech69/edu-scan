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
        sand: {
          50: '#F5F3F0',
          100: '#EBE7E0', // Base
          200: '#D1CCC4', // Lowlight
          300: '#B8B1A8',
          900: '#2D2A26', // Text
        },
      },
      boxShadow: {
        'neu-flat': '8px 8px 16px #d1ccc4, -8px -8px 16px #ffffff',
        'neu-pressed': 'inset 8px 8px 16px #d1ccc4, inset -8px -8px 16px #ffffff',
        'neu-sm': '4px 4px 8px #d1ccc4, -4px -4px 8px #ffffff',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
