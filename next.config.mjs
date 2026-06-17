/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_OUTPUT === 'export';

const nextConfig = {
  reactStrictMode: true,

  // ── Tauri/Electron production: static export to /out ──
  //  В tauri.conf.json beforeBuildCommand устанавливает NEXT_OUTPUT=export
  //  автоматически перед npm run build
  output: isExport ? 'export' : undefined,

  // ── Image optimization не работает со static export ──
  images: {
    unoptimized: isExport,
  },

  // ── Trailing slashes для совместимости с file:// протоколом ──
  //  В Tauri production статические файлы грузятся через asset:// протокол,
  //  поэтому trailingSlash не требуется, но оставляем для безопасности
  trailingSlash: isExport,

  // ── Отключаем линтер при сборке (ускоряет Tauri build) ──
  eslint: {
    ignoreDuringBuilds: isExport,
  },

  // ── TypeScript ошибки не блокируют сборку (для Tauri build) ──
  typescript: {
    ignoreBuildErrors: isExport,
  },
};

export default nextConfig;