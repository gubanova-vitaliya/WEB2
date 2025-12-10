import { getApiUrl, transformImageUrl } from '../config/api';

// Mock данные для использования при ошибках подключения
const GASES_MOCK = [
  {
    id: 1,
    title: "Водород",
    formula: "H₂",
    molar_mass: 2.016,
    image_url: '/gas-images/i.webp',
    description: "Самый легкий химический элемент, бесцветный газ без запаха и вкуса.",
  },
  {
    id: 2,
    title: "Кислород",
    formula: "O₂",
    molar_mass: 32.0,
    image_url: '/gas-images/i.webp',
    description: "Жизненно важный газ, необходимый для дыхания большинства живых организмов.",
  },
  {
    id: 3,
    title: "Азот",
    formula: "N₂",
    molar_mass: 28.014,
    image_url: '/gas-images/i.webp',
    description: "Инертный газ, составляющий основную часть атмосферы Земли.",
  },
  {
    id: 4,
    title: "Углекислый газ",
    formula: "CO₂",
    molar_mass: 44.01,
    image_url: '/gas-images/i.webp',
    description: "Газ, образующийся при дыхании и сжигании органических веществ.",
  },
  {
    id: 5,
    title: "Метан",
    formula: "CH₄",
    molar_mass: 16.043,
    image_url: '/gas-images/i.webp',
    description: "Основной компонент природного газа, простейший углеводород.",
  },
  {
    id: 6,
    title: "Гелий",
    formula: "He",
    molar_mass: 4.003,
    image_url: '/gas-images/i.webp',
    description: "Инертный газ, второй по легкости элемент, используется в воздушных шарах.",
  },
];

// Инициализация fetch функции для Tauri
let fetchFunction = window.fetch;

// Асинхронная инициализация Tauri HTTP плагина
const initTauriFetch = async () => {
  if (window.__TAURI__) {
    try {
      const http = await import('@tauri-apps/plugin-http');
      fetchFunction = http.fetch;
    } catch (e) {
      console.warn('Tauri HTTP plugin not available, using window.fetch');
    }
  }
};

// Инициализируем при загрузке модуля
initTauriFetch();

// Получение всех газов с фильтрацией (только чтение)
export async function getGases(filters) {
    try {
        const params = new URLSearchParams();
        if (filters?.search) {
            params.append("search", filters.search);
        }
        if (filters?.minMolarMass !== undefined) {
            params.append("min_molar_mass", filters.minMolarMass.toString());
        }
        if (filters?.maxMolarMass !== undefined) {
            params.append("max_molar_mass", filters.maxMolarMass.toString());
        }

        const queryString = params.toString();
        const url = getApiUrl(`api/gases${queryString ? `?${queryString}` : ""}`);

        const response = await fetchFunction(url, {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            
            // Проверяем, что получили массив
            if (!Array.isArray(data)) {
                throw new Error("Invalid response format");
            }
            
            // Преобразуем данные в единый формат
            return data.map((gas) => ({
                id: gas.ID || gas.id,
                title: gas.Title || gas.title,
                formula: gas.Formula || gas.formula,
                molar_mass: gas.MolarMass || gas.molar_mass,
                image_url: transformImageUrl(gas.ImageURL || gas.image_url),
                description: gas.Description || gas.description,
            }));
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        // Проверяем, является ли это ошибкой подключения
        const isConnectionError = 
            error.message?.includes('ERR_CONNECTION_REFUSED') ||
            error.message?.includes('Failed to fetch') ||
            error.message?.includes('NetworkError') ||
            error.name === 'TypeError';
        
        // Не логируем ошибки подключения, так как это нормально когда бэкенд не запущен
        if (!isConnectionError) {
            console.warn('Error fetching gases, using mock data:', error.message || error);
        }
        
        // Применяем фильтры к mock данным
        let mockGases = [...GASES_MOCK];
        
        if (filters?.minMolarMass !== undefined) {
            mockGases = mockGases.filter(gas => gas.molar_mass >= filters.minMolarMass);
        }
        if (filters?.maxMolarMass !== undefined) {
            mockGases = mockGases.filter(gas => gas.molar_mass <= filters.maxMolarMass);
        }
        if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            mockGases = mockGases.filter(
                gas => gas.title.toLowerCase().includes(searchLower) ||
                       gas.formula.toLowerCase().includes(searchLower)
            );
        }
        
        // Сортируем по молярной массе
        mockGases.sort((a, b) => a.molar_mass - b.molar_mass);
        
        // Возвращаем mock данные при ошибке
        return mockGases;
    }
}

// Получение газа по ID (только чтение)
export async function getGasById(id) {
    try {
        const url = getApiUrl(`api/gases/${id}`);
        const response = await fetchFunction(url, {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            return {
                id: data.ID || data.id,
                title: data.Title || data.title,
                formula: data.Formula || data.formula,
                molar_mass: data.MolarMass || data.molar_mass,
                image_url: transformImageUrl(data.ImageURL || data.image_url),
                description: data.Description || data.description,
            };
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        // Проверяем, является ли это ошибкой подключения
        const isConnectionError = 
            error.message?.includes('ERR_CONNECTION_REFUSED') ||
            error.message?.includes('Failed to fetch') ||
            error.message?.includes('NetworkError') ||
            error.name === 'TypeError';
        
        // Не логируем ошибки подключения
        if (!isConnectionError) {
            console.warn('Error fetching gas, using mock data:', error.message || error);
        }
        
        // Используем mock данные при ошибке
        const mockGas = GASES_MOCK.find(gas => gas.id === id);
        return mockGas || null;
    }
}

