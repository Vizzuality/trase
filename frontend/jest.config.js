// jest.config.js
module.exports = {
  rootDir: 'scripts',
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleDirectories: ['node_modules'],
  globals: {
    NODE_ENV_DEV: false
  },
  collectCoverage: process.env.JEST_CI && JSON.parse(process.env.JEST_CI),
  collectCoverageFrom: ['**/*.js'],
  coveragePathIgnorePatterns: ['tests/puppeteer']
};
