/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ['formbase/base'],
  rules: {
    // Relax strict typing rules for test files
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
  },
};

module.exports = config;
