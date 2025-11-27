import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs'
import path from 'path'
import { dest_root, api_proxy_addr, notes_api_addr, img_proxy_addr } from './target_config'
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
        start_url: dest_root + "/",
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#db4938",
        orientation: "portrait-primary",
        icons: [
          {
            src: dest_root + "/DefaultImage.svg",
            type: "image/svg+xml",
            sizes: "192x192"
          },
          {
            src: dest_root + "/DefaultImage.svg",
            type: "image/svg+xml",
            sizes: "512x512"
          }
        ],
      }
    })
  ],
  base: dest_root,
  server: {
    port: 3000,
    https: fs.existsSync(path.resolve(__dirname, 'cert.key')) && fs.existsSync(path.resolve(__dirname, 'cert.crt')) ? {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    } : undefined,
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
