import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { api_proxy_addr, notes_api_addr, img_proxy_addr } from './target_config'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Для dev используем localhost
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.log('❌ [Proxy Error]', err.message);
            console.log('💡 Проверьте, что Go Backend запущен на http://localhost:8080');
            console.log('💡 Или измените target в vite.config.ts на ваш IP:', api_proxy_addr);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🔵 [Proxy]', req.method, req.url, '→', 'http://localhost:8080' + req.url);
          });
        },
      },
      "/notes-api": {
        target: "http://localhost:3001", // Для dev используем localhost
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/notes-api/, ""),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.log('❌ [Notes Proxy Error]', err.message);
            console.log('💡 Проверьте, что Express Backend запущен на http://localhost:3001');
          });
        },
      },
      "/img-proxy": {
        target: img_proxy_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-proxy/, ""),
      },
    },
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
  },
})


