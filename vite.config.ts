import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages, set `base` to '/<repo-name>/'.
// If hosting on a custom domain or at the root of a user/org page, set to '/'.
export default defineConfig({
  plugins: [react()],
  base: '/bodaInvitacionWeb/',
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 300,
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
})
