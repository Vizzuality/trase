// jest.config.js
require('@babel/polyfill');

module.exports = {
  rootDir: 'scripts',
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleDirectories: ['node_modules'],
  globals: {
    NODE_ENV_DEV: false,
    USE_PLAIN_URL_STATE: true,
    ENABLE_LEGACY_TOOL_SEARCH: false
  },
  collectCoverage: process.env.JEST_CI && JSON.parse(process.env.JEST_CI),
  collectCoverageFrom: ['**/*.js'],
  coveragePathIgnorePatterns: ['tests/puppeteer']
};
