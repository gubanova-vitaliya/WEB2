# Настройка туннеля для подключения бэкенда к GitHub Pages

Для работы локального бэкенда с GitHub Pages (HTTPS) нужно создать туннель, так как браузеры блокируют HTTP запросы с HTTPS страниц (mixed content).

## Вариант 1: localtunnel (рекомендуется)

### Шаг 1: Запустите туннель

В **новом терминале** (оставьте бэкенд запущенным) выполните:

```powershell
npx localtunnel --port 8080
```

**Важно:** Не закрывайте этот терминал! Туннель должен работать постоянно.

### Шаг 2: Скопируйте HTTPS URL

После запуска localtunnel покажет что-то вроде:
```
your url is: https://random-name.loca.lt
```

Скопируйте этот URL (например: `https://random-name.loca.lt`)

### Шаг 3: Соберите проект с этим URL

В **основном терминале** (где вы запускаете сборку):

```powershell
cd gase-frontend
$env:VITE_API_URL="https://random-name.loca.lt"
$env:VITE_GITHUB_PAGES="true"
$env:VITE_REPO_NAME="gas-project-frontend"
npm run build:gh-pages
```

### Шаг 4: Деплой

```powershell
npm run deploy
```

## Вариант 2: ngrok (если установлен)

### Установка ngrok

1. Скачайте с https://ngrok.com/download
2. Или через chocolatey: `choco install ngrok`
3. Или через scoop: `scoop install ngrok`

### Использование

```powershell
# Запустите туннель
ngrok http 192.168.0.100:8080

# Скопируйте HTTPS URL (например: https://abc123.ngrok.io)
# Используйте его при сборке:
$env:VITE_API_URL="https://abc123.ngrok.io"
$env:VITE_GITHUB_PAGES="true"
$env:VITE_REPO_NAME="gas-project-frontend"
npm run build:gh-pages
```

## Важные замечания

⚠️ **Туннель должен работать постоянно** - не закрывайте терминал с туннелем, пока используете GitHub Pages

⚠️ **URL туннеля может измениться** - при каждом перезапуске localtunnel создает новый URL

✅ **Для production** рекомендуется использовать постоянный домен или настроить HTTPS на бэкенде

## Альтернатива: Использование mock данных

Если туннель не нужен, приложение автоматически использует mock данные:

```powershell
# Просто соберите без переменных окружения для API
$env:VITE_GITHUB_PAGES="true"
$env:VITE_REPO_NAME="gas-project-frontend"
npm run build:gh-pages
```

