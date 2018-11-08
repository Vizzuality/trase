// jest.config.js
module.exports = {
  testURL: 'http://localhost:8081',
  rootDir: 'scripts',
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleDirectories: ['node_modules'],
  globals: {
    NODE_ENV_DEV: false
  }
};
