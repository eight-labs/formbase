import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.ts'],
    exclude: ['**/e2e/**', '**/node_modules/**'],
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true, // Serial execution for SQLite
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['../packages/api/**/*.ts', '../apps/web/src/lib/**/*.ts'],
      exclude: [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@formbase/api': path.resolve(__dirname, '../packages/api'),
      '@formbase/db': path.resolve(__dirname, '../packages/db'),
      '@formbase/auth': path.resolve(__dirname, '../packages/auth'),
      '@formbase/env': path.resolve(__dirname, '../packages/env'),
      '@formbase/utils': path.resolve(__dirname, '../packages/utils'),
      '~': path.resolve(__dirname, '../apps/web/src'),
    },
  },
});
