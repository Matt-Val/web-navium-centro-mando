import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  server: {
    proxy: {
      // Redirige las llamadas de autenticación al microservicio de usuarios
      '/api/auth': {
        target: 'http://54.225.232.55:8081',
        changeOrigin: true,
      },
      // Redirige las llamadas del dashboard al BFF
      '/api/dashboard': {
        target: 'http://54.225.232.55:8084',
        changeOrigin: true,
      }
    }
  }
})
