import eslint from '@eslint/js';
import { globalIgnores } from 'eslint/config';
import security from 'eslint-plugin-security';
import unicorn from 'eslint-plugin-unicorn';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  // 🚫 Global ignores
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

  // 📦 Base configs
  eslint.configs.recommended,
  security.configs.recommended,
  prettier,

  {
    plugins: {
      unicorn,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // 🔄 Imports
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^react', '^next'], ['^@?\\w'], ['^@/'], ['^\\.']],
        },
      ],

      // 🏗️ Monorepo boundaries
      'no-restricted-imports': ['error', { patterns: ['../**/apps/*'] }],

      // ✨ Code quality
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-console': 'error',
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',

      // 🦄 Unicorn
      'unicorn/filename-case': [
        'error',
        { cases: { kebabCase: true, pascalCase: true, camelCase: true } },
      ],
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-await-expression-member': 'error',
      'unicorn/no-useless-undefined': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/prefer-ternary': 'off',

      // 🔒 Security
      'security/detect-possible-timing-attacks': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-object-injection': 'off',
    },
  },
];
