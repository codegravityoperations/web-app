import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This matches any URL starting with /api
      '/api': {
        target: 'http://54.91.197.157:8080',
        changeOrigin: true,
        secure: false, // Prevents issues if the target has no SSL
      },
    },
  },
})
