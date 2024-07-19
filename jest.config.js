const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  preset: "react-native",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!react-native|@react-native|@react-navigation|react-navigation)"
  ],
  testEnvironment: "jest-environment-jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
};