import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    // All rules tests share a single emulator instance.
    fileParallelism: false,
    testTimeout: 15000,
  },
});
