import base from '@repo/eslint-config/base';
import ts from '@repo/eslint-config/typescript';
import react from '@repo/eslint-config/react';
import next from '@repo/eslint-config/next';
import testing from '@repo/eslint-config/testing';

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
  ...react,
  ...next,
  ...testing,
];
