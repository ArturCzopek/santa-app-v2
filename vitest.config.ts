import { resolve } from 'path';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // The function sources under test import firebase-admin; use the one
    // copy of the root package so the tests and the code share its classes.
    alias: [
      {
        find: /^firebase-admin\/(.*)$/,
        replacement: resolve(__dirname, 'node_modules/firebase-admin/lib/$1'),
      },
    ],
  },
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    environment: 'node',
    // Services under test talk to the local emulators (see .env.emulators).
    env: loadEnv('emulators', process.cwd(), 'VITE_'),
    // All tests share a single emulator instance.
    fileParallelism: false,
    testTimeout: 15000,
  },
});
