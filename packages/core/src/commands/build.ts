import path from 'path'
import { rspack } from '@rspack/core'
import { setup } from '../setup'
import { loadUserConfig } from '../utils/config/loadUserConfig'
import { getDefaultUserConfigName } from '../utils/config/getDefaultUserConfigName'
import type { Configuration as RSPackConfig } from '@rspack/core'

export async function build(options?: { config?: string }) {
  const root = process.cwd().replace(/\\/g, '/')
  const filePath = path.posix.join(
    root,
    options?.config ? options.config : getDefaultUserConfigName()
  )

  const userConfig = loadUserConfig(filePath)

  const rspackConfig = await setup(userConfig, { root, isProd: true })

  await runBuild(rspackConfig)
}

function runBuild(rspackConfig: RSPackConfig) {
  return new Promise<void>((resolve, reject) => {
    const compiler = rspack(rspackConfig)

    compiler.run((err, stats) => {
      if (err) {
        console.error(err)
        reject(err)
        return
      }

      if (stats && stats.hasErrors()) {
        const info = stats.toJson()
        console.error('Build errors:', info.errors)
        reject(new Error('Build failed with errors'))
        return
      } else if (stats) {
        console.log(
          stats.toString({
            colors: true,
            modules: false,
            chunks: false,
            chunkModules: false,
          })
        )
      }

      compiler.close((closeErr) => {
        if (closeErr) {
          console.error(closeErr)
          reject(closeErr)
        } else {
          console.log('Build completed successfully!')
          resolve()
        }
      })
    })
  })
}
