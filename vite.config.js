import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige las llamadas de autenticación al microservicio de usuarios
      '/api/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      // Redirige las llamadas del dashboard al BFF
      '/api/dashboard': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      }
    }
  }
})
