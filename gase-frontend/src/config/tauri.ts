// Конфигурация для Tauri приложения

// Проверяем, запущено ли приложение в Tauri
export const isTauri = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).__TAURI__;
};

// Базовые URL для API в зависимости от среды
export const API_BASE_URL = isTauri() 
  ? 'http://localhost:8080' 
  : '';

export const MINIO_BASE_URL = isTauri() 
  ? 'http://localhost:9000' 
  : '';

// Настройки для разных сред
export const APP_CONFIG = {
  // В Tauri используем прямые URL к серверам
  tauri: {
    apiUrl: 'http://localhost:8080',
    minioUrl: 'http://localhost:9000',
    useProxy: false
  },
  // В браузере используем прокси через Vite
  web: {
    apiUrl: '',
    minioUrl: '',
    useProxy: true
  }
};

// Получить текущую конфигурацию
export const getCurrentConfig = () => {
  return isTauri() ? APP_CONFIG.tauri : APP_CONFIG.web;
};

// Логирование для отладки
export const logEnvironment = () => {
  const config = getCurrentConfig();
  console.log('🔧 Environment:', isTauri() ? 'Tauri Desktop' : 'Web Browser');
  console.log('📡 API URL:', config.apiUrl || 'proxy');
  console.log('🖼️ MinIO URL:', config.minioUrl || 'proxy');
};

