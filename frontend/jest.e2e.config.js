const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  preset: 'jest-puppeteer',
  collectCoverage: false,
  testPathIgnorePatterns: []
};
