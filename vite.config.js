import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Grouping specific libraries into a separate chunk
          'vendor-chunk': [
            '@cesdk/cesdk-js',
            '@cesdk/engine',
            '@imgly/background-removal',
            'unsplash-js'
          ]
        }
      }
    }
  }
});
