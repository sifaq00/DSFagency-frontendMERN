import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Tetap gunakan base untuk frontend
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend berjalan di port 5000
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
