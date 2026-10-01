import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative paths so the build also works from a sub folder (GitHub Pages, slice 2).
  base: './',
  test: {
    environment: 'node',
  },
});
