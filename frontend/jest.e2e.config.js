const baseConfig = require('./jest.config');

const isCI = process.env.JEST_CI && JSON.parse(process.env.JEST_CI);
module.exports = {
  ...baseConfig,
  preset: 'jest-puppeteer',
  collectCoverage: false,
  testPathIgnorePatterns: isCI ? ['tests/puppeteer/profile-root.test.e2e.js'] : []
};
