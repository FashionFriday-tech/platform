import base from '@repo/eslint-config/base';
import ts from '@repo/eslint-config/typescript';
import testing from '@repo/eslint-config/testing';
import next from 'eslint-config-next';

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
  ...next,
];
