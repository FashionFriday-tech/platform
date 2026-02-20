import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import jest from 'eslint-plugin-jest';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import security from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwind from 'eslint-plugin-tailwindcss';
import testingLibrary from 'eslint-plugin-testing-library';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
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

  // --- Base Configs (Applies to ALL files) ---
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  security.configs.recommended,
  eslintPluginPrettierRecommended,

  // --- Global Rules & Settings ---
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
      'simple-import-sort/exports': 'error',
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
      'no-restricted-imports': ['error', { patterns: ['../**/apps/*'] }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'unicorn/better-regex': 'error',
      'unicorn/filename-case': ['error', { cases: { kebabCase: true, pascalCase: true } }],
      'unicorn/no-nested-ternary': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prevent-abbreviations': 'off',
      'security/detect-object-injection': 'warn',
      'security/detect-possible-timing-attacks': 'error',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
    },
  },

  // --- Frontend Specific (Web & UI Packages Only) ---
  {
    files: ['apps/web/**/*.{ts,tsx}', 'packages/ui/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      tailwindcss: tailwind,
    },
    // Manually merging the flat configs for scoped application
    rules: {
      ...nextVitals[0].rules,
      ...nextTs[0].rules,
      ...tailwind.configs['flat/recommended'][0].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
    },
  },

  // --- Test Files Only ---
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    plugins: {
      jest,
      'testing-library': testingLibrary,
    },
    languageOptions: {
      globals: { ...globals.jest },
    },
    rules: {
      'jest/no-focused-tests': 'error',
      'jest/valid-expect': 'error',
      'testing-library/await-async-queries': 'error',
      'testing-library/no-container': 'error',
    },
  },
]);
