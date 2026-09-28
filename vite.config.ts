import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const contentSecurityPolicy = (authDomain?: string) => {
  const sources = [
    "default-src 'self'",
    "script-src 'self' https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    // Google account photos (navbar avatar, participant stamps).
    "img-src 'self' https://*.googleusercontent.com",
    "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com",
    `frame-src ${[
      authDomain && `https://${authDomain}`,
      'https://www.youtube-nocookie.com',
    ]
      .filter(Boolean)
      .join(' ')}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  return {
    name: 'production-content-security-policy',
    transformIndexHtml: {
      order: 'pre' as const,
      handler: () => [
        {
          tag: 'meta' as const,
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: sources.join('; '),
          },
          injectTo: 'head-prepend' as const,
        },
      ],
    },
  };
};

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const addProductionPolicy =
    command === 'build' && (mode === 'production' || mode === 'staging');

  return {
    plugins: [
      react(),
      ...(addProductionPolicy
        ? [contentSecurityPolicy(env.VITE_FIREBASE_AUTH_DOMAIN)]
        : []),
    ],
    base: './',
    build: {
      outDir: 'build',
      // The Firebase SDK alone is ~540 kB minified (~160 kB gzipped).
      chunkSizeWarningLimit: 600,
      rolldownOptions: {
        output: {
          // Libraries change far less often than the app, so keeping them in
          // their own files lets browsers reuse them from cache after a deploy.
          codeSplitting: {
            groups: [
              {
                name: 'firebase',
                test: /node_modules[\\/](@firebase|firebase)[\\/]/,
              },
              { name: 'mui', test: /node_modules[\\/](@mui|@emotion)[\\/]/ },
              {
                name: 'react',
                test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
              },
              { name: 'vendor', test: /node_modules[\\/]/ },
            ],
          },
        },
      },
    },
  };
});
