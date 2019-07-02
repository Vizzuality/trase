// jest.config.js
require('core-js/stable');
require('regenerator-runtime/runtime');
const path = require('path');

module.exports = {
  rootDir: 'scripts',
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleDirectories: ['node_modules'],
  globals: {
    NODE_ENV_DEV: false,
    NODE_ENV_TEST: true,
    USE_PLAIN_URL_STATE: true,
    ENABLE_LEGACY_TOOL_SEARCH: false,
    INDONESIA_LOGISTICS_MAP_ACTIVE: false,
    DISABLE_PROFILES: false
  },
  collectCoverage: process.env.JEST_CI && JSON.parse(process.env.JEST_CI),
  collectCoverageFrom: ['**/*.js'],
  coverageReporters: ['lcov'],
  coverageDirectory: path.join(__dirname, '..', 'coverage'),
  coveragePathIgnorePatterns: ['tests/puppeteer']
};
