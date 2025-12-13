import fs from 'fs-extra'
import path from 'path'
import { generateEntryFile } from './utils/setup/generateEntryFile'
import createLComedyPluginAppConfig from './plugins/app-config'
import createLComedyPluginHtml from './plugins/html'
import createLComedyPluginPageLoading from './plugins/page-loading'
import createLComedyPluginLayout from './plugins/layout'
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

  const plugins: LComedyPlugin[] = [
    createLComedyPluginAppConfig(),
    createLComedyPluginHtml(),
    createLComedyPluginLayout(),
    createLComedyPluginPageLoading(),
  ]

  for (const plugin of userConfig.plugins || []) {
    if (typeof plugin === 'string') {
      plugins.push(
        require(path.posix.join(__dirname, `./plugins/${plugin}`)).default()
      )
    } else if (typeof plugin === 'object') {
      plugins.push(plugin)
    }
  }

  fs.ensureDirSync(baseConfig.workPath)
  fs.emptyDirSync(baseConfig.workPath)

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

  const setupConfig: SetupConfig = {
    ...baseConfig,
    plugins,
  }

  await generateEntryFile(
    modifiers,
    path.posix.join(baseConfig.root, baseConfig.workDir),
    setupConfig
  )

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
