export default [
  {
    ignores: [
      'apps/**',
      'packages/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/dist/**',
    ],
  },
  {
    files: ['*.js', '*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];
