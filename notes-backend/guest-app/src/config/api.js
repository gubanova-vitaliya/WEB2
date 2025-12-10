// Конфигурация API для гостевого приложения
// Использует IP адрес локальной сети (не localhost!) для подключения к Go backend

// Получаем IP адрес из переменной окружения или используем дефолтный
// ВАЖНО: Замените на ваш реальный IP адрес в локальной сети!
// Узнать IP: Windows - ipconfig, macOS/Linux - ifconfig
const LOCAL_NETWORK_IP = import.meta.env.VITE_API_IP || 'localhost';
const API_PORT = import.meta.env.VITE_API_PORT || '8080'; // Go backend на порту 8080
const MINIO_PORT = import.meta.env.VITE_MINIO_PORT || '9000'; // MinIO на порту 9000 (опционально)

export const API_BASE_URL = `http://${LOCAL_NETWORK_IP}:${API_PORT}`;
export const MINIO_BASE_URL = `http://${LOCAL_NETWORK_IP}:${MINIO_PORT}`;

// Функция для получения полного URL API
export const getApiUrl = (endpoint) => {
  // Убираем ведущий слэш если есть
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Функция для преобразования URL изображений MinIO
export const transformImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // Если URL указывает на MinIO (localhost:9000 или 127.0.0.1:9000), заменяем на IP адрес
  if (imageUrl.includes('localhost:9000') || imageUrl.includes('127.0.0.1:9000')) {
    // Извлекаем путь после домена (например: /gases/azot.webp)
    const urlParts = imageUrl.split('/');
    const pathIndex = urlParts.findIndex(part => part === 'gase' || part === 'gases');
    
    if (pathIndex !== -1) {
      let path = urlParts.slice(pathIndex).join('/');
      
      // Исправляем неправильное имя bucket: gase -> gases
      if (path.startsWith('gase/')) {
        path = path.replace('gase/', 'gases/');
      }
      
      // Используем прокси через API или прямой доступ к MinIO
      return `${API_BASE_URL}/api/minio/${path}`;
    }
  }
  
  // Если URL уже содержит IP адрес, оставляем как есть
  if (imageUrl.includes(LOCAL_NETWORK_IP)) {
    return imageUrl;
  }
  
  return imageUrl;
};

console.log(`🌐 API Base URL: ${API_BASE_URL}`);
console.log(`🖼️ MinIO Base URL: ${MINIO_BASE_URL}`);

