// jest.config.js
require('core-js/stable');
require('regenerator-runtime/runtime');
const path = require('path');
const globals = require('./env.test');

module.exports = {
  globals,
  rootDir: 'scripts',
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleDirectories: ['node_modules'],
  collectCoverage: false,
  collectCoverageFrom: ['**/*.js'],
  coverageDirectory: path.join(__dirname, 'coverage'),
  coveragePathIgnorePatterns: ['tests/puppeteer'],
  moduleNameMapper: {
    '^styles/_settings.scss': '<rootDir>/../styles/styles-settings-stub.js'
  }
};
