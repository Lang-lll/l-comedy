import path from 'path'
import { rspack } from '@rspack/core'
import { RspackDevServer } from '@rspack/dev-server'
import chokidar from 'chokidar'
import { setup } from '../setup'
import { loadUserConfig } from '../utils/config/loadUserConfig'
import { getDefaultUserConfigName } from '../utils/config/getDefaultUserConfigName'

export async function dev(options?: { config?: string }) {
  const root = process.cwd().replace(/\\/g, '/')
  const filePath = path.posix.join(
    root,
    options?.config ? options.config : getDefaultUserConfigName()
  )

  let devServer = await createDevServer(root, filePath)

  await devServer.start()

  const watcher = chokidar.watch(filePath).on('change', async () => {
    console.log(`配置变更: ${filePath}
重启服务...`)
    devServer.stop()
    devServer = await createDevServer(root, filePath)
    await devServer.start()
  })

  ;['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      watcher.close()
      devServer.stop()
      process.exit()
    })
  })
}

async function createDevServer(root: string, filePath: string) {
  const userConfig = loadUserConfig(filePath)

  const rspackConfig = await setup(userConfig, { root, isProd: false })

  const compiler = rspack(rspackConfig)

  return new RspackDevServer(rspackConfig.devServer || {}, compiler)
}
