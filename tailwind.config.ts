import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        trading: {
          bg: '#0b0e14',
          surface: '#151922',
          border: '#232936',
          green: '#00c087',
          red: '#ff3b69',
          accent: '#2962ff',
          muted: '#848e9c',
        },
      },
    },
  },
  plugins: [],
};

export default config;
