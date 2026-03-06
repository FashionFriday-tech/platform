import base from '@ff/eslint-config/base';
import ts from '@ff/eslint-config/typescript';
import react from '@ff/eslint-config/react';
import next from '@ff/eslint-config/next';
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
  ...react,
  ...next,
  ...testing,
];
