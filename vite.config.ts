import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: [
        '**/.verification/**',
        '**/test-results/**',
        '**/playwright-report/**',
        '**/.contentcraft-design/**',
      ],
    },
  },
  build: { chunkSizeWarningLimit: 750 },
})
