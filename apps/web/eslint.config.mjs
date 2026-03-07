import base from '@ff/eslint-config/base';
import ts from '@ff/eslint-config/typescript';
import testing from '@ff/eslint-config/testing';
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

  {
    rules: {
      'react/no-unescaped-entities': 'off',
      'security/detect-object-injection': 'off',
    },
  },
];
