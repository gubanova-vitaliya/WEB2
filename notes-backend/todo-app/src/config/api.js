// Конфигурация API
const isDevelopment = import.meta.env.DEV;
const isTauri = window.__TAURI__ !== undefined;

// Настройки для разных режимов
const API_CONFIG = {
  // Режим разработки (Vite dev server)
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 5000
  },
  
  // Режим Tauri (desktop приложение)
  tauri: {
    // ВАЖНО: Замените на ваш реальный IP адрес в локальной сети
    // Узнать IP: Windows - ipconfig, macOS/Linux - ifconfig
    baseURL: 'http://192.168.1.105:3000', // Замените на ваш IP
    timeout: 10000
  },
  
  // Режим production (GitHub Pages)
  production: {
    // Для GitHub Pages используем mock данные или внешний API
    baseURL: 'https://jsonplaceholder.typicode.com', // Пример mock API
    timeout: 10000
  }
};

// Определяем текущий режим
let currentMode = 'development';

if (!isDevelopment) {
  currentMode = isTauri ? 'tauri' : 'production';
}

export const apiConfig = API_CONFIG[currentMode];

// Функция для получения полного URL
export const getApiUrl = (endpoint) => {
  return `${apiConfig.baseURL}${endpoint}`;
};

// Функция для определения режима работы
export const getMode = () => currentMode;

console.log(`API Mode: ${currentMode}`, apiConfig);
