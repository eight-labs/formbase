/** @type {import('eslint').Linter.Config} */
const config = {
  ignorePatterns: ['apps/**', 'packages/**', 'tests/playwright-report/**', 'tests/test-results/**', '**/.eslintrc.cjs'],
  extends: ['formbase/base'],
};

module.exports = config;
