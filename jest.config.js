module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  projects: ['<rootDir>/packages/*/jest.config.js'],
  maxWorkers: 1
}
