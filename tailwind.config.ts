import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#171311',
        foreground: '#FFFFFF',
        surface: {
          DEFAULT: '#211C19',
          elevated: '#2A2420',
          border: '#38302B',
          highlight: '#483E38',
        },
        primary: {
          DEFAULT: '#D92D2D',
          hover: '#C22323',
          light: '#F85151',
          dark: '#9E1919',
        },
        secondary: {
          DEFAULT: '#F3B544',
          hover: '#E0A02E',
          light: '#F7CB77',
          dark: '#B87B1E',
        },
        cream: {
          DEFAULT: '#FFF7EA',
          muted: '#EADBC8',
          dark: '#D8C3AA',
        },
        muted: {
          DEFAULT: '#B8ACA2',
          light: '#D3C9C2',
          dark: '#85786E',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 35px -5px rgba(217, 45, 45, 0.35)',
        'glow-gold': '0 0 35px -5px rgba(243, 181, 68, 0.35)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
};

export default config;

