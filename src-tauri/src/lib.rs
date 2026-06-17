use tauri::{
    AppHandle, Manager, WindowEvent,
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    image::Image,
};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Shortcut};
use tauri_plugin_notification::NotificationExt;

// ═══════════════════════════════════════════════════════════════════════════════
//  IPC COMMANDS
// ═══════════════════════════════════════════════════════════════════════════════

#[tauri::command]
fn get_version(app: AppHandle) -> String {
    app.package_info().version.to_string()
}

#[tauri::command]
fn is_dev() -> bool {
    cfg!(debug_assertions)
}

#[tauri::command]
fn get_platform() -> String {
    std::env::consts::OS.to_string()
}

#[tauri::command]
async fn check_for_updates(app: AppHandle) -> Result<String, String> {
    let updater = app.updater().map_err(|_| "Updater not available.".to_string())?;
    match updater.check().await {
        Ok(Some(update)) => {
            let version = update.version.clone();
            if let Err(e) = update.download_and_install(|_| {}, || {}).await {
                return Err(format!("Failed to install update: {}", e));
            }
            Ok(format!("Update {} installed. Restart app to apply.", version))
        }
        Ok(None) => Ok("No updates available.".to_string()),
        Err(e) => Err(format!("Update check failed: {}", e)),
    }
}

#[tauri::command]
fn send_notification(app: AppHandle, title: String, body: String) -> Result<(), String> {
    app.notification()
        .builder()
        .title(&title)
        .body(&body)
        .show()
        .map_err(|e| e.to_string())?;
    Ok(())
}

// ═══════════════════════════════════════════════════════════════════════════════
//  TRAY SETUP
// ═══════════════════════════════════════════════════════════════════════════════

fn setup_tray(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    // Build menu items
    let show_item = MenuItemBuilder::with_id("show", "Открыть Cipher Talk").build(app)?;
    let check_updates_item = MenuItemBuilder::with_id("check_updates", "Проверить обновления").build(app)?;
    let quit_item = MenuItemBuilder::with_id("quit", "Выйти").build(app)?;

    let menu = MenuBuilder::new(app)
        .item(&show_item)
        .separator()
        .item(&check_updates_item)
        .separator()
        .item(&quit_item)
        .build()?;

    // Use default icon
    let icon = app.default_window_icon()
        .cloned()
        .unwrap_or_else(|| {
            // 32x32 transparent RGBA image
            Image::new(&[0u8; 32 * 32 * 4], 32, 32)
        });

    TrayIconBuilder::new()
        .icon(icon)
        .menu(&menu)
        .tooltip("Cipher Talk")
        .on_menu_event(move |app, event| {
            match event.id.0.as_str() {
                "show" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                "check_updates" => {
                    let app_clone = app.clone();
                    tauri::async_runtime::spawn(async move {
                        let _ = check_for_updates(app_clone).await;
                    });
                }
                "quit" => app.exit(0),
                _ => {}
            }
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .build(app)?;

    Ok(())
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GLOBAL SHORTCUTS
// ═══════════════════════════════════════════════════════════════════════════════

fn setup_shortcuts(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let app_handle = app.clone();

    app.global_shortcut().on_shortcut(move |_app, shortcut, event| {
        if event.state != tauri_plugin_global_shortcut::ShortcutState::Pressed {
            return;
        }

        let f12 = Shortcut::new(None, Code::F12);
        let ctrl_q = Shortcut::new(Some(tauri_plugin_global_shortcut::Modifiers::CONTROL), Code::KeyQ);

        if *shortcut == f12 {
            if let Some(window) = _app.get_webview_window("main") {
                window.open_devtools();
            }
        } else if *shortcut == ctrl_q {
            _app.exit(0);
        }
    });

    // Register shortcuts
    app.global_shortcut()
        .register(Shortcut::new(None, Code::F12))?;
    app.global_shortcut()
        .register(Shortcut::new(Some(tauri_plugin_global_shortcut::Modifiers::CONTROL), Code::KeyQ))?;

    Ok(())
}

// ═══════════════════════════════════════════════════════════════════════════════
//  WINDOW EVENT HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

fn handle_window_events(window: &tauri::WebviewWindow) {
    let win = window.clone();

    window.on_window_event(move |event| {
        if let WindowEvent::CloseRequested { api, .. } = event {
            // Hide window instead of closing → minimize to tray
            let _ = win.hide();
            api.prevent_close();
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  APP SETUP & RUN
// ═══════════════════════════════════════════════════════════════════════════════

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // ── Plugins ──
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_global_shortcut::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        // ── IPC Commands ──
        .invoke_handler(tauri::generate_handler![
            get_version,
            is_dev,
            get_platform,
            check_for_updates,
            send_notification,
        ])
        // ── Setup hook ──
        .setup(|app| {
            // Set up window event handlers
            if let Some(window) = app.get_webview_window("main") {
                handle_window_events(&window);
            }

            // Set up system tray
            setup_tray(app)?;

            // Set up global shortcuts
            setup_shortcuts(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}