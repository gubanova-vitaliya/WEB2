// Конфигурация для разных окружений (development, production, GitHub Pages)

// Определяем окружение
const isDevelopment = import.meta.env.DEV;

// Имя репозитория для GitHub Pages (можно переопределить через переменную окружения)
// Если репозиторий называется username.github.io, то используйте пустую строку
const REPO_NAME = import.meta.env.VITE_REPO_NAME || 'gas-project-frontend';

// Base path для GitHub Pages
const GITHUB_PAGES_BASE = REPO_NAME ? `/${REPO_NAME}/` : '/';

// Base path для разных окружений
// В development используем пустую строку
// В production всегда используем путь репозитория (для GitHub Pages)
// Можно переопределить через VITE_GITHUB_PAGES=false для локального production
const forceLocalProduction = import.meta.env.VITE_GITHUB_PAGES === 'false';
export const dest_root = isDevelopment ? '' : (forceLocalProduction ? '/' : GITHUB_PAGES_BASE);

// API адреса
// Для GitHub Pages можно указать IP адрес бэкенда через VITE_API_URL
// Формат: http://192.168.0.100:8080 или https://your-backend-domain.com
// Если не указано, используется localhost:8080 (для dev) или относительные пути (для GitHub Pages)
const getApiUrl = () => {
  // Если указан явный URL через переменную окружения, используем его
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // В development используем localhost
  if (isDevelopment) {
    return 'http://localhost:8080';
  }
  
  // В production на GitHub Pages без явного URL используем относительные пути
  // (которые не будут работать, но переключатся на mock данные)
  return '';
};

export const api_proxy_addr = getApiUrl();
export const notes_api_addr = import.meta.env.VITE_NOTES_API_URL || 'http://localhost:8081';
export const img_proxy_addr = import.meta.env.VITE_IMG_PROXY_URL || import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Функции для получения конфигурации (для обратной совместимости)
export function getDestRoot(): string {
  return dest_root;
}

export function getDestApi(): string {
  return api_proxy_addr;
}

export function getDestImg(): string {
  return img_proxy_addr;
}

