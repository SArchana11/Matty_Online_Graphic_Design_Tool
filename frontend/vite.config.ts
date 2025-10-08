
// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allows you to use "@" as an alias for the "src" directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // This will proxy any request starting with /api to your backend server
      '/api': {
        target: 'http://localhost:5000', // Your backend server URL
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Can be false if your backend is HTTP
      },
    },
  },
})


 