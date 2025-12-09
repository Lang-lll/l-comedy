import type { SetupConfigPlugin } from '../../types'
export function createTemplateParameters(setupConfig: SetupConfigPlugin) {
  return {
    BUILD_TIME: new Date().toISOString(),
    BUILD_TIMESTAMP: Date.now(),

    IS_PROD: setupConfig.isProd,

    TITLE: setupConfig.userConfig.html?.title || 'App',
    ROOT_ID: setupConfig.userConfig.html?.rootId || 'root',
  }
}
