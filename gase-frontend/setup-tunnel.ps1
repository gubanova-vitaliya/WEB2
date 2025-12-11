# Скрипт для настройки туннеля к локальному бэкенду
# Использует serveo.net (не требует установки) или localtunnel (через npm)

param(
    [string]$Method = "serveo",
    [string]$BackendIP = "192.168.0.100",
    [int]$BackendPort = 8080
)

Write-Host "🔧 Настройка туннеля к локальному бэкенду`n" -ForegroundColor Cyan
Write-Host "   Backend: http://${BackendIP}:${BackendPort}`n" -ForegroundColor White

if ($Method -eq "serveo") {
    Write-Host "📡 Используем serveo.net (не требует установки)`n" -ForegroundColor Green
    Write-Host "⚠️  Для работы serveo.net нужен SSH клиент (обычно встроен в Windows 10+)`n" -ForegroundColor Yellow
    
    $sshCommand = "ssh -R 80:${BackendIP}:${BackendPort} serveo.net"
    Write-Host "🚀 Запустите следующую команду в новом терминале:`n" -ForegroundColor Cyan
    Write-Host "   $sshCommand`n" -ForegroundColor White
    Write-Host "📝 После запуска serveo.net покажет публичный HTTPS URL`n" -ForegroundColor Yellow
    Write-Host "📝 Используйте этот URL в переменной VITE_API_URL при сборке`n" -ForegroundColor Yellow
    
    Write-Host "💡 Пример:`n" -ForegroundColor Cyan
    Write-Host "   1. Запустите: $sshCommand" -ForegroundColor White
    Write-Host "   2. Скопируйте HTTPS URL (например: https://abc123.serveo.net)" -ForegroundColor White
    Write-Host "   3. Соберите проект:" -ForegroundColor White
    Write-Host "      `$env:VITE_API_URL='https://abc123.serveo.net'; npm run build:gh-pages`n" -ForegroundColor Green
    
} elseif ($Method -eq "localtunnel") {
    Write-Host "📡 Используем localtunnel (через npm)`n" -ForegroundColor Green
    
    # Проверяем, установлен ли localtunnel
    $ltInstalled = Get-Command npx -ErrorAction SilentlyContinue
    if (-not $ltInstalled) {
        Write-Host "❌ npx не найден! Установите Node.js и npm`n" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "🚀 Запустите следующую команду в новом терминале:`n" -ForegroundColor Cyan
    Write-Host "   npx localtunnel --port ${BackendPort} --subdomain gas-backend`n" -ForegroundColor White
    Write-Host "📝 После запуска localtunnel покажет публичный HTTPS URL`n" -ForegroundColor Yellow
    Write-Host "📝 Используйте этот URL в переменной VITE_API_URL при сборке`n" -ForegroundColor Yellow
    
    Write-Host "💡 Пример:`n" -ForegroundColor Cyan
    Write-Host "   1. Запустите: npx localtunnel --port ${BackendPort}" -ForegroundColor White
    Write-Host "   2. Скопируйте HTTPS URL (например: https://gas-backend.loca.lt)" -ForegroundColor White
    Write-Host "   3. Соберите проект:" -ForegroundColor White
    Write-Host "      `$env:VITE_API_URL='https://gas-backend.loca.lt'; npm run build:gh-pages`n" -ForegroundColor Green
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

