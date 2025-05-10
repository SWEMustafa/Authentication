import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,             // makes describe/test/expect available
    environment: 'jsdom',      // so you can render React components
    setupFiles: 'src/setupTests.js',  // import jest-dom matchers here
  }
})