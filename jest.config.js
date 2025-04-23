module.exports = {
    // Transform files using babel-jest
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest', // Handles JS, JSX, TS, and TSX files
    },
    
    // Jest should not ignore `firebase/` directory in node_modules (it uses ES modules)
    transformIgnorePatterns: [
      'node_modules/(?!firebase/)', // Make sure Firebase is transpiled by babel
    ],
  
    // Set test environment (Node or jsdom)
    testEnvironment: 'jsdom', // if you're testing React apps, use jsdom
  
    // If you want to configure module paths
    moduleDirectories: ['node_modules', 'frontend/src'],
  };