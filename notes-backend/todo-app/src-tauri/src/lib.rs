use tauri::{CustomMenuItem, Menu, Submenu, WindowMenuEvent, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let new_todo = CustomMenuItem::new("new".to_string(), "Новая задача");
    let close = CustomMenuItem::new("quit".to_string(), "Выйти");
    let submenu = Submenu::new("Файл", Menu::new().add_item(new_todo).add_item(close));
    let menu = Menu::new().add_submenu(submenu);

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .menu(menu)
        .on_menu_event(|event: WindowMenuEvent| {
            match event.menu_item_id() {
                "quit" => {
                    std::process::exit(0);
                }
                "new" => {
                    event.window().emit("new-todo", "").unwrap();
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
