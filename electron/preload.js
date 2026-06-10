'use strict';

const { contextBridge } = require('electron');

/**
 * Secure preload script — exposes minimal safe APIs to the renderer.
 * Uses contextBridge for context isolation (sandbox: true).
 */
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
});