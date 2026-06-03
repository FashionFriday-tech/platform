export default {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'npx turbo run typecheck',

  // Lint and format TypeScript and JavaScript files
  '**/*.(ts|tsx|js|jsx|mjs)': (filenames) => [
    `npx eslint --fix ${filenames.join(' ')}`,
    `npx prettier --write ${filenames.join(' ')}`,
  ],

  // Format MarkDown, JSON, and CSS
  '**/*.(md|json|css|yaml|yml)': (filenames) => `npx prettier --write ${filenames.join(' ')}`,
};
