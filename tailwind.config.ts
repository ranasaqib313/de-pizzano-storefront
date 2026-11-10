import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          border: 'var(--surface-border)',
          highlight: 'var(--border)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          light: '#F85151',
          dark: '#9E1919',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
          light: '#F7CB77',
          dark: '#B87B1E',
        },
        cream: {
          DEFAULT: '#FFF7EA',
          muted: '#EADBC8',
          dark: '#D8C3AA',
        },
        muted: {
          DEFAULT: 'var(--muted-foreground)',
          light: 'var(--muted-light)',
          dark: 'var(--muted-foreground)',
          bg: 'var(--muted)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 35px -5px rgba(217, 45, 45, 0.35)',
        'glow-gold': '0 0 35px -5px rgba(243, 181, 68, 0.35)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.2)',
        'dock': 'var(--dock-shadow)',
      },
    },
  },
  plugins: [],
};

export default config;
