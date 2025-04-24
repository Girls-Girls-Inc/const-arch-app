module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!firebase/)', // Keep this to avoid issues with Firebase
    '\\.css$', // Ignore CSS files during transformation
  ],
  testEnvironment: 'jsdom', 
  moduleDirectories: ['node_modules', 'frontend/src'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
  ],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',  // Mock CSS imports
  },
  verbose: true,
};