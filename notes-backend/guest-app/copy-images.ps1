# Скрипт для копирования изображений из gase-frontend
$sourceDir = "..\..\gase-frontend\public"
$destDir = "public"

# Копируем slide*.svg файлы
Get-ChildItem -Path $sourceDir -Filter "slide*.svg" | Copy-Item -Destination $destDir -Force
Write-Host "Скопированы файлы slide*.svg"

# Копируем папку gas-images
if (Test-Path "$sourceDir\gas-images") {
    Copy-Item -Path "$sourceDir\gas-images" -Destination $destDir -Recurse -Force
    Write-Host "Скопирована папка gas-images"
}

Write-Host "Готово! Все изображения скопированы."




