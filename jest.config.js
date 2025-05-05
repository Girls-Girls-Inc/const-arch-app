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
    "!frontend/src/context/**",
    "backend/**/*.{js,ts}" ,
    "!backend/config.js",
    "!frontend/src/App.jsx",
    "!frontend/src/main.jsx",
    "!frontend/src/redux/**",
    "!frontend/src/pages/editUpload.jsx",
    "!frontend/src/pages/EmailLinkHandler.jsx",
    "!frontend/src/pages/manageUploads.jsx",
    "!frontend/src/pages/manageUsers.jsx",
    "!frontend/src/pages/search.jsx",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
};