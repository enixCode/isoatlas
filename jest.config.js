/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ['node_modules', '<rootDir>'],
  // Sans cela, jest ramasse les .d.ts generes par le build dans dist/
  // et les compte comme des suites de test vides.
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};
