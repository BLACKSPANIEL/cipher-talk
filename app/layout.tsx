import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

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
      <body className={`${spaceGrotesk.variable} font-sans text-white`}>
        {children}
      </body>
    </html>
  );
}
