'use client';

/**
 * Tauri 2.0 API Bridge Hook
 * 
 * Provides a safe interface for Tauri IPC calls with fallback for web mode.
 * All calls are typed and handle errors gracefully.
 * Uses @tauri-apps/api v2 conventions.
 * 
 * Usage:
 *   const tauri = useTauriApi();
 *   const version = await tauri.getVersion();
 *   tauri.minimize();
 */

// Dynamic import to avoid SSR issues
let tauriInvoke: any = null;
let tauriWindow: any = null;
let tauriEvent: any = null;

let _isTauri = false;

// Lazy init to check if running inside Tauri
function initTauri() {
  if (typeof window === 'undefined') return;
  try {
    // Check for Tauri v2 runtime
    if (typeof (window as any).__TAURI_INTERNALS__ !== 'undefined') {
      _isTauri = true;
    }
  } catch {}
}

initTauri();

export function isTauriApp(): boolean {
  return _isTauri;
}

/**
 * Safely invokes a Tauri command with error handling.
 * Returns null if not in Tauri environment.
 */
async function invoke<T = any>(cmd: string, args?: Record<string, unknown>): Promise<T | null> {
  if (!_isTauri) return null;
  try {
    // Dynamic import for Tauri API
    const { invoke: tauriInvokeFn } = await import('@tauri-apps/api/core');
    return await tauriInvokeFn(cmd, args);
  } catch (error) {
    console.warn(`[Tauri] Command "${cmd}" failed:`, error);
    return null;
  }
}

export interface TauriApi {
  // ── Platform ──
  isTauri: boolean;
  getVersion: () => Promise<string | null>;
  isDev: () => Promise<boolean | null>;
  getPlatform: () => Promise<string | null>;

  // ── Window Controls ──
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  unmaximize: () => Promise<void>;
  toggleMaximize: () => Promise<void>;
  close: () => Promise<void>;
  startDragging: () => Promise<void>;
  isMaximized: () => Promise<boolean | null>;

  // ── Notifications ──
  sendNotification: (title: string, body: string) => Promise<void>;

  // ── Updates ──
  checkForUpdates: () => Promise<string | null>;

  // ── Clipboard ──
  readClipboard: () => Promise<string | null>;
  writeClipboard: (text: string) => Promise<void>;
}

export function useTauriApi(): TauriApi {
  return {
    isTauri: _isTauri,

    // ── Platform ──
    getVersion: () => invoke<string>('get_version'),
    isDev: () => invoke<boolean>('is_dev'),
    getPlatform: () => invoke<string>('get_platform'),

    // ── Window Controls ──
    minimize: async () => {
      if (!_isTauri) return;
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().minimize();
      } catch {}
    },

    maximize: async () => {
      if (!_isTauri) return;
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const win = getCurrentWindow();
        if (await win.isMaximized()) {
          await win.unmaximize();
        } else {
          await win.maximize();
        }
      } catch {}
    },

    unmaximize: async () => {
      if (!_isTauri) return;
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().unmaximize();
      } catch {}
    },

    toggleMaximize: async () => {
      if (!_isTauri) return;
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const win = getCurrentWindow();
        if (await win.isMaximized()) {
          await win.unmaximize();
        } else {
          await win.maximize();
        }
      } catch {}
    },

    close: async () => {
      if (!_isTauri) return;
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().close();
      } catch {}
    },

    startDragging: async () => {
      if (!_isTauri) return;
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().startDragging();
      } catch {}
    },

    isMaximized: async () => {
      if (!_isTauri) return null;
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        return await getCurrentWindow().isMaximized();
      } catch {
        return null;
      }
    },

    // ── Notifications ──
    sendNotification: async (title: string, body: string) => {
      await invoke('send_notification', { title, body });
    },

    // ── Updates ──
    checkForUpdates: () => invoke<string>('check_for_updates'),

    // ── Clipboard ──
    readClipboard: async () => {
      if (!_isTauri) return null;
      try {
        const { readText } = await import('@tauri-apps/plugin-clipboard-manager');
        return await readText();
      } catch { return null; }
    },

    writeClipboard: async (text: string) => {
      if (!_isTauri) return;
      try {
        const { writeText } = await import('@tauri-apps/plugin-clipboard-manager');
        await writeText(text);
      } catch {}
    },
  };
}