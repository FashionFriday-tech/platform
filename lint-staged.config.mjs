export default {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'turbo run typecheck',

  // Lint and format TypeScript and JavaScript files
  '**/*.(ts|tsx|js|jsx|mjs)': (filenames) => [
    `eslint --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
  ],

  // Format MarkDown, JSON, and CSS
  '**/*.(md|json|css|yaml|yml)': (filenames) =>
    `prettier --write ${filenames.join(' ')}`,
};
