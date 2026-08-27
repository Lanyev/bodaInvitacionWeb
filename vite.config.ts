import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Firebase Hosting serves from the domain root.
// If you switch back to GitHub Pages, change `base` to '/<repo-name>/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 300,
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
})
