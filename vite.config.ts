import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

import { CDN_IMAGE_BASE } from './src/utils/api-base'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    // Static uploads often send Cross-Origin-Resource-Policy: same-origin, which blocks
    // <img src="http://api-host/..."> from the dev origin. Proxy keeps requests same-origin.
    proxy: {
      '/uploads': {
        target: CDN_IMAGE_BASE,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
