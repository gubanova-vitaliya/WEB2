// Конфигурация для Tauri приложения
// Использует IP адрес локальной сети для подключения к Go backend

// Получаем IP адрес из переменной окружения или используем дефолтный
const API_IP = import.meta.env.VITE_API_IP || '192.168.0.100';
const API_PORT = import.meta.env.VITE_API_PORT || '8080';

// Для Tauri всегда используем корневой путь (нет GitHub Pages)
export const dest_root = '';

// API адреса - используем IP адрес локальной сети
export const api_proxy_addr = `http://${API_IP}:${API_PORT}`;
export const notes_api_addr = import.meta.env.VITE_NOTES_API_URL || `http://${API_IP}:8081`;
export const img_proxy_addr = import.meta.env.VITE_IMG_PROXY_URL || `http://${API_IP}:${API_PORT}`;

// Функции для получения конфигурации
export function getDestRoot(): string {
  return dest_root;
}

export function getDestApi(): string {
  return api_proxy_addr;
}

export function getDestImg(): string {
  return img_proxy_addr;
}




