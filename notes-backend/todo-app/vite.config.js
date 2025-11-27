import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base: '/WEB2/', // Название репозитория
  root: 'src',
  publicDir: '../public',
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Планирование задач',
        short_name: 'Задачи',
        description: 'Приложение для управления задачами с Tauri',
        theme_color: '#667eea',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/WEB2/',
        start_url: '/WEB2/',
        icons: [
          {
            src: '/WEB2/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/WEB2/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/WEB2/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [
        '@tauri-apps/api/event',
        '@tauri-apps/plugin-dialog',
        '@tauri-apps/plugin-http'
      ]
    }
  },
  server: {
    port: 3001,
    https: fs.existsSync(path.resolve('cert.key')) ? {
      key: fs.readFileSync(path.resolve('cert.key')),
      cert: fs.readFileSync(path.resolve('cert.crt')),
    } : undefined,
  },
});
