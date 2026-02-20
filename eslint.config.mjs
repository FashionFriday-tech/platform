import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwind from 'eslint-plugin-tailwindcss';
import globals from 'globals';
import tseslint from 'typescript-eslint';

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
    '*.config.js',
    '*.config.ts',
  ]),

  // ==================================================
  // Base Configurations
  // ==================================================
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...nextVitals,
  ...nextTs,
  ...tailwind.configs['flat/recommended'],
  eslintPluginPrettierRecommended,

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

    plugins: {
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      // --------------------------
      // 🔄 Import Sorting Rules
      // --------------------------
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^next'],
            ['^@?\\w'],
            ['^@/'],
            ['^\\.\\./', '^\\./', '^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // --------------------------
      // 🏗️ Monorepo Boundaries
      // --------------------------
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../**/apps/*'],
        },
      ],

      // --------------------------
      // 🛡️ TypeScript Strictness
      // --------------------------
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // --------------------------
      // ⚛️ React & Hooks
      // --------------------------
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react/no-unescaped-entities': 'off',

      // --------------------------
      // ✨ Code Quality & Best Practices
      // --------------------------
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-unused-expressions': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
]);
