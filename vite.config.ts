import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  /**
   * Dev-server proxy
   *
   * The browser can only talk to the same origin (localhost:5173).
   * Requests to /api/* are stripped of the /api prefix and forwarded
   * by Vite's dev server to http://localhost:9000, which has no CORS
   * restrictions because the forwarding happens server-side.
   *
   * Example:
   *   Browser → GET localhost:5173/api/players
   *   Vite    → GET localhost:9000/players  (adds the response to the browser)
   */
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
