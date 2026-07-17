import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 0,  // 大文件不内联，直接复制到 dist
    chunkSizeWarningLimit: 1000,  // 提高警告阈值
  },
})
