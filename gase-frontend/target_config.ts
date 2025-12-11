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
// Для GitHub Pages можно указать IP адрес бэкенда через:
// 1. VITE_API_URL - полный URL (http://192.168.0.100:8080 или https://your-backend-domain.com)
// 2. VITE_API_IP + VITE_API_PORT - IP адрес и порт (как в Tauri)
// 3. VITE_CORS_PROXY - URL CORS proxy (например, https://cors-anywhere.herokuapp.com/)
// Если не указано, используется localhost:8080 (для dev) или относительные пути для GitHub Pages
const getApiUrl = () => {
  // Приоритет 1: Если указан явный полный URL через переменную окружения, используем его
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Приоритет 2: Если указан CORS proxy, используем его
  const CORS_PROXY = import.meta.env.VITE_CORS_PROXY;
  if (CORS_PROXY) {
    const API_IP = import.meta.env.VITE_API_IP || '192.168.0.100';
    const API_PORT = import.meta.env.VITE_API_PORT || '8080';
    // Формируем URL для CORS proxy
    if (CORS_PROXY.endsWith('?') || CORS_PROXY.endsWith('/')) {
      return `${CORS_PROXY}http://${API_IP}:${API_PORT}`;
    } else {
      return `${CORS_PROXY}/http://${API_IP}:${API_PORT}`;
    }
  }
  
  // Приоритет 3: Если указан IP адрес (как в Tauri), формируем URL
  const API_IP = import.meta.env.VITE_API_IP;
  const API_PORT = import.meta.env.VITE_API_PORT || '8080';
  
  if (API_IP) {
    return `http://${API_IP}:${API_PORT}`;
  }
  
  // В development используем localhost
  if (isDevelopment) {
    return 'http://localhost:8080';
  }
  
  // В production на GitHub Pages используем относительные пути по умолчанию
  // Для работы с локальным бэкендом нужно использовать один из вариантов:
  // 1. Туннель (ngrok): запустите ngrok http 192.168.0.100:8080 и укажите VITE_API_URL=https://xxx.ngrok.io
  // 2. CORS proxy: укажите VITE_CORS_PROXY=https://corsproxy.io/? и VITE_API_IP=192.168.0.100
  // 3. HTTPS на бэкенде: настройте SSL и укажите VITE_API_URL=https://your-backend.com
  // По умолчанию используем относительные пути (переключится на mock данные)
  return '';
};

// Аналогично для MinIO (изображения)
const getImgProxyUrl = () => {
  // Приоритет 1: Явный URL для изображений
  if (import.meta.env.VITE_IMG_PROXY_URL) {
    return import.meta.env.VITE_IMG_PROXY_URL;
  }
  
  // Приоритет 2: Если указан IP адрес (как в Tauri), используем его для MinIO
  const API_IP = import.meta.env.VITE_API_IP;
  const MINIO_PORT = import.meta.env.VITE_MINIO_PORT || '9000';
  
  if (API_IP) {
    return `http://${API_IP}:${MINIO_PORT}`;
  }
  
  // Приоритет 3: Используем тот же API URL, если указан полный URL
  const apiUrl = getApiUrl();
  if (apiUrl && apiUrl !== 'http://localhost:8080') {
    // Если API URL указывает на порт 8080, заменяем на MinIO порт
    if (apiUrl.includes(':8080')) {
      return apiUrl.replace(':8080', `:${MINIO_PORT}`);
    }
    return apiUrl;
  }
  
  // По умолчанию для production используем дефолтный IP с MinIO портом
  if (!isDevelopment) {
    return 'http://192.168.0.100:9000';
  }
  
  return 'http://localhost:8080';
};

export const api_proxy_addr = getApiUrl();
export const notes_api_addr = import.meta.env.VITE_NOTES_API_URL || 'http://localhost:8081';
export const img_proxy_addr = getImgProxyUrl();

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

// Логирование конфигурации (аналогично Tauri)
if (typeof window !== 'undefined') {
  const API_IP = import.meta.env.VITE_API_IP || (isDevelopment ? 'localhost' : 'не указан');
  const API_PORT = import.meta.env.VITE_API_PORT || '8080';
  const MINIO_PORT = import.meta.env.VITE_MINIO_PORT || '9000';
  const isGitHubPages = window.location.hostname.includes('github.io') || 
    (window.location.protocol === 'https:' && !window.location.hostname.includes('localhost'));
  
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🔧 Конфигурация подключения к бэкенду:`);
  console.log(`   Окружение: ${isDevelopment ? 'Development' : isGitHubPages ? 'GitHub Pages (HTTPS)' : 'Production'}`);
  console.log(`   IP адрес: ${API_IP}`);
  console.log(`   API порт: ${API_PORT}`);
  console.log(`   MinIO порт: ${MINIO_PORT}`);
  console.log(`   🌐 API Base URL: ${api_proxy_addr || 'относительные пути (mock данные)'}`);
  console.log(`   🖼️ MinIO Base URL: ${img_proxy_addr || 'относительные пути'}`);
  console.log(`   📁 Base path: ${dest_root || '/'}`);
  if (isGitHubPages && api_proxy_addr && api_proxy_addr.startsWith('http://')) {
    console.log(`   ⚠️  HTTP URL будет игнорирован на GitHub Pages (mixed content)`);
  }
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

