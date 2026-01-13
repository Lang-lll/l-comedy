import path from 'path'
import fs from 'fs-extra'
import { build } from 'tsup'
import { loadUserConfig } from '../utils/config/loadUserConfig'
import { getDefaultUserConfigName } from '../utils/config/getDefaultUserConfigName'

export async function runTsup(options?: { config?: string }) {
  const root = process.cwd().replace(/\\/g, '/')
  const filePath = path.posix.join(
    root,
    options?.config ? options.config : getDefaultUserConfigName()
  )

  const userConfig = loadUserConfig(filePath)

  if (!userConfig.tsup?.targets.length) {
    console.error('没有tsup配置')
    return
  }

  const outDir = userConfig.tsup.outDir || 'lib'
  const outPath = path.posix.join(root, outDir)

  fs.ensureDirSync(outPath)
  fs.emptyDirSync(outPath)

  for (const target of userConfig.tsup.targets) {
    await build({
      entry: [
        target.entry,
        `${target.entry}.{ts,tsx}`,
        '!**/*.d.ts',
        '!**/__tests__',
        '!**/*.test.*',
      ],
      outDir: path.posix.join(root, outDir, 'cjs', target.relativeOutDir || ''),
      format: ['cjs'],
      dts: true,
      sourcemap: false,
      clean: false,
      minify: false,
      bundle: false,
      outExtension: () => ({ js: '.js', dts: '.d.ts' }),
      ...userConfig.tsup.options,
    })
  }

  for (const target of userConfig.tsup.targets) {
    await build({
      entry: [
        target.entry,
        `${target.entry}.{ts,tsx}`,
        '!**/*.d.ts',
        '!**/__tests__',
        '!**/*.test.*',
      ],
      outDir: path.posix.join(root, outDir, 'esm', target.relativeOutDir || ''),
      format: ['esm'],
      dts: true,
      sourcemap: false,
      clean: false,
      minify: false,
      bundle: false,
      outExtension: () => ({ js: '.js', dts: '.d.ts' }),
      ...userConfig.tsup.options,
    })
  }
}
