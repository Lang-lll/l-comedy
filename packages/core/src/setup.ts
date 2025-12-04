import path from 'path'
import { generateEntryFile } from './utils/generateEntryFile'

import type {
  UserConfig,
  SetupOptions,
  SetupConfigPlugin,
  LComedyPlugin,
  EntryModifier,
} from './types'

export async function setup(userConfig: UserConfig, options: SetupOptions) {
  const baseConfig: SetupConfigPlugin = {
    isProd: process.env.NODE_ENV === 'production',
    root: options.root,
    workDir: options.workDir,
    sourceDir: options.sourceDir,
    userConfig,
  }

  const plugins: LComedyPlugin[] = []

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
}
