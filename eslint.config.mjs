import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import security from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwind from 'eslint-plugin-tailwindcss';
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
  // Base Configurations
  // ==================================================
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...nextVitals,
  ...nextTs,
  ...tailwind.configs['flat/recommended'],
  jsxA11y.flatConfigs.recommended,
  security.configs.recommended,
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
      unicorn,
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
      // ♿ Accessibility (jsx-a11y)
      // --------------------------
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/no-autofocus': 'warn',

      // --------------------------
      // 🦄 Unicorn — Modern JS
      // --------------------------
      'unicorn/better-regex': 'error',
      'unicorn/catch-error-name': 'error',
      'unicorn/consistent-function-scoping': 'error',
      'unicorn/explicit-length-check': 'error',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],
      'unicorn/no-array-for-each': 'error',
      'unicorn/no-await-expression-member': 'error',
      'unicorn/no-console-spaces': 'error',
      'unicorn/no-nested-ternary': 'error',
      'unicorn/no-new-array': 'error',
      'unicorn/no-useless-undefined': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-string-trim-start-end': 'error',
      'unicorn/prefer-ternary': 'warn',
      'unicorn/prevent-abbreviations': 'off',

      // --------------------------
      // 🔒 Security
      // --------------------------
      'security/detect-non-literal-regexp': 'error',
      'security/detect-object-injection': 'warn',
      'security/detect-possible-timing-attacks': 'error',
      'security/detect-unsafe-regex': 'error',

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
