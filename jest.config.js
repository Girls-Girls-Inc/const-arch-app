module.exports = {
    // Specifies the environment for testing (Node for API tests, jsdom for front-end tests)
    testEnvironment: "jsdom",  // Use "node" if you are testing APIs or server-side code

    // Paths that Jest should scan for tests
    roots: ["<rootDir>/tests", "<rootDir>/frontend/src"],

    // Allows you to use custom transform modules
    transform: {
        // Use babel-jest to handle JavaScript and JSX files
        "^.+\\.jsx?$": "babel-jest",  // Transform JS/JSX files using Babel

        // If you are using CSS modules, you can use a mock or stub the CSS
        "^.+\\.css$": "jest-transform-stub",  // Mock CSS imports to avoid issues in Jest
    },

    // Jest ignores node_modules for transformations by default
    transformIgnorePatterns: [
        "/node_modules/(?!your-module-to-transform|other-module).*/", // If you need to transform specific node_modules
    ],

    // Mocking static assets (like CSS or images)
    moduleNameMapper: {
        "\\.css$": "identity-obj-proxy",  // Mock CSS imports, useful for CSS Modules
        "\\.svg$": "<rootDir>/__mocks__/svgMock.js", // Mock SVG files, if necessary
        "\\.(jpg|jpeg|png|gif|webp|avif|ico)$": "<rootDir>/__mocks__/fileMock.js", // Mock image files
    },

    // Coverage collection settings (optional)
    collectCoverage: true,
    collectCoverageFrom: [
        "frontend/src/**/*.{js,jsx}",  // Collect coverage from your frontend source files
        "backend/**/*.{js,ts}",  // If you also have a backend in JS or TypeScript
    ],
    coverageDirectory: "<rootDir>/coverage",  // Output directory for coverage reports
    coverageThreshold: {
        global: {
            branches: 80,  // 80% branch coverage
            functions: 80,  // 80% function coverage
            lines: 80,  // 80% line coverage
            statements: 80,  // 80% statement coverage
        },
    },

    // Setup file before tests are run (useful for global mocks or initializations)
    setupFiles: [
        "<rootDir>/jest.setup.js",  // Create this file for global setup, if necessary
    ],

    // Automatically clear mock calls and instances between each test
    clearMocks: true,

    // Enable verbose output in the test results
    verbose: true,

    // Module resolution strategy
    moduleDirectories: ["node_modules", "frontend/src"],

    // If you're using TypeScript, you can add the following:
    globals: {
        "ts-jest": {
            isolatedModules: true,  // Speed up testing for large TypeScript projects
        },
    },

    // Optional: Setup global mocks, spies, or initializations here
    // setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],  // If you're using React Testing Library

    // Configure Jest to watch files for changes and rerun tests (helpful in dev environments)
    watchPathIgnorePatterns: ["node_modules", "dist"],

    // Run tests in a single process (useful for debugging)
    maxWorkers: 1,
};
