import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
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
        name: "Gase Frontend - Gas Calculator",
        short_name: "Gase App",
        start_url: "/WEB2/",
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#007bff",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/logo192.png",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "/logo512.png", 
            type: "image/png",
            sizes: "512x512"
          }
        ],
      }
    })
  ],
  base: "/WEB2", // Название репозитория
  server: {
    port: 5173,
    https: fs.existsSync(path.resolve(__dirname, 'cert.key')) ? {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    } : undefined,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
  },
})


