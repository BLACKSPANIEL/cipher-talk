/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Desktop builds: use 'export' for static output (Tauri-compatible)
  // or 'standalone' for Electron with Node.js server support.
  // Set NEXT_OUTPUT env var: 'export' | 'standalone' | undefined (default)
  output: process.env.NEXT_OUTPUT === 'export' ? 'export' : undefined,

  // Ensure all assets use relative paths for file:// protocol compatibility (Electron/Tauri)
  // This is critical for desktop builds where the app runs from local filesystem
  assetPrefix: process.env.NEXT_OUTPUT === 'export' ? '.' : undefined,

  // Disable image optimization for static export (not supported)
  images: {
    unoptimized: process.env.NEXT_OUTPUT === 'export',
  },

  // Enable trailing slashes for better static file compatibility
  trailingSlash: process.env.NEXT_OUTPUT === 'export',
};

export default nextConfig;