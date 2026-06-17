/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_OUTPUT === 'export';

const nextConfig = {
  reactStrictMode: true,

  // ── Desktop (Neutralino/Tauri/Electron) static export ──
  //  Neutralino требует строгий trailingSlash для корректной
  //  маршрутизации: /login → /login/index.html
  //  Для Vercel (SSR) оставляем undefined
  output: isExport ? 'export' : undefined,

  // ── Image optimization не работает со static export ──
  images: {
    unoptimized: isExport,
  },

  // ── Trailing slashes — ОБЯЗАТЕЛЬНО для Neutralino ──
  //  Neutralino сервер ожидает /login/index.html, а не /login.html
  //  trailingSlash заставляет Next.js создавать /login/index.html
  //  В dev-режиме false, чтобы не ломать App Router
  trailingSlash: isExport,

  // ── Отключаем линтер при сборке (ускоряет build) ──
  eslint: {
    ignoreDuringBuilds: isExport,
  },

  // ── TypeScript ошибки не блокируют сборку ──
  typescript: {
    ignoreBuildErrors: isExport,
  },
};

export default nextConfig;