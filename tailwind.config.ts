import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#05070d',
        surface: '#111827',
        surface2: '#0d1221',
        border: 'rgba(255,255,255,0.08)',
        muted: '#8aa0b4',
        primary: '#64ffda',
        cyan: '#3dd7ff',
        violet: '#8a7dff'
      },
      boxShadow: {
        glow: '0 0 45px rgba(100,255,218,0.12), 0 0 24px rgba(61,215,255,0.08)',
        glass: '0 24px 80px rgba(0,0,0,0.25)'
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top, rgba(56,248,205,0.14), transparent 32%), radial-gradient(circle at 20% 20%, rgba(133,110,255,0.18), transparent 25%)'
      }
    }
  },
  plugins: []
};

export default config;
