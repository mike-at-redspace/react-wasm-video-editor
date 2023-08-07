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
            '@types/chroma-js',
            '@types/lodash',
            '@types/jest',
            '@testing-library/jest-dom',
            '@testing-library/react',
            '@testing-library/user-event',
            'airtable',
            'chroma-js',
            'classnames',
            'lodash',
            'react',
            'react-colorful',
            'react-div-100vh',
            'react-dom',
            'react-draggable',
            'react-masonry-css',
            'react-router-dom',
            'react-scripts',
            'react-slider',
            'react-tiny-popover',
            'typescript',
            'unsplash-js'
          ]
        }
      }
    }
  }
});
