import base from '@ff/eslint-config/base';
import ts from '@ff/eslint-config/typescript';
import react from '@ff/eslint-config/react';

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
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      "react/no-unescaped-entities": "off"
    },
  },
];
