'use strict';

const {
  app, BrowserWindow, shell, session, protocol, net,
  Tray, Menu, nativeImage, globalShortcut, ipcMain
} = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const pkg = require('../package.json');

// ─── Constants ──────────────────────────────────────────────────
const isDev = !app.isPackaged;
const ROOT = path.join(__dirname, '..');
const PRELOAD = path.join(__dirname, 'preload.js');
const APP_NAME = 'Cipher Talk';
const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 800;
const MIN_WIDTH = 480;
const MIN_HEIGHT = 600;

// ─── State ──────────────────────────────────────────────────────
/** @type {BrowserWindow | null} */
let mainWindow = null;
/** @type {Tray | null} */
let tray = null;
let isQuitting = false;

// ─── Custom protocol (must be BEFORE app.whenReady) ────────────
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, bypassCSP: false } },
]);

// ═══════════════════════════════════════════════════════════════════
//  WINDOW FACTORY
// ═══════════════════════════════════════════════════════════════════

function createWindow() {
  mainWindow = new BrowserWindow({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    title: APP_NAME,
    backgroundColor: '#05070d',
    icon: path.join(ROOT, 'public', 'icon.png'),

    // ── Frameless with custom title bar ──
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,

    webPreferences: {
      preload: PRELOAD,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  });

  // ── CSP ──
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' app:; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' app:; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com app:; " +
          "img-src 'self' data: blob: app:; " +
          "connect-src 'self' https://*.supabase.co wss://*.supabase.co; " +
          "font-src 'self' https://fonts.gstatic.com;",
        ],
      },
    });
  });

  // ── External links → system browser ──
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // ── Page title override ──
  mainWindow.on('page-title-updated', (e) => e.preventDefault());

  // ── Cleanup on close ──
  mainWindow.on('closed', () => { mainWindow = null; });

  // ── Load app ──
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Загружаем через умный протокол — роут логина
    mainWindow.loadURL('app://login/');
  }
}

// ═══════════════════════════════════════════════════════════════════
//  CUSTOM PROTOCOL HANDLER — УМНЫЙ МАРШРУТИЗАТОР
// ═══════════════════════════════════════════════════════════════════
//  Исправляет проблему, когда Next.js статические ассеты (/ _next/...)
//  отдаются голым HTML из-за неправильного маппинга хостов.
// ═══════════════════════════════════════════════════════════════════

function registerAppProtocol() {
  protocol.handle('app', async (request) => {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const pathname = url.pathname;

    let finalPath;

    // ── 1. Статические ассеты Next.js ──
    //     Запросы вида: app://_next/static/css/... или app://login/_next/...
    //     Принудительно направляем в корень out/
    if (
      hostname === '_next' ||
      pathname.startsWith('/_next') ||
      // Любой файл с расширением (CSS, JS, PNG, SVG etc.)
      (pathname.includes('.') && !pathname.endsWith('.html'))
    ) {
      // Если хост — _next, то путь уже идёт от корня
      const cleanPath = hostname === '_next'
        ? '/' + hostname + pathname
        : pathname;
      finalPath = path.join(ROOT, 'out', cleanPath);
    }

    // ── 2. Роуты страниц (app://login, app://chat, app://register и т.д.) ──
    else {
      // Если хост — это название роута (login, chat, settings…),
      // то кладём его как подпапку в out/
      if (hostname && hostname !== 'localhost' && hostname !== '-') {
        finalPath = path.join(ROOT, 'out', hostname, pathname);
      } else {
        // Корневой роут — просто pathname
        finalPath = path.join(ROOT, 'out', pathname);
      }

      // Если путь не заканчивается на .html — добавляем index.html
      if (!finalPath.endsWith('.html')) {
        // Если путь заканчивается на / — добавляем index.html,
        // иначе сначала добавляем /, потом index.html
        finalPath = finalPath.endsWith('/')
          ? finalPath + 'index.html'
          : finalPath + '/index.html';
      }
    }

    // Нормализуем слеши для Windows → file://
    const normalizedPath = finalPath.replace(/\\/g, '/');

    // console.log('[AppProtocol]', request.url, '→', normalizedPath);

    try {
      return await net.fetch('file://' + normalizedPath);
    } catch (err) {
      // Fallback: если файл не найден — возвращаем index.html роута
      // (для SPA-подобного поведения при прямых ссылках)
      const fallbackPath = path.join(ROOT, 'out', hostname || '', 'index.html')
        .replace(/\\/g, '/');
      return await net.fetch('file://' + fallbackPath);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
//  SYSTEM TRAY
// ═══════════════════════════════════════════════════════════════════

function createTray() {
  // Create a 16x16 tray icon programmatically
  const iconSize = 16;
  const canvas = nativeImage.createFromBuffer(
    Buffer.alloc(iconSize * iconSize * 4, 0),
    { width: iconSize, height: iconSize }
  );

  tray = new Tray(canvas);
  tray.setToolTip(APP_NAME);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Открыть Cipher Talk',
      icon: nativeImage.createEmpty(),
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Проверить обновления',
      click: () => autoUpdater.checkForUpdates(),
    },
    { type: 'separator' },
    {
      label: 'Выйти',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // macOS: show app on click
  if (process.platform === 'darwin') {
    tray.on('click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
//  APPLICATION MENU
// ═══════════════════════════════════════════════════════════════════

function createAppMenu() {
  const template = [
    {
      label: APP_NAME,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Проверить обновления…',
          click: () => autoUpdater.checkForUpdates(),
        },
        { type: 'separator' },
        {
          label: 'Настройки',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('navigate', '/settings');
            }
          },
        },
        { type: 'separator' },
        { role: 'quit', label: 'Выйти' },
      ],
    },
    {
      label: 'Правка',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'Вид',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        {
          label: 'Разработчик',
          accelerator: 'F12',
          click: () => {
            if (mainWindow) mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    },
    {
      label: 'Окно',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'close' },
      ],
    },
    {
      label: 'Помощь',
      submenu: [
        {
          label: 'О Cipher Talk',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('navigate', '/about');
            }
          },
        },
      ],
    },
  ];

  // macOS-specific
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// ═══════════════════════════════════════════════════════════════════
//  GLOBAL SHORTCUTS
// ═══════════════════════════════════════════════════════════════════

function registerShortcuts() {
  // F12 / Cmd+Shift+I — DevTools
  globalShortcut.register('F12', () => {
    if (mainWindow) mainWindow.webContents.toggleDevTools();
  });
}

// ═══════════════════════════════════════════════════════════════════
//  IPC HANDLERS (main → renderer)
// ═══════════════════════════════════════════════════════════════════

function registerIpcHandlers() {
  // ── Window controls ──
  ipcMain.handle('window:minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.handle('window:maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.handle('window:close', () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.handle('window:isMaximized', () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });

  // ── App info ──
  ipcMain.handle('app:getVersion', () => pkg.version);
  ipcMain.handle('app:isDev', () => isDev);
  ipcMain.handle('app:platform', () => process.platform);

  // ── Update maximize event ──
  mainWindow?.on('maximize', () => {
    mainWindow?.webContents.send('window:maximized', true);
  });

  mainWindow?.on('unmaximize', () => {
    mainWindow?.webContents.send('window:maximized', false);
  });

  // ── Check for updates ──
  ipcMain.handle('update:check', () => {
    autoUpdater.checkForUpdates();
  });
}

// ═══════════════════════════════════════════════════════════════════
//  AUTO-UPDATER
// ═══════════════════════════════════════════════════════════════════

function setupAutoUpdater() {
  if (isDev) return;

  autoUpdater.logger = require('electron-log');
  autoUpdater.logger.transports.file.level = 'info';
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  // Check for updates every 6 hours
  const CHECK_INTERVAL = 6 * 60 * 60 * 1000;

  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, CHECK_INTERVAL);

  autoUpdater.on('checking-for-update', () => {
    console.log('[AutoUpdater] Checking for updates…');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('[AutoUpdater] Update available:', info.version);

    const dialogOpts = {
      type: 'info',
      buttons: ['Обновить сейчас', 'Позже'],
      title: 'Доступно обновление',
      message: `Новая версия Cipher Talk ${info.version} готова к установке.`,
      detail: info.releaseNotes
        ? `Что нового:\n${info.releaseNotes}`
        : 'Нажмите "Обновить сейчас" для загрузки.',
    };

    const { response } = require('electron').dialog.showMessageBoxSync(mainWindow, dialogOpts);

    if (response === 0) {
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on('update-not-available', () => {
    console.log('[AutoUpdater] No updates available.');
  });

  autoUpdater.on('download-progress', (progress) => {
    console.log(`[AutoUpdater] Download: ${Math.round(progress.percent)}%`);
    mainWindow?.webContents.send('update:progress', progress.percent);
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('[AutoUpdater] Update downloaded, installing…');
    const { response } = require('electron').dialog.showMessageBoxSync(mainWindow, {
      type: 'info',
      buttons: ['Установить и перезапустить', 'Позже'],
      title: 'Обновление загружено',
      message: 'Обновление Cipher Talk загружено. Перезапустить приложение для установки?',
    });

    if (response === 0) {
      isQuitting = true;
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.on('error', (err) => {
    console.error('[AutoUpdater] Error:', err.message);
  });

  // Check on startup with a delay
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 5000);
}

// ═══════════════════════════════════════════════════════════════════
//  APP LIFECYCLE
// ═══════════════════════════════════════════════════════════════════

app.whenReady().then(() => {
  registerAppProtocol();
  registerIpcHandlers();
  createAppMenu();
  createWindow();
  createTray();
  registerShortcuts();
  setupAutoUpdater();
});

// ── Prevent multiple instances ──
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// ── macOS: re-create window on activate ──
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ── Quit behavior ──
app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && !isQuitting) {
    // Minimize to tray instead of quitting on Windows/Linux
    if (mainWindow) {
      mainWindow.hide();
    }
  } else {
    app.quit();
  }
});

// ── Unregister shortcuts ──
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (tray) {
    tray.destroy();
    tray = null;
  }
});

// ── Security: prevent navigation to unexpected URLs ──
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (event, url) => {
    const parsedUrl = new URL(url);
    const allowedUrl = isDev ? 'http://localhost:3000' : 'app://';
    if (!parsedUrl.href.startsWith(allowedUrl)) {
      event.preventDefault();
    }
  });

  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
});

// ── macOS: dock menu ──
if (process.platform === 'darwin') {
  app.dock.setMenu(
    Menu.buildFromTemplate([
      {
        label: 'Открыть',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          } else {
            createWindow();
          }
        },
      },
    ])
  );
}