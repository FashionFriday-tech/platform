import { defineConfig, globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  // ==================================================
  // Global Ignores
  // ==================================================
  globalIgnores([
    'node_modules/**',
    'dist/**',
    'build/**',
    '.next/**',
    'out/**',
    'coverage/**',
    'next-env.d.ts',
  ]),

  // ==================================================
  // Base JavaScript Rules
  // ==================================================
  eslint.configs.recommended,

  // ==================================================
  // TypeScript (Type-Checked)
  // ==================================================
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
    },
  },

  // ==================================================
  // Next.js (Web App Only)
  // ==================================================
  ...nextVitals,
  ...nextTs,

  // ==================================================
  // Prettier Integration
  // ==================================================
  eslintPluginPrettierRecommended,

  // ==================================================
  // Custom Industrial Rules
  // ==================================================
  {
    rules: {
      // --------------------------
      // TypeScript Strictness
      // --------------------------
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],

      // --------------------------
      // Code Quality
      // --------------------------
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // --------------------------
      // Import Hygiene
      // --------------------------
      'no-duplicate-imports': 'error',

      // --------------------------
      // React / JSX Relaxation
      // --------------------------
      'react/no-unescaped-entities': 'off',

      // --------------------------
      // Best Practices
      // --------------------------
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
]);
