import path from 'path'
import { loadUserConfig } from '../utils/config/loadUserConfig'
import { getDefaultUserConfigName } from '../utils/config/getDefaultUserConfigName'
import { loadOptionalDependency } from '../utils/setup/loadOptionalDependency'
import type * as JestPreset from '../../../jest-preset/dist'

export async function test(options?: {
  config?: string
  type?: 'unit' | 'components' | 'all'
}) {
  const jestPreset = await loadOptionalDependency<typeof JestPreset>(
    '@l-comedy/jest-preset'
  )

  if (jestPreset) {
    const type = options?.type || 'all'
    const root = process.cwd().replace(/\\/g, '/')
    const filePath = path.posix.join(
      root,
      options?.config ? options.config : getDefaultUserConfigName()
    )

    const userConfig = loadUserConfig(filePath)

    const { unit, components } = jestPreset.createJestConfig(userConfig.test)

    try {
      if (type === 'unit' || type === 'all') {
        console.log('\n运行单元测试...')
        await jestPreset.runJest(unit)
      }

      if (type === 'components' || type === 'all') {
        console.log('\n运行组件测试...')
        await jestPreset.runJest(components)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
