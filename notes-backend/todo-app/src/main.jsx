import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './app/App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Регистрируем Service Worker для PWA
if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      // Показываем уведомление о доступном обновлении
      console.log('Доступно обновление приложения');
    },
    onOfflineReady() {
      // Приложение готово к работе офлайн
      console.log('Приложение готово к работе офлайн');
    },
  });
}
