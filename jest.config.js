module.exports = {
    // Transform settings
    transform: {
      "^.+\\.(js|jsx|mjs)$": "babel-jest"
    },
    // Transform ignore patterns to include certain node_modules
    transformIgnorePatterns: [
      "/node_modules/(?!(axios)/)"
    ],
    // Other Jest settings
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    testEnvironment: "jsdom"
  };
  