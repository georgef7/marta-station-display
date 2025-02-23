import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/marta-station-display/',
  server: {
    proxy: {
      '/meow': {
        target: 'https://developerservices.itsmarta.com:18096',  // Target API server
        changeOrigin: true,  // Modify the origin header for the request
        //secure: false,
        rewrite: (path) => path.replace(/^\/meow/, '')  // Remove the '/itsmarta' prefix when forwarding
      }
    }
  }
})
