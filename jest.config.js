module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ["<rootDir>tests/setupTests.ts"],
    coverageReporters: ["html", "json"],
    coverageDirectory: "coverage",
    moduleFileExtensions: ["ts", "tsx", "js", "json"],
    collectCoverageFrom: ["src/**/*.tsx", "src/**/*.ts"],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/docs/",
        "/coverage/",
        "/src/index.tsx",
    ],
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
        }
    },
    moduleNameMapper: {
      "\\.(css)$": "identity-obj-proxy"
    },
    testResultsProcessor: "./node_modules/jest-junit-reporter"
};