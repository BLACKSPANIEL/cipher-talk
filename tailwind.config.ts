import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff00',
        'neon-dark-green': '#00cc00',
        'bg-black': '#000000',
        'bg-dark': '#0a0a0a',
        'surface-dark': 'rgba(30, 40, 50, 0.8)',
        'surface-darker': 'rgba(10, 10, 15, 0.95)',
        'text-muted': '#888888'
      },
      boxShadow: {
        'neon-glow': '0 0 30px rgba(0, 255, 0, 0.4), 0 0 60px rgba(0, 255, 0, 0.2)',
        'neon-glow-lg': '0 0 50px rgba(0, 255, 0, 0.6), 0 0 100px rgba(0, 255, 0, 0.3)',
        glass: '0 24px 80px rgba(0, 0, 0, 0.5)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at 100% 0%, rgba(0, 255, 0, 0.15), transparent 30%), radial-gradient(circle at 0% 100%, rgba(0, 200, 0, 0.1), transparent 40%), linear-gradient(180deg, #000000, #0a0a0a)'
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 30px rgba(0, 255, 0, 0.4)' },
          '50%': { opacity: '.8', boxShadow: '0 0 50px rgba(0, 255, 0, 0.6)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
