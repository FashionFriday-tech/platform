import base from '@ff/eslint-config/base';
import ts from '@ff/eslint-config/typescript';
import react from '@ff/eslint-config/react';
import next from '@ff/eslint-config/next';
import testing from '@ff/eslint-config/testing';
import globals from 'globals';

export default [
  // 🔧 Monorepo fix
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
  },

  // 📦 Shared configs
  ...base,
  ...ts,
  ...react,
  ...next,
  ...testing,

  // 🛠️ Admin-specific overrides
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off',
      'unicorn/no-array-reduce': 'off',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      'react-hooks/set-state-in-effect': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
];
