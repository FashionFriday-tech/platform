import base from '@ff/eslint-config/base';
import ts from '@ff/eslint-config/typescript';
import testing from '@ff/eslint-config/testing';

export default [
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  ...base,
  ...ts,
  ...testing,

  {
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off', // NestJS AppModule
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
    },
  },
];
