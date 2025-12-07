import path from 'path'
import { generateEntryFile } from './utils/setup/generateEntryFile'
import createLComedyPluginAppConfig from './plugins/app-config'
import type { Configuration as RSPackConfig } from '@rspack/core'

import type {
  UserConfig,
  SetupConfig,
  SetupOptions,
  SetupConfigPlugin,
  LComedyPlugin,
  EntryModifier,
} from './types'

export async function setup(userConfig: UserConfig, options: SetupOptions) {
  const isProd = options.isProd
  const workDir = '.comedy'
  const sourceDir = userConfig.sourceDir || 'src'
  const baseConfig: SetupConfigPlugin = {
    isProd,
    root: options.root,
    workDir: workDir,
    workPath: path.posix.join(options.root, workDir),
    sourceDir: sourceDir,
    sourcePath: path.posix.join(options.root, sourceDir),
    userConfig,
  }

  const plugins: LComedyPlugin[] = [createLComedyPluginAppConfig()]

  for (const plugin of userConfig.plugins || []) {
    if (typeof plugin === 'string') {
      plugins.push(require(`./plugins/${plugin}`).default())
    } else if (typeof plugin === 'object') {
      plugins.push(plugin)
    }
  }

  const modifiers: EntryModifier[] = []

  for (const plugin of plugins) {
    if (plugin.generateFiles) {
      await plugin.generateFiles(baseConfig)
    }

    if (plugin.modifyEntry) {
      const modifier = await plugin.modifyEntry(baseConfig)
      modifiers.push(modifier)
    }
  }

  await generateEntryFile(
    modifiers,
    path.posix.join(baseConfig.root, baseConfig.workDir)
  )

  const setupConfig: SetupConfig = {
    ...baseConfig,
    plugins,
  }

  let rspackConfig: RSPackConfig = {
    mode: isProd ? 'production' : 'development',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': setupConfig.sourcePath,
      },
    },
  }

  for (const plugin of plugins) {
    if (plugin.rspackConfig) {
      rspackConfig = await plugin.rspackConfig(rspackConfig, setupConfig)
    }
  }

  return rspackConfig
}
