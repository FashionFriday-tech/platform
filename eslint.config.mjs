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
  // 🚫 Global Ignores
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
  // 📦 Base Configurations (Applies to ALL files)
  // ==================================================
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  security.configs.recommended,
  eslintPluginPrettierRecommended,

  // ==================================================
  // 🌐 Global Rules & Settings (All TS/TSX files)
  // ==================================================
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      // NOTE: Do NOT merge browser + node globals here.
      // Globals are scoped per environment below.
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
          groups: [['^react', '^next'], ['^@?\\w'], ['^@/'], ['^\\.\\./|^\\./|\\.']],
        },
      ],

      // --------------------------
      // 🏗️ Monorepo Boundaries
      // NOTE: For stronger enforcement, consider eslint-plugin-boundaries.
      // This pattern catches relative cross-app imports but NOT aliased ones.
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
      '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: false, allowNullish: false },
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
      'unicorn/no-array-for-each': 'warn',
      'unicorn/no-array-reduce': 'warn',
      'unicorn/no-await-expression-member': 'error',
      'unicorn/no-console-spaces': 'error',
      'unicorn/no-new-array': 'error',
      'unicorn/no-useless-undefined': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-string-trim-start-end': 'error',
      'unicorn/prevent-abbreviations': 'off',

      // FIX: Turned off rules causing circular loops & React issues
      'unicorn/no-nested-ternary': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/explicit-length-check': 'off',
      'unicorn/consistent-function-scoping': 'off',

      // --------------------------
      // 🔒 Security
      // --------------------------
      'security/detect-possible-timing-attacks': 'error',
      'security/detect-unsafe-regex': 'error',

      // FIX: High false-positive rate — disabled intentionally
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'off',

      // --------------------------
      // ✨ Code Quality
      // --------------------------
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-console': 'error',
      'no-debugger': 'error',
      'no-unused-expressions': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },

  // ==================================================
  // 🌍 Browser Environment — Web & UI only
  // ==================================================
  {
    files: ['apps/web/**/*.{ts,tsx}', 'apps/admin/**/*.{ts,tsx}', 'packages/ui/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // ==================================================
  // 🖥️ Node Environment — API only
  // ==================================================
  {
    files: ['apps/api/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // ==================================================
  // ⚡ Next.js — scoped to apps/web only
  // ==================================================
  ...nextVitals.map((config) => ({
    ...config,
    files: ['apps/web/**/*.{ts,tsx}', 'apps/admin/**/*.{ts,tsx}'],
  })),
  ...nextTs.map((config) => ({
    ...config,
    files: ['apps/web/**/*.{ts,tsx}', 'apps/admin/**/*.{ts,tsx}'],
  })),

  // ==================================================
  // 🎨 Tailwind — scoped to web & ui
  // ==================================================
  {
    files: ['apps/web/**/*.{ts,tsx}', 'apps/admin/**/*.{ts,tsx}', 'packages/ui/**/*.{ts,tsx}'],
    plugins: {
      tailwindcss: tailwind,
    },
    rules: {
      ...tailwind.configs['flat/recommended'][0].rules,
    },
  },

  // ==================================================
  // ⚛️ React Core + Hooks — Web & UI
  // ==================================================
  {
    files: ['apps/web/**/*.{ts,tsx}', 'apps/admin/**/*.{ts,tsx}', 'packages/ui/**/*.{ts,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      // Core
      'react/display-name': 'warn',
      'react/no-unescaped-entities': 'off',
      'react/jsx-no-useless-fragment': 'warn',
      'react/self-closing-comp': 'error',

      // Hooks
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
    },
  },

  // ==================================================
  // 🔧 NestJS API Overrides
  // ==================================================
  {
    files: ['apps/api/**/*.ts'],
    rules: {
      // NestJS decorators & DI patterns make some unsafe rules noisy
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      'security/detect-object-injection': 'warn',
      '@typescript-eslint/no-extraneous-class': 'off',

      // API logs to stdout intentionally (use a logger in prod)
      'no-console': 'warn',

      // API files use kebab-case only (no PascalCase components)
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
  // 📦 Shared Packages Overrides
  // ==================================================
  {
    files: ['packages/**/*.{ts,tsx}'],
    rules: {
      // Packages are consumed by multiple apps — relax cross-boundary rule
      'no-restricted-imports': 'off',

      // Allow console.warn/error in shared utility packages
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // ==================================================
  // 🧪 Test Files Only
  // ==================================================
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
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
      // Relax strict TS rules in tests for developer ergonomics
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      'no-console': 'off',

      // Jest
      'jest/expect-expect': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/no-standalone-expect': 'error',
      'jest/valid-expect': 'error',
      'jest/valid-expect-in-promise': 'error',

      // Testing Library
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
