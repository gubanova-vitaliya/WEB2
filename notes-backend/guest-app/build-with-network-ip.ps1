# Скрипт для сборки Tauri приложения с IP адресом локальной сети
# Автоматически определяет IP и собирает приложение

param(
    [string]$ApiIP = "",
    [string]$ApiPort = "8080"
)

Write-Host "`n🔨 Сборка Tauri приложения с подключением к бэкенду по локальной сети`n" -ForegroundColor Cyan

# Если IP не указан, получаем автоматически
if ([string]::IsNullOrEmpty($ApiIP)) {
    Write-Host "🔍 Автоматическое определение IP адреса...`n" -ForegroundColor Yellow
    
    # Получаем IP адрес локальной сети
    $adapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
        $_.IPAddress -notlike "127.*" -and 
        $_.IPAddress -notlike "169.254.*" -and
        $_.PrefixOrigin -ne "WellKnown"
    }
    
    $connectedAdapters = $adapters | Where-Object {
        (Get-NetIPInterface -InterfaceIndex $_.InterfaceIndex -AddressFamily IPv4).ConnectionState -eq "Connected"
    }
    
    if ($connectedAdapters.Count -eq 0) {
        Write-Host "❌ Не найдено подключенных сетевых адаптеров" -ForegroundColor Red
        Write-Host "💡 Укажите IP адрес вручную: .\build-with-network-ip.ps1 -ApiIP '192.168.0.100'" -ForegroundColor Yellow
        exit 1
    }
    
    $primaryAdapter = $connectedAdapters | Sort-Object { 
        (Get-NetIPInterface -InterfaceIndex $_.InterfaceIndex -AddressFamily IPv4).InterfaceMetric 
    } | Select-Object -First 1
    
    $ApiIP = $primaryAdapter.IPAddress
    Write-Host "✅ Найден IP адрес: $ApiIP`n" -ForegroundColor Green
} else {
    Write-Host "✅ Используется указанный IP адрес: $ApiIP`n" -ForegroundColor Green
}

# Устанавливаем переменные окружения
$env:VITE_API_IP = $ApiIP
$env:VITE_API_PORT = $ApiPort

Write-Host "📋 Параметры сборки:" -ForegroundColor Cyan
Write-Host "   IP адрес бэкенда: $ApiIP" -ForegroundColor White
Write-Host "   Порт бэкенда: $ApiPort" -ForegroundColor White
Write-Host "   Переменные окружения:" -ForegroundColor White
Write-Host "     VITE_API_IP = $env:VITE_API_IP" -ForegroundColor Gray
Write-Host "     VITE_API_PORT = $env:VITE_API_PORT`n" -ForegroundColor Gray

# Проверяем наличие зависимостей
Write-Host "🔍 Проверка зависимостей...`n" -ForegroundColor Yellow

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm не найден. Установите Node.js" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Host "❌ cargo не найден. Установите Rust" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Зависимости найдены`n" -ForegroundColor Green

# Переходим в директорию приложения
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Устанавливаем зависимости (если нужно)
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Установка npm зависимостей...`n" -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ошибка установки зависимостей" -ForegroundColor Red
        exit 1
    }
}

# Собираем приложение
Write-Host "`n🔨 Начало сборки Tauri приложения...`n" -ForegroundColor Cyan
Write-Host "⏳ Это может занять 10-20 минут при первой сборке...`n" -ForegroundColor Yellow

npm run tauri:build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Сборка завершена успешно!`n" -ForegroundColor Green
    
    $exePath = "src-tauri\target\release\guest-app.exe"
    if (Test-Path $exePath) {
        Write-Host "📦 Исполняемый файл: $exePath" -ForegroundColor Cyan
        Write-Host "`n💡 IP адрес бэкенда ($ApiIP) встроен в приложение" -ForegroundColor Yellow
        Write-Host "   При запуске приложение будет подключаться к: http://$ApiIP`:$ApiPort`n" -ForegroundColor White
    }
} else {
    Write-Host "`n❌ Ошибка сборки" -ForegroundColor Red
    exit 1
}




