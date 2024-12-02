import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-snowfall',  // Add here the problematic libraries you want to optimize
            '@mui/material',
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'react-router-dom',
        ],
    },
    build: {
        rollupOptions: {
            external: ['firebase'],
        },
    },
});
