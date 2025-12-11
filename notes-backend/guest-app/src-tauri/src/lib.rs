#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    println!("Starting Tauri application...");
    
    let builder = tauri::Builder::default();
    
    // Временно отключаем плагины для диагностики
    // println!("Initializing plugins...");
    // let builder = builder.plugin(tauri_plugin_opener::init());
    // println!("Opener plugin initialized");
    // let builder = builder.plugin(tauri_plugin_http::init());
    // println!("HTTP plugin initialized");
    
    println!("Generating context...");
    let context = tauri::generate_context!();
    println!("Context generated");
    
    println!("Running Tauri application...");
    match builder.run(context) {
        Ok(_) => {
            println!("Tauri application exited successfully");
        }
        Err(e) => {
            eprintln!("Failed to run Tauri application: {}", e);
            eprintln!("Error details: {:?}", e);
            std::process::exit(1);
        }
    }
}




