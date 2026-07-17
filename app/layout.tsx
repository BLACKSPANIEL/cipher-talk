import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/i18n';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppPreloader } from '@/components/ui/AppPreloader';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cipher Talk — приватный мессенджер с E2EE',
  description: 'Cipher Talk — стильный, защищённый мессенджер с end-to-end шифрованием, disappearing messages и нулевой политикой логов.',
  metadataBase: new URL('https://cipher-talk.example.com'),
  openGraph: {
    title: 'Cipher Talk — приватный мессенджер',
    description: 'Современный мессенджер для безопасного общения с E2EE, disappearing messages и стеклянным интерфейсом.',
    type: 'website',
    siteName: 'Cipher Talk',
    locale: 'ru_RU',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cipher Talk landing page'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cipher Talk — приватный мессенджер',
    description: 'Современный мессенджер для безопасного общения с E2EE и disappearing messages.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/*
          Инжектим скрипт, который до отрисовки добавляет класс 'neutralino' или 'tauri'
          на <html>, чтобы CSS мог адаптироваться под Desktop-окно.
          Также добавляет глобальные CSS-переменные темы из Zustand.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var d = document.documentElement;
                if (typeof window !== 'undefined') {
                  if (window.__NL__) d.classList.add('neutralino');
                  if (window.__TAURI_INTERNALS__) d.classList.add('tauri');
                }
                if (d.classList.contains('neutralino') || d.classList.contains('tauri')) {
                  d.style.setProperty('--desktop-titlebar', '40px');
                }
                
                // Apply persisted theme from localStorage
                try {
                  var settings = JSON.parse(localStorage.getItem('cipher-talk-settings') || '{}');
                  var state = settings.state || {};
                  var theme = state.theme || 'dark';
                  var accentColor = state.accentColor || 'emerald';
                  var glassIntensity = state.glassIntensity || 20;
                  
                  // Map color names to actual hex values
                  var colorMap = {
                    'emerald': '#10b981',
                    'cyan': '#22d3ee',
                    'violet': '#a78bfa',
                    'amber': '#fbbf24',
                    'rose': '#fb7185',
                    'blue': '#60a5fa',
                    'purple': '#c084fc',
                    'pink': '#f472b6',
                    'orange': '#fb923c',
                    'teal': '#2dd4bf',
                  };
                  var hex = colorMap[accentColor] || '#10b981';
                  
                  d.style.setProperty('--accent-color', hex);
                  var rgbMatch = hex.replace('#', '').match(/.{2}/g);
                  d.style.setProperty('--accent-rgb', rgbMatch ? rgbMatch.map(function(c) { return parseInt(c, 16); }).join(',') : '16,245,181');
                  d.style.setProperty('--accent-color-name', accentColor);
                  d.style.setProperty('--bg-blur', glassIntensity + 'px');
                  
                  // Apply light theme class
                  if (theme === 'light') {
                    d.classList.add('light');
                  } else {
                    d.classList.remove('light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans text-white">
        <AppPreloader>
          <LanguageProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </LanguageProvider>
        </AppPreloader>
      </body>
    </html>
  );
}