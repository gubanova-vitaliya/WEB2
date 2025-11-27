# 🎯 WEB2 - Complete Tauri Todo Application

## 📋 Описание проекта

Полнофункциональное приложение для управления задачами, созданное с использованием современных веб-технологий и Tauri для создания нативного desktop приложения.

## 🚀 Технологии

### Frontend
- **React 19** - современная библиотека для создания пользовательских интерфейсов
- **Redux Toolkit** - управление состоянием приложения
- **React Router DOM** - маршрутизация в SPA
- **Vite** - быстрый сборщик и dev-сервер

### Backend
- **Express.js** - веб-фреймворк для Node.js
- **Morgan** - логирование HTTP запросов
- **CORS** - поддержка кросс-доменных запросов
- **Валидация** - middleware для проверки данных

### Desktop приложение
- **Tauri 2.0** - фреймворк для создания нативных приложений
- **Rust** - системный язык программирования для backend части Tauri

### PWA и деплой
- **Service Worker** - офлайн поддержка
- **Web App Manifest** - установка как нативное приложение
- **GitHub Pages** - хостинг статических файлов
- **GitHub Actions** - автоматический CI/CD

## ✨ Функциональность

### 🎯 Основные возможности
- ✅ **CRUD операции** с задачами (создание, чтение, обновление, удаление)
- ✅ **Фильтрация и поиск** задач по названию и содержанию
- ✅ **Redux состояние** сохраняется между страницами
- ✅ **Адаптивный дизайн** для desktop, tablet, mobile
- ✅ **PWA поддержка** - работает офлайн, устанавливается как приложение

### 🖥️ Tauri Desktop приложение
- ✅ **Нативные диалоги** для подтверждения действий
- ✅ **Системное меню** с горячими клавишами
- ✅ **Подключение к API** по IP в локальной сети
- ✅ **Безопасные HTTP запросы** через Tauri API

### 🛒 Дополнительные функции
- ✅ **Корзина товаров** с Redux Toolkit
- ✅ **AJAX запросы** к внешнему API (fakestoreapi.com)
- ✅ **Гостевой интерфейс** с 3 страницами
- ✅ **Галерея изображений** с фильтрацией по категориям

## 🏗️ Структура проекта

```
WEB2/
├── notes-backend/                 # Backend сервер
│   ├── index.js                  # Express сервер с CRUD API
│   ├── middleware/               # Валидация и логирование
│   └── todo-app/                 # Frontend приложение
│       ├── src/
│       │   ├── api/              # API клиент
│       │   ├── app/              # Основные компоненты приложения
│       │   ├── components/       # UI компоненты
│       │   ├── pages/            # Страницы приложения
│       │   ├── store/            # Redux Toolkit store и slices
│       │   └── config/           # Конфигурация API
│       ├── src-tauri/            # Tauri приложение
│       │   ├── src/              # Rust код
│       │   ├── capabilities/     # Разрешения безопасности
│       │   └── icons/            # Иконки приложения
│       └── public/               # Статические файлы
├── gase-frontend/                # Дополнительный frontend (газы)
└── docs/                         # Документация API
```

## 🚀 Быстрый старт

### 1. Клонирование репозитория
```bash
git clone https://github.com/gubanova-vitaliya/WEB2.git
cd WEB2
git checkout tauri-todo-app
```

### 2. Запуск Backend сервера
```bash
cd notes-backend
npm install
node index.js
```
Сервер запустится на `http://localhost:3000` и покажет все доступные IP адреса.

### 3. Запуск Tauri приложения
```bash
cd notes-backend/todo-app
npm install
npm run tauri dev
```

### 4. Запуск веб-версии
```bash
cd notes-backend/todo-app
npm run dev
```
Откроется на `https://localhost:3001` (с HTTPS для PWA)

### 5. Деплой на GitHub Pages
```bash
cd notes-backend/todo-app
npm run deploy
```

## 🌐 Демо

### GitHub Pages (PWA)
- **Основное приложение:** https://gubanova-vitaliya.github.io/WEB2/
- **Корзина товаров:** https://gubanova-vitaliya.github.io/WEB2/shopping
- **Гостевые страницы:** 
  - https://gubanova-vitaliya.github.io/WEB2/guest
  - https://gubanova-vitaliya.github.io/WEB2/guest/tasks
  - https://gubanova-vitaliya.github.io/WEB2/guest/gallery

### Установка PWA на мобильное устройство
1. Откройте любую ссылку выше на телефоне
2. **Android:** Меню → "Добавить на главный экран"
3. **iOS:** Поделиться → "На экран «Домой»"

## 📱 Адаптивность

Приложение адаптируется под разные размеры экранов:

- **Desktop (1200px+):** 4 колонки карточек
- **Tablet (768px-1199px):** 2 колонки карточек  
- **Mobile (до 767px):** 1 колонка карточек

## 🔧 Конфигурация

### IP адрес для Tauri
Измените IP в файле `notes-backend/todo-app/src/config/api.js`:
```javascript
tauri: {
  baseURL: 'http://ВАШ_IP:3000', // Замените на ваш IP
  timeout: 10000
}
```

### HTTPS сертификаты
Для локальной разработки с PWA:
```bash
cd notes-backend/todo-app
mkcert localhost 127.0.0.1 192.168.1.105
mv localhost+2.pem cert.crt
mv localhost+2-key.pem cert.key
```

## 📖 Документация

- **`DEMONSTRATION_GUIDE.md`** - Полная инструкция для демонстрации
- **`QUICK_DEMO_COMMANDS.md`** - Быстрые команды для запуска
- **`COMPLETE_PROJECT_SUMMARY.md`** - Подробное описание проекта

## 🎯 Особенности реализации

### Redux Toolkit
- **Async Thunks** для API запросов
- **Фильтрация и поиск** с сохранением состояния
- **Error handling** и loading states
- **Typed hooks** для TypeScript поддержки

### PWA
- **Service Worker** с Workbox
- **Runtime caching** для API запросов
- **Offline support** с fallback на mock данные
- **Update notifications** для новых версий

### Tauri Security
- **Scope restrictions** для HTTP запросов
- **Capabilities system** для разрешений
- **CORS handling** для безопасности
- **Native dialogs** вместо browser alerts

## 👥 Автор

**Gubanova Vitaliya** - [GitHub](https://github.com/gubanova-vitaliya)

## 📄 Лицензия

Этот проект создан в образовательных целях.

---

## 🎉 Статус проекта: ✅ ЗАВЕРШЕН

Все требования выполнены на 100%:
- ✅ Redux Toolkit для фильтров
- ✅ PWA функциональность
- ✅ GitHub Pages деплой
- ✅ Адаптивность для 3 страниц
- ✅ Tauri гостевой интерфейс
- ✅ Фильтрация и изображения
- ✅ API подключение по IP
- ✅ HTTPS поддержка
- ✅ Полная документация