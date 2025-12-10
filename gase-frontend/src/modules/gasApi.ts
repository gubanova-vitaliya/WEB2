import { Gas } from "../store/slices/gasSlice";
import { GASES_MOCK } from "./mock";
import { getDestApi, getDestImg } from "../../target_config";

export interface GasFilters {
  search?: string;
}

// Функция для преобразования URL изображений MinIO в прокси URL
const transformImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  
  // Если URL указывает на MinIO (localhost:9000 или 127.0.0.1:9000), заменяем на прокси
  if (imageUrl.includes('localhost:9000') || imageUrl.includes('127.0.0.1:9000')) {
    // Извлекаем путь после домена (например: /gase/azot.webp)
    const urlParts = imageUrl.split('/');
    const pathIndex = urlParts.findIndex(part => part === 'gase' || part === 'gases');
    
    if (pathIndex !== -1) {
      let path = urlParts.slice(pathIndex).join('/');
      
      // Исправляем неправильное имя bucket: gase -> gases
      if (path.startsWith('gase/')) {
        path = path.replace('gase/', 'gases/');
      }
      
      return `${getDestImg()}/minio/${path}`;
    }
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
    // В production на GitHub Pages используем относительный путь /api/gases
    // который будет работать через прокси в dev, а в production вернет ошибку и переключится на mock
    const apiBase = getDestApi();
    const isProduction = import.meta.env.MODE === 'production';
    const isLocalhost = apiBase.includes('localhost') || apiBase.includes('127.0.0.1');
    
    // Если production и не localhost (GitHub Pages), используем относительный путь /api/gases
    // который будет работать через прокси в dev, а в production вернет 404 и переключится на mock
    let url: string;
    if (isProduction && !isLocalhost) {
      // На GitHub Pages используем относительный путь
      url = `/api/gases${queryString ? `?${queryString}` : ""}`;
    } else {
      // В development используем полный URL через прокси
      url = `${apiBase}/api/gases${queryString ? `?${queryString}` : ""}`;
    }

    const response = await fetch(url);
    
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
    // Ошибка ERR_CONNECTION_REFUSED или 404 - это нормально, когда бэкенд не запущен или недоступен
    // В этом случае просто используем mock данные без лишних сообщений
    const isConnectionError = 
      error.message?.includes('ERR_CONNECTION_REFUSED') ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('404') ||
      error.name === 'TypeError';
    
    // Не логируем ошибки подключения или 404, так как это ожидаемо на GitHub Pages
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
    // В production на GitHub Pages используем относительный путь /api/gases
    const apiBase = getDestApi();
    const isProduction = import.meta.env.MODE === 'production';
    const isLocalhost = apiBase.includes('localhost') || apiBase.includes('127.0.0.1');
    
    // Если production и не localhost (GitHub Pages), используем относительный путь
    let url: string;
    if (isProduction && !isLocalhost) {
      // На GitHub Pages используем относительный путь
      url = `/api/gases/${id}`;
    } else {
      // В development используем полный URL через прокси
      url = `${apiBase}/api/gases/${id}`;
    }
    
    const response = await fetch(url);
    
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
    // Ошибка подключения или 404 - это нормально, когда бэкенд не запущен или недоступен
    const isConnectionError = 
      error.message?.includes('ERR_CONNECTION_REFUSED') ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('404') ||
      error.name === 'TypeError';
    
    // Не логируем ошибки подключения или 404, так как это ожидаемо на GitHub Pages
    if (!isConnectionError) {
      console.warn("Error fetching gas, using mock data:", error.message || error);
    }
    
    // Используем mock данные при ошибке
    const mockGas = GASES_MOCK.find((gas) => gas.id === id);
    return mockGas || null;
  }
};
