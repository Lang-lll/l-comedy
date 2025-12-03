import path from 'path'
import fs from 'fs'
import type { Config as JestConfig } from '@jest/types'

export interface RunJestOptions {
  watch?: boolean
  coverage?: boolean
}

export async function runJest(
  config: JestConfig.InitialOptions,
  options?: RunJestOptions
) {
  // 生成临时jest配置
  const configPath = path.join(process.cwd(), `jest.config.tmp.js`)
  fs.writeFileSync(
    configPath,
    `module.exports = ${JSON.stringify(config, null, 2)}`
  )

  // 构建jest命令参数
  const args = ['--config', configPath]
  if (options?.watch) args.push('--watch')
  if (options?.coverage) args.push('--coverage')

  // 执行jest
  const { spawn } = require('child_process')
  const jestProcess = spawn('npx', ['jest', ...args], {
    stdio: 'inherit',
  })

  return new Promise((resolve) => {
    jestProcess.on('close', resolve)
  })
}
