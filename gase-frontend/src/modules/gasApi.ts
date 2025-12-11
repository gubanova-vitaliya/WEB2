import { Gas } from "../store/slices/gasSlice";
import { GASES_MOCK } from "./mock";
import { getDestApi, getDestImg } from "../../target_config";

export interface GasFilters {
  search?: string;
}

// Функция для преобразования URL изображений MinIO в прокси URL
const transformImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  
  const imgProxy = getDestImg();
  
  // Если URL уже содержит адрес прокси, оставляем как есть
  if (imgProxy && imageUrl.includes(imgProxy)) {
    return imageUrl;
  }
  
  // Если URL указывает на MinIO (localhost:9000, 127.0.0.1:9000, или IP:9000), заменяем на прокси
  const minioPattern = /(localhost|127\.0\.0\.1|\d+\.\d+\.\d+\.\d+):9000/;
  if (minioPattern.test(imageUrl)) {
    // Извлекаем путь после домена (например: /gases/azot.webp или /gase/azot.webp)
    const urlParts = imageUrl.split('/');
    const pathIndex = urlParts.findIndex(part => part === 'gase' || part === 'gases');
    
    if (pathIndex !== -1) {
      let path = urlParts.slice(pathIndex).join('/');
      
      // Исправляем неправильное имя bucket: gase -> gases
      if (path.startsWith('gase/')) {
        path = path.replace('gase/', 'gases/');
      }
      
      // Используем прокси через Go backend API
      if (imgProxy && imgProxy !== '') {
        return `${imgProxy}/api/minio/${path}`;
      } else {
        // Если прокси не настроен, используем относительный путь
        return `/api/minio/${path}`;
      }
    }
  }
  
  // Если это относительный путь, преобразуем в полный URL через прокси
  if (imageUrl.startsWith('/')) {
    if (imgProxy && imgProxy !== '') {
      return `${imgProxy}${imageUrl}`;
    }
    return imageUrl;
  }
  
  return imageUrl;
};

export const getGases = async (filters?: GasFilters): Promise<Gas[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.search) {
      params.append("search", filters.search);
    }

    const queryString = params.toString();
    const apiBase = getDestApi();
    
    // Определяем, работаем ли мы на GitHub Pages (HTTPS)
    const isGitHubPages = typeof window !== 'undefined' && 
      (window.location.hostname.includes('github.io') || 
       (window.location.protocol === 'https:' && !window.location.hostname.includes('localhost')));
    
    // Формируем URL для запроса
    let url: string;
    
    // Если мы на GitHub Pages (HTTPS), ВСЕГДА проверяем протокол URL
    if (isGitHubPages) {
      // Вариант 1: Если указан HTTPS URL (туннель или публичный сервер), используем его
      if (apiBase && apiBase.startsWith('https://')) {
        url = `${apiBase}/api/gases${queryString ? `?${queryString}` : ""}`;
        console.log(`🔵 GitHub Pages detected, using HTTPS URL: ${url}`);
      }
      // Вариант 2: Если указан CORS proxy (HTTPS), используем его
      else if (apiBase && apiBase.startsWith('https://') && (apiBase.includes('corsproxy.io') || apiBase.includes('cors-anywhere') || apiBase.includes('corsproxy'))) {
        url = `${apiBase}/api/gases${queryString ? `?${queryString}` : ""}`;
        console.log(`🔵 GitHub Pages detected, using CORS proxy: ${url}`);
      }
      // Вариант 3: Если указан HTTP URL или нет URL, сразу используем моки
      // (браузеры блокируют mixed content, поэтому HTTP не будет работать)
      else {
        console.log(`🌐 GitHub Pages detected, using mock data (no HTTPS backend configured)`);
        // Сразу возвращаем моки без попытки подключения
        let mockGases = [...GASES_MOCK];
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          mockGases = mockGases.filter(
            (gas) =>
              gas.title.toLowerCase().includes(searchLower) ||
              gas.formula.toLowerCase().includes(searchLower)
          );
        }
        return mockGases;
      }
    } else if (apiBase && apiBase !== '') {
      // Для других окружений используем полный URL
      // Убеждаемся, что URL начинается с http:// (не https://)
      let baseUrl = apiBase;
      if (baseUrl.startsWith('https://')) {
        baseUrl = baseUrl.replace('https://', 'http://');
      } else if (!baseUrl.startsWith('http://')) {
        baseUrl = `http://${baseUrl}`;
      }
      // Используем new URL() для создания абсолютного URL с явным протоколом
      try {
        const urlObj = new URL('/api/gases', baseUrl);
        if (queryString) {
          urlObj.search = queryString;
        }
        url = urlObj.toString();
        // Принудительно заменяем https:// на http:// если браузер все равно изменил протокол
        if (url.startsWith('https://')) {
          url = url.replace('https://', 'http://');
        }
      } catch (e) {
        // Fallback на строковую конкатенацию
        url = `${baseUrl}/api/gases${queryString ? `?${queryString}` : ""}`;
        // Принудительно заменяем https:// на http://
        if (url.startsWith('https://')) {
          url = url.replace('https://', 'http://');
        }
      }
    } else {
      // Если API URL не указан, используем относительный путь
      url = `/api/gases${queryString ? `?${queryString}` : ""}`;
    }
    
    console.log(`🔵 Fetching gases from: ${url}`);
    console.log(`🔵 URL protocol: ${url.startsWith('http://') ? 'HTTP' : url.startsWith('https://') ? 'HTTPS' : 'RELATIVE'}`);

    // Используем fetch с явным указанием режима для предотвращения автоматического изменения протокола
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors', // Явно указываем CORS режим
      credentials: 'omit', // Не отправляем cookies для безопасности
    });
    
    // Если ошибка сервера, используем mock данные
    if (!response.ok) {
      console.warn(`API returned ${response.status}, using mock data`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Проверяем, что получили массив
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format");
    }
    
    return data.map((gas: any) => ({
      id: gas.ID || gas.id,
      title: gas.Title || gas.title,
      formula: gas.Formula || gas.formula,
      molar_mass: gas.MolarMass || gas.molar_mass,
      image_url: transformImageUrl(gas.ImageURL || gas.image_url) || undefined,
      description: gas.Description || gas.description,
    }));
  } catch (error: any) {
    // Перехватываем все ошибки: сетевые (ERR_CONNECTION_REFUSED), таймауты, 500, 404 и т.д.
    // Ошибка ERR_CONNECTION_REFUSED, ERR_SSL_PROTOCOL_ERROR или 404 - это нормально, когда бэкенд не запущен или недоступен
    // В этом случае просто используем mock данные без лишних сообщений
    const isConnectionError = 
      error.message?.includes('ERR_CONNECTION_REFUSED') ||
      error.message?.includes('ERR_SSL_PROTOCOL_ERROR') ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('404') ||
      error.message?.includes('Mixed Content') ||
      error.name === 'TypeError';
    
    // Не логируем ошибки подключения, SSL или 404, так как это ожидаемо на GitHub Pages
    // (браузеры блокируют HTTP запросы с HTTPS страниц)
    if (!isConnectionError) {
      console.warn("Error fetching gases, using mock data:", error.message || error);
    } else {
      console.log("⚠️ Backend недоступен (ожидаемо для GitHub Pages из-за mixed content), используем mock данные");
    }
    
    // Используем mock данные при любой ошибке
    let mockGases = [...GASES_MOCK];
    
    // Применяем фильтры к mock данным
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      mockGases = mockGases.filter(
        (gas) =>
          gas.title.toLowerCase().includes(searchLower) ||
          gas.formula.toLowerCase().includes(searchLower)
      );
    }

    return mockGases;
  }
};

export const getGasById = async (id: number): Promise<Gas | null> => {
  try {
    const apiBase = getDestApi();
    
    // Определяем, работаем ли мы на GitHub Pages (HTTPS)
    const isGitHubPages = typeof window !== 'undefined' && 
      (window.location.hostname.includes('github.io') || window.location.protocol === 'https:');
    
    // Формируем URL для запроса
    let url: string;
    
    // Если мы на GitHub Pages (HTTPS), проверяем различные варианты подключения
    if (isGitHubPages) {
      // Вариант 1: Если указан HTTPS URL (туннель или публичный сервер), используем его
      if (apiBase && apiBase.startsWith('https://')) {
        url = `${apiBase}/api/gases/${id}`;
        console.log(`🔵 GitHub Pages detected, using HTTPS URL: ${url}`);
      }
      // Вариант 2: Если указан CORS proxy (HTTPS), используем его
      else if (apiBase && apiBase.startsWith('https://') && (apiBase.includes('corsproxy.io') || apiBase.includes('cors-anywhere') || apiBase.includes('corsproxy'))) {
        url = `${apiBase}/api/gases/${id}`;
        console.log(`🔵 GitHub Pages detected, using CORS proxy: ${url}`);
      }
      // Вариант 3: Если указан HTTP URL или нет URL, сразу используем моки
      // (браузеры блокируют mixed content, поэтому HTTP не будет работать)
      else {
        console.log(`🌐 GitHub Pages detected, using mock data (no HTTPS backend configured)`);
        // Сразу возвращаем мок без попытки подключения
        const mockGas = GASES_MOCK.find((gas) => gas.id === id);
        return mockGas || null;
      }
    } else if (apiBase && apiBase !== '') {
      // Для других окружений используем полный URL
      // Убеждаемся, что URL начинается с http:// (не https://)
      let baseUrl = apiBase;
      if (baseUrl.startsWith('https://')) {
        baseUrl = baseUrl.replace('https://', 'http://');
      } else if (!baseUrl.startsWith('http://')) {
        baseUrl = `http://${baseUrl}`;
      }
      // Используем new URL() для создания абсолютного URL с явным протоколом
      try {
        const urlObj = new URL(`/api/gases/${id}`, baseUrl);
        url = urlObj.toString();
        // Принудительно заменяем https:// на http:// если браузер все равно изменил протокол
        if (url.startsWith('https://')) {
          url = url.replace('https://', 'http://');
        }
      } catch (e) {
        // Fallback на строковую конкатенацию
        url = `${baseUrl}/api/gases/${id}`;
        // Принудительно заменяем https:// на http://
        if (url.startsWith('https://')) {
          url = url.replace('https://', 'http://');
        }
      }
    } else {
      // Если API URL не указан, используем относительный путь
      url = `/api/gases/${id}`;
    }
    
    console.log(`🔵 Fetching gas ${id} from: ${url}`);
    console.log(`🔵 URL protocol: ${url.startsWith('http://') ? 'HTTP' : url.startsWith('https://') ? 'HTTPS' : 'RELATIVE'}`);
    
    // Используем fetch с явным указанием режима для предотвращения автоматического изменения протокола
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors', // Явно указываем CORS режим
      credentials: 'omit', // Не отправляем cookies для безопасности
    });
    
    // Если ошибка сервера, используем mock данные
    if (!response.ok) {
      console.warn(`API returned ${response.status}, using mock data`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      id: data.ID || data.id,
      title: data.Title || data.title,
      formula: data.Formula || data.formula,
      molar_mass: data.MolarMass || data.molar_mass,
      image_url: transformImageUrl(data.ImageURL || data.image_url) || undefined,
      description: data.Description || data.description,
    };
  } catch (error: any) {
    // Ошибка подключения, SSL или 404 - это нормально, когда бэкенд не запущен или недоступен
    const isConnectionError = 
      error.message?.includes('ERR_CONNECTION_REFUSED') ||
      error.message?.includes('ERR_SSL_PROTOCOL_ERROR') ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('404') ||
      error.message?.includes('Mixed Content') ||
      error.name === 'TypeError';
    
    // Не логируем ошибки подключения, SSL или 404, так как это ожидаемо на GitHub Pages
    // (браузеры блокируют HTTP запросы с HTTPS страниц)
    if (!isConnectionError) {
      console.warn("Error fetching gas, using mock data:", error.message || error);
    } else {
      console.log("⚠️ Backend недоступен (ожидаемо для GitHub Pages из-за mixed content), используем mock данные");
    }
    
    // Используем mock данные при ошибке
    const mockGas = GASES_MOCK.find((gas) => gas.id === id);
    return mockGas || null;
  }
};

