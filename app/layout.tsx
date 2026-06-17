import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/i18n';
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
                // Если есть Custom TitleBar — добавляем padding для body
                if (d.classList.contains('neutralino') || d.classList.contains('tauri')) {
                  d.style.setProperty('--desktop-titlebar', '40px');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans text-white">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
