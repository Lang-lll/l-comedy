import path from 'path'
import fs from 'fs-extra'
import { spawn } from 'child_process'
import type { Config as JestConfig } from '@jest/types'

export interface RunJestOptions {
  watch?: boolean
  coverage?: boolean
}

export async function runJest(
  config: JestConfig.InitialOptions,
  options?: RunJestOptions
) {
  const root = process.cwd().replace(/\\/g, '/')
  const workDirPath = path.posix.join(root, '.comedy')

  // 生成临时jest配置
  const configPath = path.posix.join(workDirPath, `jest.config.tmp.cjs`)
  fs.outputFileSync(
    configPath,
    `module.exports = ${JSON.stringify(config, null, 2)}`
  )

  // 构建jest命令参数
  const args = ['--config', configPath]
  if (options?.watch) args.push('--watch')
  if (options?.coverage) args.push('--coverage')

  // 执行jest
  const jestProcess = spawn('npx', ['jest', ...args], {
    shell: true,
    cwd: process.cwd(),
    stdio: 'inherit',
  })

  return new Promise((resolve) => {
    jestProcess.on('close', resolve)
  })
}
