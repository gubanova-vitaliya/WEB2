import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs'
import path from 'path'

// Конфигурация для GitHub Pages
const isGitHubPages = process.env.VITE_GITHUB_PAGES === 'true';
const REPO_NAME = process.env.VITE_REPO_NAME || 'gas-project-frontend';
const GITHUB_PAGES_BASE = REPO_NAME ? `/${REPO_NAME}/` : '/';
// Для GitHub Pages используем путь репозитория, иначе корневой путь
const dest_root = isGitHubPages ? GITHUB_PAGES_BASE : '/';

// API адреса
const api_proxy_addr = process.env.VITE_API_URL || 'http://localhost:8080';
const notes_api_addr = process.env.VITE_NOTES_API_URL || 'http://localhost:8081';
const img_proxy_addr = process.env.VITE_IMG_PROXY_URL || 'http://localhost:8080';

export default defineConfig({
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Gase Application",
        short_name: "Gase App",
        description: "Приложение для работы с газами и расчетами",
        start_url: dest_root,
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#db4938",
        orientation: "portrait-primary",
        icons: [
          {
            src: `${dest_root}DefaultImage.svg`,
            type: "image/svg+xml",
            sizes: "192x192",
            purpose: "any maskable"
          },
          {
            src: `${dest_root}DefaultImage.svg`,
            type: "image/svg+xml",
            sizes: "512x512",
            purpose: "any maskable"
          }
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
  base: dest_root,
  server: {
    port: 3000,
    https: (() => {
      const certKeyPath = path.resolve(__dirname, 'cert.key');
      const certCrtPath = path.resolve(__dirname, 'cert.crt');
      
      if (fs.existsSync(certKeyPath) && fs.existsSync(certCrtPath)) {
        return {
          key: fs.readFileSync(certKeyPath),
          cert: fs.readFileSync(certCrtPath),
        };
      } else {
        console.warn('⚠️  HTTPS сертификаты не найдены!');
        console.warn('📖 Для настройки HTTPS см. HTTPS_SETUP.md');
        console.warn('🔧 Запуск без HTTPS (PWA может не работать на мобильных устройствах)');
        return undefined;
      }
    })(),
    proxy: {
      "/api": {
        target: api_proxy_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "/notes-api": {
        target: notes_api_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/notes-api/, ""),
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
