import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  css: {
    devSourcemap: true,
  },
  build: {
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['jszip'],
        }
      }
    }
  },
  worker: {
    format: 'es',
    plugins: () => [react()]
  },
  optimizeDeps: {
    exclude: ['workers/frameExtractor.worker.ts']
  }
});
