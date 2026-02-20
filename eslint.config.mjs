/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import jest from 'eslint-plugin-jest';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import security from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwind from 'eslint-plugin-tailwindcss';
import testingLibrary from 'eslint-plugin-testing-library';
import unicorn from 'eslint-plugin-unicorn';
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
  // Base Configurations (Applies to ALL files)
  // ==================================================
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  security.configs.recommended,
  eslintPluginPrettierRecommended,

  // ==================================================
  // Global Rules & Settings
  // ==================================================
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      'simple-import-sort': simpleImportSort,
      unicorn,
    },

    rules: {
      // --------------------------
      // 🔄 Import Sorting
      // --------------------------
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^react', '^next'], ['^@?\\w'], ['^@/'], ['^\\.\\./', '^\\./', '^\\.']],
        },
      ],

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
      // 🦄 Unicorn — Modern JS
      // --------------------------
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],
      'unicorn/better-regex': 'off',
      'unicorn/catch-error-name': 'off',
      'unicorn/no-array-for-each': 'error',
      'unicorn/no-await-expression-member': 'error',
      'unicorn/no-console-spaces': 'error',
      'unicorn/no-new-array': 'error',
      'unicorn/no-useless-undefined': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-string-trim-start-end': 'error',
      'unicorn/prevent-abbreviations': 'off',

      // FIX: Turned off rules causing Circular Loops & React issues
      'unicorn/no-nested-ternary': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/explicit-length-check': 'off',
      'unicorn/consistent-function-scoping': 'off',

      // --------------------------
      // 🔒 Security
      // --------------------------
      'security/detect-possible-timing-attacks': 'error',
      'security/detect-unsafe-regex': 'error',

      // FIX: Turned off false-positive warnings
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-regexp': 'off',

      // --------------------------
      // ✨ Code Quality
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

  // ==================================================
  // Next.js — scoped to apps/web only
  // ==================================================
  ...nextVitals.map((config) => ({
    ...config,
    files: ['apps/web/**/*.{ts,tsx}'],
  })),
  ...nextTs.map((config) => ({
    ...config,
    files: ['apps/web/**/*.{ts,tsx}'],
  })),

  // ==================================================
  // Tailwind — scoped to web & ui
  // ==================================================
  {
    files: ['apps/web/**/*.{ts,tsx}', 'packages/ui/**/*.{ts,tsx}'],
    plugins: {
      tailwindcss: tailwind,
    },
    rules: {
      ...tailwind.configs['flat/recommended'][0].rules,
    },
  },

  // ==================================================
  // React Hooks — Shared (Web & UI)
  // ==================================================
  {
    files: ['apps/web/**/*.{ts,tsx}', 'packages/ui/**/*.{ts,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
    },
  },

  // ==================================================
  // React Core Rules — UI Package Only
  // ==================================================
  {
    files: ['packages/ui/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
    },
    rules: {
      'react/display-name': 'warn',
      'react/no-unescaped-entities': 'off',
    },
  },

  // ==================================================
  // NestJS API Overrides
  // ==================================================
  {
    files: ['apps/api/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
        },
      ],
    },
  },

  // ==================================================
  // Shared Packages Overrides
  // ==================================================
  {
    files: ['packages/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },

  // ==================================================
  // Test Files Only
  // ==================================================
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    plugins: {
      jest,
      'testing-library': testingLibrary,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-standalone-expect': 'error',
      'jest/no-identical-title': 'error',
      'jest/valid-expect': 'error',
      'jest/valid-expect-in-promise': 'error',
      'testing-library/await-async-queries': 'error',
      'testing-library/await-async-utils': 'error',
      'testing-library/no-await-sync-queries': 'error',
      'testing-library/no-container': 'error',
      'testing-library/no-debugging-utils': 'warn',
      'testing-library/no-dom-import': 'error',
      'testing-library/prefer-find-by': 'error',
      'testing-library/prefer-screen-queries': 'error',
    },
  },
]);
