import type { Config } from "jest";


const config: Config = {
  preset: "ts-jest",

  globals: {
    "ts-jest": {
      isolatedModules: true
    }
  },

  testEnvironment: "node",

  roots: [
    "<rootDir>/tests"
  ],

  testMatch: [
    "**/*.test.ts"
  ],

  moduleFileExtensions: [
    "ts",
    "js",
    "json"
  ],

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json"
      }
    ]
  },

  clearMocks: true,

  verbose: true
};


export default config;