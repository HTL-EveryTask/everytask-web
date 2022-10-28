#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, RunEvent, SystemTray, SystemTrayEvent, SystemTrayMenu, WindowEvent};
use tauri::Manager;

fn main() {
    // create tray menu with custom items
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("hide", "Hide"))
        .add_item(CustomMenuItem::new("open", "Open"))
        .add_item(CustomMenuItem::new("quit", "Quit"));

    tauri::Builder::default()
        .system_tray(SystemTray::new().with_menu(tray_menu))
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "hide" => {
                        let window = app.get_window("main").unwrap();
                        window.hide().unwrap();
                    }
                    "open" => {
                        let window = app.get_window("main").unwrap();
                        window.show().unwrap();
                    }
                    _ => {}
                }
            }
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            _ => {}
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, event| match event {
            RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            RunEvent::WindowEvent {
                event: WindowEvent::CloseRequested { api, .. },
                ..
            } => {
                let window = _app_handle.get_window("main").unwrap();
                api.prevent_close();
                window.hide().unwrap();
            }
            _ => {}
        }
        );
}
