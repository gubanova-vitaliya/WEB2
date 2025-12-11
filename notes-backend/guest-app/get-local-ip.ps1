# Скрипт для получения IP адреса локальной сети
# Используется для настройки подключения Tauri приложения к бэкенду

Write-Host "`n🔍 Поиск IP адреса локальной сети...`n" -ForegroundColor Cyan

# Получаем все сетевые адаптеры с IPv4 адресами
$adapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notlike "127.*" -and 
    $_.IPAddress -notlike "169.254.*" -and
    $_.PrefixOrigin -ne "WellKnown"
} | Sort-Object InterfaceIndex

if ($adapters.Count -eq 0) {
    Write-Host "❌ Не найдено активных сетевых адаптеров" -ForegroundColor Red
    exit 1
}

Write-Host "📡 Найденные сетевые адаптеры:`n" -ForegroundColor Green

$index = 1
$ipAddresses = @()

foreach ($adapter in $adapters) {
    $interface = Get-NetIPInterface -InterfaceIndex $adapter.InterfaceIndex -AddressFamily IPv4
    $adapterInfo = Get-NetAdapter -InterfaceIndex $adapter.InterfaceIndex
    
    $status = if ($interface.ConnectionState -eq "Connected") { "✅ Подключен" } else { "⚠️ Не подключен" }
    $statusColor = if ($interface.ConnectionState -eq "Connected") { "Green" } else { "Yellow" }
    
    Write-Host "$index. $($adapterInfo.Name)" -ForegroundColor White
    Write-Host "   IP адрес: $($adapter.IPAddress)" -ForegroundColor Cyan
    Write-Host "   Статус: $status" -ForegroundColor $statusColor
    Write-Host "   Метрика: $($interface.InterfaceMetric)" -ForegroundColor Gray
    Write-Host ""
    
    if ($interface.ConnectionState -eq "Connected") {
        $ipAddresses += @{
            IP = $adapter.IPAddress
            Name = $adapterInfo.Name
            Metric = $interface.InterfaceMetric
        }
    }
    
    $index++
}

# Выбираем IP адрес с наименьшей метрикой (приоритетный)
if ($ipAddresses.Count -gt 0) {
    $primaryIP = $ipAddresses | Sort-Object Metric | Select-Object -First 1
    
    Write-Host "`n✅ Основной IP адрес для подключения: $($primaryIP.IP)" -ForegroundColor Green
    Write-Host "   Адаптер: $($primaryIP.Name)`n" -ForegroundColor Gray
    
    # Сохраняем IP в переменную окружения для текущей сессии
    $env:VITE_API_IP = $primaryIP.IP
    
    Write-Host "💾 IP адрес сохранен в переменную окружения: `$env:VITE_API_IP = $($primaryIP.IP)" -ForegroundColor Yellow
    Write-Host "`n📝 Использование:" -ForegroundColor Cyan
    Write-Host "   Для сборки приложения выполните:" -ForegroundColor White
    Write-Host "   `$env:VITE_API_IP='$($primaryIP.IP)'; npm run tauri:build" -ForegroundColor Green
    
    return $primaryIP.IP
} else {
    Write-Host "❌ Не найдено подключенных сетевых адаптеров" -ForegroundColor Red
    exit 1
}




