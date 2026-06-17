import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00FF66',
        'neon-dark-green': '#00CC44',
        'neon-emerald': '#00E566',
        'cyber-cyan': '#00E5FF',
        'cyber-violet': '#8B5CF6',
        'bg-black': '#000000',
        'bg-deep': '#05060F',
        'bg-dark': '#08090F',
        'bg-graphite': '#0C0C0E',
        'bg-graphite-light': '#141418',
        'bg-glass': 'rgba(12, 16, 24, 0.72)',
        'bg-glass-strong': 'rgba(8, 10, 20, 0.88)',
        'surface-glass': 'rgba(12, 16, 24, 0.72)',
        'surface-glass-dark': 'rgba(6, 8, 14, 0.85)',
        'text-muted': '#888888',
        border: 'rgba(255, 255, 255, 0.06)',
      },
      boxShadow: {
        'neon-glow': '0 0 30px rgba(0, 255, 102, 0.4), 0 0 60px rgba(0, 255, 102, 0.2)',
        'neon-glow-lg': '0 0 50px rgba(0, 255, 102, 0.6), 0 0 100px rgba(0, 255, 102, 0.3)',
        'neon-glow-sm': '0 0 15px rgba(0, 255, 102, 0.25), 0 0 30px rgba(0, 255, 102, 0.1)',
        'emoji-glow': '0 0 12px rgba(16, 185, 129, 0.3)',
        glass: '0 24px 80px rgba(0, 0, 0, 0.5)',
        'glass-lg': '0 40px 120px rgba(0, 0, 0, 0.6)',
        'glass-xl': '0 50px 150px rgba(0, 0, 0, 0.7)',
        'premium-card': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'premium-card-hover': '0 12px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.10)',
        'inner-glow': 'inset 0 0 30px rgba(0, 255, 102, 0.06)',
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(180deg, #05060F, #08090F)',
        'emerald-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 255, 102, 0.08), transparent 70%)',
        'settings-bg': 'radial-gradient(circle at 100% 0%, rgba(0, 255, 102, 0.08), transparent 30%), radial-gradient(circle at 0% 100%, rgba(0, 200, 80, 0.06), transparent 40%), linear-gradient(180deg, #05060F, #0C0C0E)',
        'hero-gradient': 'radial-gradient(circle at 100% 0%, rgba(0, 255, 102, 0.15), transparent 30%), radial-gradient(circle at 0% 100%, rgba(0, 200, 80, 0.1), transparent 40%), linear-gradient(180deg, #000000, #0a0a0a)',
        'chat-gradient': 'linear-gradient(135deg, #00FF66, #00CC44)',
        'chat-gradient-dark': 'linear-gradient(135deg, #00CC44, #009933)',
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 255, 102, 0.08), transparent 70%)',
        'messenger-bg': 'radial-gradient(circle at 20% 30%, rgba(0, 255, 102, 0.06), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0, 200, 80, 0.04), transparent 40%), linear-gradient(180deg, #08080C, #0C0C0E)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      backdropBlur: {
        '3xl': '48px',
        '4xl': '64px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fade-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'status-pulse': 'status-pulse 2s ease-in-out infinite',
        'typing-bounce': 'typing-bounce 1.4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shield-float': 'shield-float 4s ease-in-out infinite',
        'e2ee-pulse': 'e2ee-pulse 2.4s ease-in-out infinite',
        'settings-enter': 'settings-enter 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 30px rgba(0, 255, 102, 0.4)' },
          '50%': { opacity: '.8', boxShadow: '0 0 50px rgba(0, 255, 102, 0.6)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'status-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'typing-bounce': {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-4px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shield-float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1.5deg)' },
        },
        'e2ee-pulse': {
          '0%, 100%': { borderColor: 'rgba(16, 185, 129, 0.2)', color: 'rgb(16, 185, 129)', boxShadow: '0 0 0 rgba(16,185,129,0)' },
          '50%': { borderColor: 'rgba(16, 185, 129, 0.7)', color: 'rgb(52, 211, 153)', boxShadow: '0 0 18px rgba(16,185,129,0.45)' },
        },
        'settings-enter': {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    }
  },
  plugins: []
};

export default config;