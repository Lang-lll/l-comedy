import fs from 'fs-extra'
import vm from 'vm'
import Module from 'module'
import { transformSync } from 'esbuild'
import type { UserConfig } from '../../types'

export function loadUserConfig(filepath: string): UserConfig {
  try {
    return runFileConfig(filepath)
  } catch (e) {
    console.log(`加载配置出错${filepath}:
${e}`)
    return {}
  }
}

function runFileConfig(filepath: string) {
  try {
    const fileContent = fs.readFileSync(filepath, 'utf-8')

    const result = transformSync(fileContent, {
      loader: 'tsx',
      format: 'cjs',
    })

    const m = new Module(`l_comedy_config_${Date.now()}`)
    const script = new vm.Script(result.code)

    const context = vm.createContext({
      module: m,
      exports: m.exports,
      require,
      __filename: filepath,
      __dirname: require('path').dirname(filepath),
      console,
      process,
    })

    script.runInContext(context)

    return m.exports.default || m.exports || {}
  } catch (e) {
    throw e
  }
}
