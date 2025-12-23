import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [react(), imagetools()],

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  build: {
    target: 'es2019',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('swiper')) {
              return 'swiper';
            }
            if (id.includes('@stripe')) {
              return 'stripe';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('react')) {
              return 'react-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },

  preview: {
    host: true,
    port: 4173,
    allowedHosts: [
      'frontend.supercheaptyre.com.au',
      'localhost',
      '127.0.0.1',
      'supercheaptyre.com.au'
    ],
  },

  server: {
    host: true,
    port: 4173,
  },
});