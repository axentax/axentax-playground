import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/axentax-playground/",
  build: {
    outDir: "dist",
  },
  plugins: [
    react(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      }
    }
  },
  server: {
    open: true,
  },
})
