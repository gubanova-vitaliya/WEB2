import { Gas } from "../slices/gasSlice";
import { GASES_MOCK } from "./mock";
import { getDestApi } from "../../target_config";

export interface GasFilters {
  search?: string;
}

// Инициализация fetch функции для Tauri
let fetchFunction: typeof fetch = window.fetch;

// Расширяем тип Window для Tauri
declare global {
  interface Window {
    __TAURI__?: any;
  }
}

// Асинхронная инициализация Tauri HTTP плагина
const initTauriFetch = async () => {
  if (window.__TAURI__) {
    try {
      const http = await import('@tauri-apps/plugin-http');
      fetchFunction = http.fetch as typeof fetch;
      console.log('✅ Tauri HTTP plugin initialized');
    } catch (e) {
      console.warn('⚠️ Tauri HTTP plugin not available, using window.fetch');
    }
  }
};

// Инициализируем при загрузке модуля
initTauriFetch();

// Функция для преобразования URL изображений MinIO в прокси URL
const transformImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) {
    console.log('⚠️ transformImageUrl: empty imageUrl');
    return null;
  }
  
  const apiBase = getDestApi();
  console.log(`🔄 transformImageUrl: input="${imageUrl}", apiBase="${apiBase}"`);
  
  // Если URL уже содержит IP адрес бэкенда (прокси через API), оставляем как есть
  if (apiBase && imageUrl.includes(apiBase)) {
    console.log(`✅ transformImageUrl: URL already contains apiBase, returning as is`);
    return imageUrl;
  }
  
  // Если путь начинается с /api/minio/, добавляем apiBase (бэкенд возвращает относительные пути)
  if (imageUrl.startsWith('/api/minio/')) {
    const fullUrl = `${apiBase}${imageUrl}`;
    console.log(`✅ transformImageUrl: relative /api/minio/ path → ${fullUrl}`);
    return fullUrl;
  }
  
  // Если URL указывает на MinIO напрямую (localhost:9000, 127.0.0.1:9000, или IP:9000), заменяем на прокси через API
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
      const fullUrl = `${apiBase}/api/minio/${path}`;
      console.log(`✅ transformImageUrl: MinIO URL → ${fullUrl}`);
      return fullUrl;
    }
  }
  
  // Если это относительный путь к изображению (начинается с /gases/ или /gase/)
  if (imageUrl.startsWith('/gases/') || imageUrl.startsWith('/gase/')) {
    const correctedPath = imageUrl.replace('/gase/', '/gases/');
    const fullUrl = `${apiBase}/api/minio${correctedPath}`;
    console.log(`✅ transformImageUrl: relative gases path → ${fullUrl}`);
    return fullUrl;
  }
  
  // Если это другой относительный путь, добавляем apiBase
  if (imageUrl.startsWith('/')) {
    const fullUrl = `${apiBase}${imageUrl}`;
    console.log(`✅ transformImageUrl: relative path → ${fullUrl}`);
    return fullUrl;
  }
  
  // Если это полный URL с другим доменом, оставляем как есть
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    console.log(`✅ transformImageUrl: full URL, returning as is`);
    return imageUrl;
  }
  
  // Если ничего не подошло, возвращаем как есть (может быть просто имя файла)
  console.warn(`⚠️ transformImageUrl: unknown format, returning as is: ${imageUrl}`);
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
    
    // Для Tauri всегда используем полный URL с IP адресом
    const url = `${apiBase}/api/gases${queryString ? `?${queryString}` : ""}`;

    console.log(`🔵 Fetching gases from: ${url}`);
    const response = await fetchFunction(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
    
    const transformedGases = data.map((gas: any) => {
      const originalImageUrl = gas.ImageURL || gas.image_url;
      const transformedUrl = transformImageUrl(originalImageUrl);
      
      const gasData = {
        id: gas.ID || gas.id,
        title: gas.Title || gas.title,
        formula: gas.Formula || gas.formula,
        molar_mass: gas.MolarMass || gas.molar_mass,
        image_url: transformedUrl || undefined,
        description: gas.Description || gas.description,
      };
      
      console.log(`📦 Gas [${gasData.title}]: originalImageUrl="${originalImageUrl}", transformedUrl="${gasData.image_url}"`);
      
      return gasData;
    });
    
    console.log(`✅ Successfully fetched ${transformedGases.length} gases from API`);
    return transformedGases;
  } catch (error: any) {
    // Перехватываем все ошибки: сетевые (ERR_CONNECTION_REFUSED), таймауты, 500, 404 и т.д.
    const isConnectionError = 
      error.message?.includes('ERR_CONNECTION_REFUSED') ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('404') ||
      error.name === 'TypeError';
    
    // Не логируем ошибки подключения, так как это нормально когда бэкенд не запущен
    if (!isConnectionError) {
      console.warn("Error fetching gases, using mock data:", error.message || error);
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
    const url = `${apiBase}/api/gases/${id}`;
    
    console.log(`🔵 Fetching gas ${id} from: ${url}`);
    const response = await fetchFunction(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Если ошибка сервера, используем mock данные
    if (!response.ok) {
      console.warn(`API returned ${response.status}, using mock data`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const originalImageUrl = data.ImageURL || data.image_url;
    const transformedUrl = transformImageUrl(originalImageUrl);
    
    if (originalImageUrl && transformedUrl) {
      console.log(`🖼️ Image URL transformed: ${originalImageUrl} → ${transformedUrl}`);
    }
    
    console.log(`✅ Successfully fetched gas ${id} from API`);
    return {
      id: data.ID || data.id,
      title: data.Title || data.title,
      formula: data.Formula || data.formula,
      molar_mass: data.MolarMass || data.molar_mass,
      image_url: transformedUrl || undefined,
      description: data.Description || data.description,
    };
  } catch (error: any) {
    // Ошибка подключения - это нормально, когда бэкенд не запущен
    const isConnectionError = 
      error.message?.includes('ERR_CONNECTION_REFUSED') ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('404') ||
      error.name === 'TypeError';
    
    // Не логируем ошибки подключения
    if (!isConnectionError) {
      console.warn("Error fetching gas, using mock data:", error.message || error);
    }
    
    // Используем mock данные при ошибке
    const mockGas = GASES_MOCK.find((gas) => gas.id === id);
    return mockGas || null;
  }
};

