import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-snowfall',
      '@mui/material',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'react-router-dom',
      'date-fns'
    ],
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      external: ['firebase'],
    },
    commonjsOptions: {
      include: [/node_modules/], // This helps with CommonJS modules
      transformMixedEsModules: true,
    }
  },
});
