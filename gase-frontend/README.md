# Gas Project Frontend

React приложение для работы с газами и расчетами.

## Разработка

```bash
npm install
npm run dev
```

## Развертывание на GitHub Pages

### Важные аспекты для успешного деплоя

✅ **Роутинг настроен правильно:**
- `BrowserRouter` с `basename` настроен в `main.tsx`
- Все навигационные ссылки используют компонент `Link` из `react-router-dom`
- Все пути учитывают base path автоматически

✅ **Конфигурация Vite:**
- `vite.config.ts` настроен для работы с GitHub Pages
- Base path устанавливается автоматически через переменные окружения

✅ **Нет ошибок и предупреждений:**
- Проект проверен линтером
- Все компоненты корректно настроены

### Настройка

1. Убедитесь, что `gh-pages` установлен:
```bash
npm install
```

2. Перед сборкой для GitHub Pages установите переменные окружения:
   - `VITE_GITHUB_PAGES=true` - включает режим GitHub Pages
   - `VITE_REPO_NAME` - имя вашего репозитория (по умолчанию: `gas-project-frontend`)
     - Если репозиторий называется `username.github.io`, установите пустую строку: `VITE_REPO_NAME=""`
   - **Подключение к бэкенду** (опционально, аналогично Tauri):
     - `VITE_API_IP` - IP адрес бэкенда в локальной сети (например: `192.168.0.100`)
     - `VITE_API_PORT` - порт API (по умолчанию: `8080`)
     - `VITE_MINIO_PORT` - порт MinIO для изображений (по умолчанию: `9000`)
     - Или используйте `VITE_API_URL` для полного URL (например: `http://192.168.0.100:8080`)

### Сборка и деплой

       #### Вариант 1: Использование скрипта deploy (рекомендуется)

       ```bash
       # Windows (PowerShell) - без бэкенда (использует mock данные)
       $env:VITE_GITHUB_PAGES="true"; $env:VITE_REPO_NAME="gas-project-frontend"; npm run deploy

       # Windows (PowerShell) - с подключением к бэкенду через туннель
       # Сначала запустите туннель: npx localtunnel --port 8080
       # Затем используйте полученный HTTPS URL:
       $env:VITE_GITHUB_PAGES="true"; $env:VITE_REPO_NAME="gas-project-frontend"; $env:VITE_API_URL="https://xxx.loca.lt"; npm run deploy

# Windows (CMD)
set VITE_GITHUB_PAGES=true && set VITE_REPO_NAME=gas-project-frontend && npm run deploy

# Linux/Mac - без бэкенда
VITE_GITHUB_PAGES=true VITE_REPO_NAME=gas-project-frontend npm run deploy

# Linux/Mac - с подключением к бэкенду
VITE_GITHUB_PAGES=true VITE_REPO_NAME=gas-project-frontend VITE_API_IP=192.168.0.100 VITE_API_PORT=8080 npm run deploy
```

#### Вариант 2: Ручная сборка и деплой

```bash
# 1. Сборка с переменными окружения
# Windows (PowerShell) - без бэкенда
$env:VITE_GITHUB_PAGES="true"; $env:VITE_REPO_NAME="gas-project-frontend"; npm run build:gh-pages

       # Windows (PowerShell) - с подключением к бэкенду через туннель
       # Сначала запустите туннель: npx localtunnel --port 8080
       # Затем используйте полученный HTTPS URL:
       $env:VITE_GITHUB_PAGES="true"; $env:VITE_REPO_NAME="gas-project-frontend"; $env:VITE_API_URL="https://xxx.loca.lt"; npm run build:gh-pages

# Linux/Mac - без бэкенда
VITE_GITHUB_PAGES=true VITE_REPO_NAME=gas-project-frontend npm run build:gh-pages

# Linux/Mac - с подключением к бэкенду
VITE_GITHUB_PAGES=true VITE_REPO_NAME=gas-project-frontend VITE_API_IP=192.168.0.100 VITE_API_PORT=8080 npm run build:gh-pages

# 2. Деплой
npm run deploy
```

### Настройка в GitHub

1. Перейдите в Settings → Pages вашего репозитория
2. Выберите источник: `gh-pages` branch
3. Сохраните настройки

После деплоя приложение будет доступно по адресу:
- `https://username.github.io/gas-project-frontend/` (если указано имя репозитория)
- `https://username.github.io/` (если репозиторий называется `username.github.io`)

### Важные замечания

- ⚠️ **Имя репозитория:** Убедитесь, что `VITE_REPO_NAME` совпадает с реальным именем репозитория на GitHub
- ⚠️ **AJAX запросы:** При развертывании на GitHub Pages, AJAX запросы будут идти по http, в то время как приложение доступно по https. Работать это будет только при использовании адреса `localhost` в AJAX запросах или при настройке CORS на бекенде
- ⚠️ **Бекенд API:** 
  - По умолчанию бекенд API не будет работать на GitHub Pages (только статический фронтенд)
  - Для подключения к бэкенду укажите `VITE_API_IP` и `VITE_API_PORT` (аналогично Tauri) или `VITE_API_URL`
  - Убедитесь, что бэкенд доступен из интернета или настраивает CORS для разрешения запросов с GitHub Pages
- ✅ **Mock данные:** В режиме GitHub Pages приложение автоматически использует mock данные при недоступности API
- ✅ **Роутинг:** Все ссылки используют `Link` компонент, который автоматически учитывает `basename`
- ✅ **Подключение к бэкенду:** Используйте те же переменные окружения, что и для Tauri (`VITE_API_IP`, `VITE_API_PORT`)

## Progressive Web Application (PWA)

Приложение настроено как PWA и может быть установлено на устройство.

### Требования для PWA:

1. **Создайте PNG иконки** (см. `PWA_SETUP.md`):
   - `public/logo192.png` (192x192 пикселей)
   - `public/logo512.png` (512x512 пикселей)

2. **Проверка PWA**:
   - Откройте DevTools → Application → Manifest
   - Убедитесь, что нет ошибок
   - Проверьте Service Worker во вкладке Service Workers

3. **Установка**:
   - В браузере появится иконка установки приложения
   - На Android: меню → "Добавить на главный экран"
   - На iOS: кнопка "Поделиться" → "На экран «Домой»"

### Особенности PWA:

- ✅ Работа в оффлайн режиме (после первой загрузки)
- ✅ Кеширование изображений и API запросов
- ✅ Автоматическое обновление Service Worker
- ✅ Иконка приложения на рабочем столе
- ✅ Запуск в полноэкранном режиме (standalone)

Подробнее см. `PWA_SETUP.md`

## Настройка HTTPS для локальной разработки

Для работы PWA на мобильных устройствах необходимо использовать HTTPS. 

### Быстрый старт:

1. **Установите mkcert:**
   ```bash
   npm install -g mkcert
   ```

2. **Создайте сертификаты:**
   ```bash
   cd gase-frontend
   mkcert create-ca
   mkcert create-cert
   ```

3. **Запустите приложение:**
   ```bash
   npm run dev
   ```

Приложение будет доступно по `https://localhost:3000` и по IP-адресу вашего компьютера для доступа с мобильных устройств.

⚠️ **Важно:** Приватные ключи (`.key` файлы) уже добавлены в `.gitignore` и не должны попадать в репозиторий!

Подробная инструкция: `HTTPS_SETUP.md`

## Адаптивный дизайн

Приложение полностью адаптировано для работы на всех устройствах:

- ✅ **Desktop** (> 768px): Полная функциональность, оптимальная компоновка
- ✅ **Tablet** (≤ 768px): Адаптированная навигация, 2 карточки в ряд
- ✅ **Mobile** (≤ 480px): Бургер-меню, вертикальная компоновка карточек

### Особенности:

- **Flexbox layout** для гибкой компоновки карточек
- **Адаптивная навигация** с бургер-меню на мобильных
- **Оптимизированные изображения** для разных размеров экрана
- **Touch-friendly** интерфейс для мобильных устройств

Подробнее см. `RESPONSIVE_DESIGN.md`

