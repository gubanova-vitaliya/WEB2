# 🚀 БЫСТРЫЕ КОМАНДЫ ДЛЯ ДЕМОНСТРАЦИИ

## 📋 Порядок запуска для демонстрации:

### 1. Запуск Backend с IP логированием
```bash
cd notes-backend
node index.js
```
**Результат:** Покажет все доступные IP адреса для подключения

### 2. Запуск Tauri приложения
```bash
cd notes-backend/todo-app
npm run tauri dev
```

### 3. Запуск веб-версии с HTTPS
```bash
cd notes-backend/todo-app
npm run dev
```
**Откроется:** https://localhost:3001

### 4. Деплой на GitHub Pages
```bash
cd notes-backend/todo-app
npm run deploy
```
**Результат:** https://gubanova-vitaliya.github.io/WEB2/

---

## 🔧 Настройка IP адреса:

1. **Узнайте ваш IP:**
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```

2. **Обновите в файле `src/config/api.js`:**
   ```javascript
   baseURL: 'http://ВАШ_IP:3000'
   ```

---

## 📱 Ссылки для демонстрации:

- **GitHub Pages:** https://gubanova-vitaliya.github.io/WEB2/
- **Корзина:** https://gubanova-vitaliya.github.io/WEB2/shopping
- **Гостевые страницы:** 
  - /guest
  - /guest/tasks  
  - /guest/gallery

---

## ✅ Контрольный список демонстрации:

- [ ] Backend запущен и показывает IP
- [ ] Tauri подключается по IP (не localhost)
- [ ] PWA установлено на телефон
- [ ] Redux фильтры сохраняют состояние
- [ ] Адаптивность: 4→2→1 колонки
- [ ] HTTPS работает для PWA
- [ ] CRUD операции логируются в backend
