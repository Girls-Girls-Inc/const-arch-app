export default {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!firebase/)',
    '\\.(css)$',
  ],
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'frontend/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '^\.\.\\/\.\.\\/db$': '<rootDir>/backend/db.js',
  },
  verbose: true,

  collectCoverage: true,
  collectCoverageFrom: [
    "frontend/src/**/*.{js,jsx,ts,tsx}",
    "!frontend/src/context/**",
    "backend/**/*.{js,ts}" ,
    "!backend/config.js",
    "!frontend/src/App.jsx",
    "!frontend/src/main.jsx",
    "!frontend/src/redux/**",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  extensionsToTreatAsEsm: ['.jsx'],
  moduleFileExtensions: ['js','jsx','json','node'],
};
