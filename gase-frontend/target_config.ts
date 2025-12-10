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
export const api_proxy_addr = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const notes_api_addr = import.meta.env.VITE_NOTES_API_URL || 'http://localhost:8081';
export const img_proxy_addr = import.meta.env.VITE_IMG_PROXY_URL || 'http://localhost:8080';

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

