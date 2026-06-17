'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Minus, Square, X } from 'lucide-react';
import { useTauriApi } from '@/lib/hooks/useTauriApi';

/**
 * Custom frameless title bar for Tauri desktop app.
 * Integrates with Tauri 2.0 API via @tauri-apps/api.
 * Design matches Cipher Talk's glassmorphism dark theme.
 * Supports both Tauri (native) and Electron (legacy) runtimes.
 */
export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [version, setVersion] = useState('0.1.0');
  const tauri = useTauriApi();

  useEffect(() => {
    if (tauri.isTauri) {
      // Get current maximized state
      tauri.isMaximized().then((max) => {
        if (max !== null) setIsMaximized(max);
      });

      // Get app version
      tauri.getVersion().then((v) => {
        if (v) setVersion(v);
      });

      // Listen for maximize/unmaximize events
      const setupListeners = async () => {
        try {
          const { listen } = await import('@tauri-apps/api/event');
          const unlisten = await listen('tauri://resize', () => {
            tauri.isMaximized().then((max) => {
              if (max !== null) setIsMaximized(max);
            });
          });
          return unlisten;
        } catch {}
      };

      const cleanup = setupListeners();
      return () => {
        cleanup.then((fn) => fn?.());
      };
    }
  }, [tauri.isTauri]);

  const handleMinimize = () => tauri.minimize();
  const handleMaximize = () => {
    tauri.maximize();
    setIsMaximized(!isMaximized);
  };
  const handleClose = () => tauri.close();
  const handleDoubleClick = () => {
    tauri.toggleMaximize();
    setIsMaximized(!isMaximized);
  };

  // Detect if running in Tauri vs Electron
  const isTauri = tauri.isTauri;

  return (
    <div
      data-tauri-drag-region
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between h-10 px-3 select-none"
      style={{
        background: 'rgba(5, 7, 13, 0.92)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* ── Left: App icon + title ── */}
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <div className="w-5 h-5 rounded-md bg-emerald-500/15 flex items-center justify-center ring-1 ring-emerald-500/30">
            <Shield className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="absolute inset-0 bg-emerald-500/20 blur-md" />
        </div>

        <span className="text-xs font-semibold text-white/90 tracking-wide">
          Cipher<span className="text-emerald-400">Talk</span>
        </span>

        <span className="text-[9px] text-zinc-600 font-mono ml-1">
          v{version}
        </span>
      </div>

      {/* ── Center: Draggable spacer ── */}
      <div className="flex-1" />

      {/* ── Right: Window controls ── */}
      <div className="flex items-center">
        {/* Minimize */}
        <button
          onClick={handleMinimize}
          className="group flex items-center justify-center w-10 h-8 rounded-lg transition-all duration-200 hover:bg-white/[0.06] active:bg-white/[0.03]"
          aria-label="Minimize"
        >
          <Minus className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
        </button>

        {/* Maximize / Restore */}
        <button
          onClick={handleMaximize}
          className="group flex items-center justify-center w-10 h-8 rounded-lg transition-all duration-200 hover:bg-white/[0.06] active:bg-white/[0.03]"
          aria-label={isMaximized ? 'Restore' : 'Maximize'}
        >
          <Square
            className={`w-3 h-3 text-zinc-500 group-hover:text-white transition-colors ${
              isMaximized ? 'scale-75' : ''
            }`}
          />
        </button>

        {/* Close */}
        <button
          onClick={handleClose}
          className="group flex items-center justify-center w-10 h-8 rounded-lg transition-all duration-200 hover:bg-red-500/20 active:bg-red-500/10 ml-0.5"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-400 transition-colors" />
        </button>
      </div>

      <style jsx>{`
        div[data-tauri-drag-region] {
          -webkit-app-region: ${isTauri ? 'no-drag' : 'drag'};
          app-region: ${isTauri ? 'no-drag' : 'drag'};
        }
        div[data-tauri-drag-region] button {
          -webkit-app-region: no-drag;
        }
      `}</style>
    </div>
  );
}