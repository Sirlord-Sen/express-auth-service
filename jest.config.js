/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@auth-service/(.*)": "<rootDir>/src/$1",
    "@modules/(.*)": "<rootDir>/src/modules/$1",
    "@config/(.*)": "<rootDir>/src/config/$1",
    "@core/(.*)": "<rootDir>/src/core/$1",
    "@middlewares/(.*)": "<rootDir>/src/middlewares/$1",
    "@modules/(.*)": "<rootDir>/src/modules/$1",
    "@utils/(.*)": "<rootDir>/src/utils/$1",
    "@providers/(.*)": "<rootDir>/src/providers/$1",
    "@helpers/(.*)": "<rootDir>/src/helpers/$1",
    "@db/(.*)": "<rootDir>/src/db/$1"
  },
};