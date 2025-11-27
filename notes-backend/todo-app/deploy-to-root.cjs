const fs = require('fs');
const path = require('path');

// Функция для копирования файлов
function copyFileSync(source, target) {
    let targetFile = target;
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

// Функция для копирования папки
function copyFolderRecursiveSync(source, target) {
    let files = [];
    const targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
    }

    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            const curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

// Основная функция развертывания
function deployToRoot() {
    const distPath = path.join(__dirname, 'dist');
    const rootPath = path.join(__dirname, '..', '..');
    
    if (!fs.existsSync(distPath)) {
        console.error('❌ Папка dist не найдена. Сначала выполните: npm run build');
        process.exit(1);
    }
    
    console.log('🚀 Начинаем развертывание на GitHub Pages...');
    
    try {
        // Копируем все файлы из dist в корень
        const files = fs.readdirSync(distPath);
        
        files.forEach(file => {
            const sourcePath = path.join(distPath, file);
            const targetPath = path.join(rootPath, file);
            
            if (fs.lstatSync(sourcePath).isDirectory()) {
                // Удаляем существующую папку если есть
                if (fs.existsSync(targetPath)) {
                    fs.rmSync(targetPath, { recursive: true, force: true });
                }
                copyFolderRecursiveSync(sourcePath, rootPath);
            } else {
                copyFileSync(sourcePath, targetPath);
            }
            
            console.log(`✅ Скопировано: ${file}`);
        });
        
        // Создаем .nojekyll файл для GitHub Pages
        const nojekyllPath = path.join(rootPath, '.nojekyll');
        fs.writeFileSync(nojekyllPath, '');
        console.log('✅ Создан файл .nojekyll');
        
        // Создаем README для GitHub Pages
        const readmePath = path.join(rootPath, 'README.md');
        const readmeContent = `# 📱 Планировщик задач PWA

Это Progressive Web Application для управления задачами с поддержкой Tauri.

## 🌐 Демо
Приложение доступно по адресу: **https://ваш-username.github.io/RIP/**

## 📱 Установка PWA на телефон

### Android (Chrome/Edge)
1. Откройте сайт в Chrome или Edge
2. Нажмите на уведомление "Добавить на главный экран"
3. Или через меню браузера → "Установить приложение"

### iOS (Safari)
1. Откройте сайт в Safari
2. Нажмите кнопку "Поделиться" 
3. Выберите "На экран «Домой»"

## 🎭 Режимы работы

### Основной режим (\`/\`)
- Полное управление задачами
- Redux состояние с фильтрацией
- Поиск и сортировка

### Гостевой режим
- **Главная**: \`/guest\` - обзор возможностей
- **Задачи**: \`/guest/tasks\` - просмотр с фильтрацией
- **Галерея**: \`/guest/gallery\` - изображения по категориям

## 🔧 Технологии
- **Frontend**: React 19 + Redux Toolkit
- **PWA**: Service Worker + Web App Manifest
- **Desktop**: Tauri 2.0 (Rust + WebView)
- **Стили**: CSS Grid + Flexbox (адаптивный дизайн)
- **Сборка**: Vite + PWA плагин

## ✨ Возможности PWA
- 📱 Установка как нативное приложение
- 🔄 Автоматические обновления
- 📶 Работа в офлайн режиме
- 🎨 Адаптивные иконки для всех устройств
- 🚀 Быстрая загрузка с кэшированием

## 🎯 Особенности
- **Адаптивный дизайн** для всех экранов (320px+)
- **Touch-friendly** интерфейс для мобильных
- **Фильтрация и поиск** в реальном времени
- **Красивые анимации** и переходы
- **Темная тема** поддержка системных настроек
`;
        
        fs.writeFileSync(readmePath, readmeContent);
        console.log('✅ Создан README.md');
        
        console.log('\n🎉 Развертывание завершено!');
        console.log('\n📋 Следующие шаги:');
        console.log('1. git add .');
        console.log('2. git commit -m "Deploy PWA to GitHub Pages"');
        console.log('3. git push origin main');
        console.log('4. Включите GitHub Pages в Settings → Pages');
        console.log('5. Ваше PWA: https://ваш-username.github.io/RIP/');
        console.log('\n📱 Для установки PWA на телефон:');
        console.log('- Откройте ссылку в браузере');
        console.log('- Нажмите "Добавить на главный экран"');
        console.log('- Приложение установится как нативное!');
        
    } catch (error) {
        console.error('❌ Ошибка при развертывании:', error.message);
        process.exit(1);
    }
}

// Запускаем развертывание
deployToRoot();
