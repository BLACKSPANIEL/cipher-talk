'use strict';

const { contextBridge, ipcRenderer } = require('electron');

/**
 * Secure preload script — exposes minimal safe APIs to the renderer.
 * All main-process operations go through IPC channels.
 * Uses contextBridge for context isolation (sandbox: true).
 */

contextBridge.exposeInMainWorld('electronAPI', {
  // ── Platform info ──
  platform: process.platform,
  isElectron: true,
  isDev: () => ipcRenderer.invoke('app:isDev'),

  // ── App info ──
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  isPackaged: () => ipcRenderer.invoke('app:isDev'),
  getPlatform: () => ipcRenderer.invoke('app:platform'),

  // ── Window controls ──
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),

  // ── Window events ──
  onMaximizedChange: (callback) => {
    ipcRenderer.on('window:maximized', (_event, isMaximized) => {
      callback(isMaximized);
    });
  },

  // ── Navigation ──
  onNavigate: (callback) => {
    ipcRenderer.on('navigate', (_event, path) => {
      callback(path);
    });
  },

  // ── Auto-update ──
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  onUpdateProgress: (callback) => {
    ipcRenderer.on('update:progress', (_event, percent) => {
      callback(percent);
    });
  },
});