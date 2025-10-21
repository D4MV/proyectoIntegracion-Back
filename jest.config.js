module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js','json','ts'],
  rootDir: '.',
  testRegex: '(\\.spec\\.ts$|\\.e2e-spec\\.ts$)',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  moduleNameMapper: { '^src/(.*)$': '<rootDir>/src/$1' },
};