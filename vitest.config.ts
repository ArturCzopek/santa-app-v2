import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
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
