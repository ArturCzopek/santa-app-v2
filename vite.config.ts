import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': '/src',
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
    ],
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      external: ['firebase'],
    },
  },
});
