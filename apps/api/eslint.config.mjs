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
      '@typescript-eslint/no-extraneous-class': 'off', // NestJS AppModule-ന് വേണ്ടി
    },
  },
];
