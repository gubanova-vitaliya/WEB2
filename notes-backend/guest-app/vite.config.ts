import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Конфигурация для Tauri (desktop приложение)
// Используем IP адрес локальной сети для API
const API_IP = process.env.VITE_API_IP || '192.168.0.100';
const API_PORT = process.env.VITE_API_PORT || '8080';
const api_proxy_addr = `http://${API_IP}:${API_PORT}`;

export default defineConfig({
  plugins: [
    react(),
  ],
  base: '/',
  root: '.', // Явно указываем корень проекта
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'], // Приоритет .tsx перед .jsx
  },
  server: {
    port: 3002,
    strictPort: false,
    // В Tauri не нужен прокси, так как запросы идут напрямую через IP
    // Но оставляем для dev режима (когда запускаем через браузер)
    proxy: {
      "/api": {
        target: api_proxy_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.log('❌ [Proxy Error]', err.message);
            console.log('💡 Проверьте, что Go Backend запущен на', api_proxy_addr);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🔵 [Proxy]', req.method, req.url, '→', api_proxy_addr + req.url);
          });
        },
      },
    },
    watch: {
      usePolling: true,
    },
    host: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

