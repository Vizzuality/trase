// jest.config.js
module.exports = {
  preset: 'jest-puppeteer',
  rootDir: 'scripts',
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleDirectories: ['node_modules'],
  globals: {
    NODE_ENV_DEV: false
  },
  collectCoverage: true,
  collectCoverageFrom: ['**/*.js']
};
