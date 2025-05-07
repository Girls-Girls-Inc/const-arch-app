export default {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!firebase/)', // Keep this to avoid issues with Firebase
    '\\.css$', // Ignore CSS files during transformation
  ],
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'frontend/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
  verbose: true,

  collectCoverage: true,
  collectCoverageFrom: [
    "frontend/src/**/*.{js,jsx,ts,tsx}",
     "!frontend/src/components/**",
     "!frontend/src/context/**",
    "backend/**/*.{js,ts}" ,
    "!backend/models/**",
    "!backend/config.js",
    "!frontend/src/App.jsx",
    "!frontend/src/main.jsx",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};