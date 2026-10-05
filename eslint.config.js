import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
export default defineConfig(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'qa/**',
      'test-results/**',
      'playwright-report/**',
    ],
  },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  { rules: { '@typescript-eslint/no-explicit-any': 'error' } }
);
