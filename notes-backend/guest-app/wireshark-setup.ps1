# Скрипт для настройки Wireshark для мониторинга трафика Tauri приложения
# Генерирует команды и фильтры для Wireshark

param(
    [string]$BackendIP = "",
    [int]$BackendPort = 8080
)

Write-Host "`n🔍 Настройка Wireshark для мониторинга Tauri приложения`n" -ForegroundColor Cyan

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
        Write-Host "💡 Укажите IP адрес вручную: .\wireshark-setup.ps1 -BackendIP '192.168.0.100'" -ForegroundColor Yellow
        exit 1
    }
    
    $primaryAdapter = $connectedAdapters | Sort-Object { 
        (Get-NetIPInterface -InterfaceIndex $_.InterfaceIndex -AddressFamily IPv4).InterfaceMetric 
    } | Select-Object -First 1
    
    $BackendIP = $primaryAdapter.IPAddress
}

# Получаем локальный IP адрес компьютера
$LocalIP = $BackendIP

Write-Host "📋 Параметры для Wireshark:`n" -ForegroundColor Cyan
Write-Host "   IP адрес бэкенда: $BackendIP" -ForegroundColor White
Write-Host "   Порт бэкенда: $BackendPort" -ForegroundColor White
Write-Host "   Локальный IP: $LocalIP`n" -ForegroundColor White

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📝 ИНСТРУКЦИЯ ПО ИСПОЛЬЗОВАНИЮ WIRESHARK`n" -ForegroundColor Green

Write-Host "1️⃣ Выбор сетевого интерфейса:" -ForegroundColor Yellow
Write-Host "   - Запустите Wireshark" -ForegroundColor White
Write-Host "   - Выберите активный интерфейс (Ethernet или Wi-Fi)" -ForegroundColor White
Write-Host "   - Интерфейс должен иметь IP: $LocalIP`n" -ForegroundColor Cyan

Write-Host "2️⃣ Настройка фильтра:" -ForegroundColor Yellow
Write-Host "   В поле фильтра введите:`n" -ForegroundColor White
Write-Host "   " -NoNewline
Write-Host "ip.addr == $BackendIP && tcp.port == $BackendPort" -ForegroundColor Green
Write-Host ""

Write-Host "   Или для более детального анализа:`n" -ForegroundColor White
Write-Host "   " -NoNewline
Write-Host "(ip.src == $LocalIP && tcp.dstport == $BackendPort) || (ip.dst == $BackendIP && tcp.srcport == $BackendPort)" -ForegroundColor Green
Write-Host ""

Write-Host "3️⃣ Запуск захвата:" -ForegroundColor Yellow
Write-Host "   - Нажмите зеленую кнопку ▶️ (Start capturing packets)" -ForegroundColor White
Write-Host "   - Запустите Tauri приложение (guest-app.exe)" -ForegroundColor White
Write-Host "   - Выполните действия в приложении (откройте страницу с газами)`n" -ForegroundColor White

Write-Host "4️⃣ Анализ трафика:" -ForegroundColor Yellow
Write-Host "   Вы увидите:" -ForegroundColor White
Write-Host "   - TCP SYN пакеты (установка соединения)" -ForegroundColor Cyan
Write-Host "   - HTTP GET запросы к /api/gases" -ForegroundColor Cyan
Write-Host "   - HTTP ответы с данными (200 OK)" -ForegroundColor Cyan
Write-Host "   - TCP FIN пакеты (закрытие соединения)`n" -ForegroundColor Cyan

Write-Host "5️⃣ Определение порта Tauri приложения:" -ForegroundColor Yellow
Write-Host "   - Найдите пакеты с Source IP = $LocalIP" -ForegroundColor White
Write-Host "   - В колонке 'Source Port' будет локальный порт Tauri приложения" -ForegroundColor White
Write-Host "   - В колонке 'Destination Port' будет $BackendPort (порт бэкенда)`n" -ForegroundColor White

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "💡 ПОЛЕЗНЫЕ ФИЛЬТРЫ WIRESHARK`n" -ForegroundColor Green

Write-Host "Только HTTP трафик:" -ForegroundColor Yellow
Write-Host "   " -NoNewline
Write-Host "ip.addr == $BackendIP && tcp.port == $BackendPort && http" -ForegroundColor Green
Write-Host ""

Write-Host "Только запросы от клиента:" -ForegroundColor Yellow
Write-Host "   " -NoNewline
Write-Host "ip.src == $LocalIP && tcp.dstport == $BackendPort" -ForegroundColor Green
Write-Host ""

Write-Host "Только ответы от сервера:" -ForegroundColor Yellow
Write-Host "   " -NoNewline
Write-Host "ip.dst == $LocalIP && tcp.srcport == $BackendPort" -ForegroundColor Green
Write-Host ""

Write-Host "Поиск конкретного API endpoint:" -ForegroundColor Yellow
Write-Host "   " -NoNewline
Write-Host "http.request.uri contains '/api/gases'" -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔧 АЛЬТЕРНАТИВА: TCPDUMP (если установлен)`n" -ForegroundColor Green

Write-Host "Для Linux/macOS или WSL:" -ForegroundColor Yellow
Write-Host "   " -NoNewline
Write-Host "tcpdump -i any -n 'host $BackendIP and port $BackendPort'" -ForegroundColor Green
Write-Host ""

Write-Host "С сохранением в файл:" -ForegroundColor Yellow
Write-Host "   " -NoNewline
Write-Host "tcpdump -i any -n -w tauri-traffic.pcap 'host $BackendIP and port $BackendPort'" -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✅ Готово! Теперь вы можете использовать Wireshark для мониторинга трафика.`n" -ForegroundColor Green




