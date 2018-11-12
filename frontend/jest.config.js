// jest.config.js
module.exports = {
  preset: 'jest-puppeteer',
  rootDir: 'scripts',
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleDirectories: ['node_modules'],
  globals: {
    NODE_ENV_DEV: false
  },
  collectCoverage: process.env.JEST_COVERAGE && JSON.parse(process.env.JEST_COVERAGE),
  collectCoverageFrom: ['**/*.js'],
  coveragePathIgnorePatterns: ['tests/puppeteer']
};
