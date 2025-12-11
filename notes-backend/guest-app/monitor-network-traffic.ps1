# Скрипт для мониторинга сетевого трафика Tauri приложения
# Использует netstat и Get-NetTCPConnection для отслеживания подключений

param(
    [string]$BackendIP = "",
    [int]$BackendPort = 8080,
    [int]$Duration = 60
)

Write-Host "`n📡 Мониторинг сетевого трафика Tauri приложения`n" -ForegroundColor Cyan

if ([string]::IsNullOrEmpty($BackendIP)) {
    Write-Host "🔍 Автоматическое определение IP адреса бэкенда...`n" -ForegroundColor Yellow
    
    $adapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
        $_.IPAddress -notlike "127.*" -and 
        $_.IPAddress -notlike "169.254.*"
    }
    
    $connectedAdapters = $adapters | Where-Object {
        (Get-NetIPInterface -InterfaceIndex $_.InterfaceIndex -AddressFamily IPv4).ConnectionState -eq "Connected"
    }
    
    if ($connectedAdapters.Count -eq 0) {
        Write-Host "❌ Не найдено подключенных сетевых адаптеров" -ForegroundColor Red
        Write-Host "💡 Укажите IP адрес вручную: .\monitor-network-traffic.ps1 -BackendIP '192.168.0.100'" -ForegroundColor Yellow
        exit 1
    }
    
    $primaryAdapter = $connectedAdapters | Sort-Object { 
        (Get-NetIPInterface -InterfaceIndex $_.InterfaceIndex -AddressFamily IPv4).InterfaceMetric 
    } | Select-Object -First 1
    
    $BackendIP = $primaryAdapter.IPAddress
}

Write-Host "📋 Параметры мониторинга:" -ForegroundColor Cyan
Write-Host "   IP адрес бэкенда: $BackendIP" -ForegroundColor White
Write-Host "   Порт бэкенда: $BackendPort" -ForegroundColor White
Write-Host "   Длительность: $Duration секунд`n" -ForegroundColor White

Write-Host "💡 Инструкция:" -ForegroundColor Yellow
Write-Host "   1. Запустите бэкенд на $BackendIP`:$BackendPort" -ForegroundColor White
Write-Host "   2. Запустите Tauri приложение (guest-app.exe)" -ForegroundColor White
Write-Host "   3. Наблюдайте за сетевыми подключениями ниже`n" -ForegroundColor White

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔍 Поиск процесса guest-app.exe...`n" -ForegroundColor Yellow

$process = Get-Process -Name "guest-app" -ErrorAction SilentlyContinue

if (-not $process) {
    Write-Host "⚠️ Процесс guest-app.exe не найден" -ForegroundColor Yellow
    Write-Host "   Запустите приложение и попробуйте снова`n" -ForegroundColor White
} else {
    Write-Host "✅ Найден процесс: guest-app.exe (PID: $($process.Id))`n" -ForegroundColor Green
}

$endTime = (Get-Date).AddSeconds($Duration)
$iteration = 0

while ((Get-Date) -lt $endTime) {
    $iteration++
    Clear-Host
    
    Write-Host "`n📡 Мониторинг сетевого трафика - Итерация #$iteration" -ForegroundColor Cyan
    Write-Host "   Время: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
    Write-Host "   Осталось: $([math]::Round(($endTime - (Get-Date)).TotalSeconds)) секунд`n" -ForegroundColor Gray
    
    # Ищем подключения к бэкенду
    Write-Host "🔗 Подключения к бэкенду ($BackendIP`:$BackendPort):" -ForegroundColor Green
    
    $connections = Get-NetTCPConnection -ErrorAction SilentlyContinue | Where-Object {
        $_.RemoteAddress -eq $BackendIP -and 
        $_.RemotePort -eq $BackendPort -and
        $_.State -eq "Established"
    }
    
    if ($connections.Count -gt 0) {
        foreach ($conn in $connections) {
            $processName = (Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue).ProcessName
            $localPort = $conn.LocalPort
            
            Write-Host "   ✅ Процесс: $processName (PID: $($conn.OwningProcess))" -ForegroundColor Green
            Write-Host "      Локальный порт: $localPort" -ForegroundColor Cyan
            Write-Host "      Удаленный адрес: $($conn.RemoteAddress):$($conn.RemotePort)" -ForegroundColor Cyan
            Write-Host "      Состояние: $($conn.State)" -ForegroundColor Yellow
            Write-Host ""
        }
    } else {
        Write-Host "   ⚠️ Активных подключений не найдено" -ForegroundColor Yellow
        Write-Host "      Убедитесь, что:" -ForegroundColor Gray
        Write-Host "      - Бэкенд запущен на $BackendIP`:$BackendPort" -ForegroundColor Gray
        Write-Host "      - Tauri приложение запущено и выполняет запросы`n" -ForegroundColor Gray
    }
    
    # Показываем все TCP подключения приложения (если найдено)
    if ($process) {
        Write-Host "🌐 Все сетевые подключения guest-app.exe:" -ForegroundColor Cyan
        
        $appConnections = Get-NetTCPConnection -ErrorAction SilentlyContinue | Where-Object {
            $_.OwningProcess -eq $process.Id
        } | Select-Object -First 10
        
        if ($appConnections.Count -gt 0) {
            $appConnections | Format-Table -Property @{
                Label="Локальный адрес"; Expression={"$($_.LocalAddress):$($_.LocalPort)"}
            }, @{
                Label="Удаленный адрес"; Expression={"$($_.RemoteAddress):$($_.RemotePort)"}
            }, State -AutoSize
        } else {
            Write-Host "   ⚠️ Сетевых подключений не найдено`n" -ForegroundColor Yellow
        }
    }
    
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "💡 Для остановки нажмите Ctrl+C`n" -ForegroundColor Yellow
    
    Start-Sleep -Seconds 2
}

Write-Host "`n✅ Мониторинг завершен`n" -ForegroundColor Green




