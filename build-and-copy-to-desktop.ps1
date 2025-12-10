# Скрипт для автоматической сборки Tauri приложения и копирования на рабочий стол

param(
    [Parameter(Mandatory=$false)]
    [string]$App = "guest-app"
)

Write-Host "🚀 Сборка Tauri приложения: $App" -ForegroundColor Cyan

# Определяем путь к приложению
$appPath = "notes-backend\$App"

# Проверяем существование папки
if (-not (Test-Path $appPath)) {
    Write-Host "❌ Ошибка: Папка $appPath не найдена!" -ForegroundColor Red
    exit 1
}

# Переходим в папку приложения
Set-Location $appPath
Write-Host "📁 Переход в: $(Get-Location)" -ForegroundColor Yellow

# Проверяем наличие node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ошибка при установке зависимостей!" -ForegroundColor Red
        exit 1
    }
}

# Собираем приложение
Write-Host "🔨 Начинаем сборку Tauri приложения..." -ForegroundColor Yellow
Write-Host "⏳ Это может занять 10-20 минут при первой сборке..." -ForegroundColor Yellow

npm run tauri:build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка при сборке приложения!" -ForegroundColor Red
    exit 1
}

# Определяем имя исполняемого файла
$exeName = "$App.exe"
$exePath = "src-tauri\target\release\$exeName"
$desktopPath = "$env:USERPROFILE\Desktop\$exeName"

# Проверяем существование файла
if (-not (Test-Path $exePath)) {
    Write-Host "❌ Ошибка: Исполняемый файл не найден: $exePath" -ForegroundColor Red
    Write-Host "💡 Проверьте путь к файлу вручную" -ForegroundColor Yellow
    exit 1
}

# Копируем на рабочий стол
Write-Host "📋 Копирование на рабочий стол..." -ForegroundColor Yellow
Copy-Item $exePath $desktopPath -Force

if (Test-Path $desktopPath) {
    Write-Host "✅ Готово! Приложение скопировано на рабочий стол: $desktopPath" -ForegroundColor Green
    Write-Host "🖥️  Теперь вы можете запустить приложение двойным кликом!" -ForegroundColor Green
} else {
    Write-Host "❌ Ошибка при копировании файла!" -ForegroundColor Red
    exit 1
}

# Возвращаемся в корневую папку
Set-Location ..\..\..

Write-Host ""
Write-Host "🎉 Сборка завершена успешно!" -ForegroundColor Green

