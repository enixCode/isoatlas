/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ['node_modules', '<rootDir>'],
  // Sans cela, jest ramasse les .d.ts generes par le build dans dist/
  // et les compte comme des suites de test vides.
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  // uuid 14 est ESM pur (pas d'export "require"), que jest ne sait pas charger
  // en CommonJS. On le sort donc des modules ignores et on le transpile.
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: { allowJs: true } }]
  },
  transformIgnorePatterns: ['/node_modules/(?!uuid)']
};
