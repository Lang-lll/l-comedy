import { deepMerge } from './deepMerge'
import type { Config as JestConfig } from '@jest/types'

export interface TestConfig {
  unit?: JestConfig.InitialOptions
  components?: JestConfig.InitialOptions
  common?: JestConfig.InitialOptions
}

export interface CreateJestConfigOptions {
  sourceDir?: string
}

export function mergeJestConfig(
  userConfig: JestConfig.InitialOptions,
  defaultConfig: JestConfig.InitialOptions
): JestConfig.InitialOptions {
  return deepMerge(defaultConfig, userConfig)
}

export function createJestConfig(
  testConfig?: TestConfig,
  options?: CreateJestConfigOptions
) {
  const { unit = {}, components = {}, common = {} } = testConfig || {}
  const sourceDir =
    typeof options?.sourceDir === 'string' ? options.sourceDir : 'src'

  const defaultCommonConfig: JestConfig.InitialOptions = {
    rootDir: process.cwd(),
    transform: {
      '^.+\\.(ts|tsx)$': [
        'ts-jest',
        {
          tsconfig: 'tsconfig.json',
          isolatedModules: true,
        },
      ],
    },
    moduleNameMapper: {
      '^@/(.*)$': `<rootDir>/${sourceDir}/$1`,
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
    collectCoverage: false,
  }

  const defaultUnitConfig: JestConfig.InitialOptions = {
    ...defaultCommonConfig,
    testEnvironment: 'node',
    testMatch: [
      `<rootDir>/${sourceDir}/**/__tests__/**/*.test.[jt]s`,
      '!**/*.[jt]sx',
    ],
    collectCoverageFrom: [`<rootDir>/${sourceDir}/**/*.{ts,js}`, '!**/*.d.ts'],
  }

  // TODO: 动态setupTests
  const defaultComponentsConfig: JestConfig.InitialOptions = {
    ...defaultCommonConfig,
    testEnvironment: 'jsdom',
    testMatch: [
      `<rootDir>/${sourceDir}/**/__tests__/**/*.test.[jt]sx`,
      '!**/*.[jt]s',
    ],
    setupFilesAfterEnv: [`<rootDir>/${sourceDir}/setupTests.ts`],
    transform: {
      ...defaultCommonConfig.transform,
      '^.+\\.(css|less|scss)$': require.resolve('jest-transform-stub'),
    },
    moduleNameMapper: {
      ...defaultCommonConfig.moduleNameMapper,
      '\\.(css|less|scss)$': require.resolve('identity-obj-proxy'),
      // '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.ts',
    },
    collectCoverageFrom: [
      `<rootDir>/${sourceDir}/components/**/*.tsx`,
      '!**/*.d.ts',
    ],
  }

  return {
    unit: mergeJestConfig(
      common,
      mergeJestConfig(defaultUnitConfig, unit || {})
    ),
    components: mergeJestConfig(
      common,
      mergeJestConfig(defaultComponentsConfig, components || {})
    ),
  }
}
