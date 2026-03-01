import jest from 'eslint-plugin-jest';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';

export default [
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    plugins: {
      jest,
      'testing-library': testingLibrary,
    },
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      'jest/expect-expect': 'error',
      'jest/valid-expect': 'error',
      'testing-library/prefer-screen-queries': 'error',

      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
];
