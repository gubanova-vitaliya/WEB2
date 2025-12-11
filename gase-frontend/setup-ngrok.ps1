# Скрипт для настройки ngrok туннеля для бэкенда
# Это позволяет GitHub Pages подключаться к локальному бэкенду через HTTPS

Write-Host "🔧 Настройка ngrok туннеля для бэкенда`n" -ForegroundColor Cyan

# Проверяем, установлен ли ngrok
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue

if (-not $ngrokInstalled) {
    Write-Host "❌ ngrok не установлен!" -ForegroundColor Red
    Write-Host "`n📥 Установите ngrok:" -ForegroundColor Yellow
    Write-Host "   1. Скачайте с https://ngrok.com/download" -ForegroundColor White
    Write-Host "   2. Или через chocolatey: choco install ngrok" -ForegroundColor White
    Write-Host "   3. Или через scoop: scoop install ngrok`n" -ForegroundColor White
    exit 1
}

Write-Host "✅ ngrok установлен`n" -ForegroundColor Green

# Получаем IP адрес бэкенда
$API_IP = $env:VITE_API_IP
if (-not $API_IP) {
    $API_IP = "192.168.0.100"
    Write-Host "⚠️  VITE_API_IP не установлен, используем дефолтный: $API_IP" -ForegroundColor Yellow
}

$API_PORT = $env:VITE_API_PORT
if (-not $API_PORT) {
    $API_PORT = "8080"
    Write-Host "⚠️  VITE_API_PORT не установлен, используем дефолтный: $API_PORT`n" -ForegroundColor Yellow
}

Write-Host "🌐 Запуск ngrok туннеля для http://${API_IP}:${API_PORT}...`n" -ForegroundColor Cyan
Write-Host "📝 После запуска ngrok покажет публичный HTTPS URL" -ForegroundColor Yellow
Write-Host "📝 Используйте этот URL в переменной VITE_API_URL при сборке`n" -ForegroundColor Yellow

# Запускаем ngrok
Start-Process ngrok -ArgumentList "http", "${API_IP}:${API_PORT}" -NoNewWindow

Write-Host "✅ ngrok запущен!`n" -ForegroundColor Green
Write-Host "📋 Следующие шаги:" -ForegroundColor Cyan
Write-Host "   1. Откройте http://localhost:4040 для просмотра ngrok интерфейса" -ForegroundColor White
Write-Host "   2. Скопируйте HTTPS URL (например: https://abc123.ngrok.io)" -ForegroundColor White
Write-Host "   3. Используйте его при сборке:" -ForegroundColor White
Write-Host "      `$env:VITE_API_URL='https://abc123.ngrok.io'; npm run build:gh-pages`n" -ForegroundColor Green

