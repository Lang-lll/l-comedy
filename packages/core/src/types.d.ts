import type { Configuration as RSPackConfig } from '@rspack/core'
import type { Options as HtmlWebpackOptions } from 'html-webpack-plugin'

export interface UserConfig {
  port?: number
  html?: HtmlConfig
  route?: {
    routes?: RouteConfig[]
  }
  plugins?: Array<'route' | LComedyPlugin>
  rspackConfig?: RSPackConfig
  sourceDir?: string
  output?: string
  publicDir?: string
}

export interface LComedyPlugin {
  name: string
  generateFiles?: (service: SetupConfigPlugin) => Promise<void> | viod
  modifyEntry?: (
    service: SetupConfigPlugin
  ) => EntryModifier | Promise<EntryModifier>
  rspackConfig?: (
    rspackConfig: RSPackConfig,
    setupConfig: SetupConfig
  ) => RSPackConfig | Promise<RSPackConfig>
  runtimeExports?: string[]
}

export interface RouteConfig {
  path: string
  component?: string
  children?: RouteConfig[]
  lazy?: boolean
}

export interface HtmlConfig {
  title?: string
  rootId?: string
  headTags?: string[]
  bodyBeforeTags?: string[]
  bodyAfterTags?: string[]
  htmlWebpackOptions?: HtmlWebpackOptions
  htmlTemplateParametersData?: Record<string, any>
}

export interface SetupConfig {
  isProd: boolean
  root: string
  userConfig: UserConfig
  plugins: LComedyPlugin[]
  workDir: string
  sourceDir: string
  workPath: string
  sourcePath: string
}

export type SetupConfigPlugin = Omit<SetupConfig, 'plugins'>

export interface EntryModifier {
  imports?: string[]
  beforeRender?: string
  afterRender?: string
  app?: (app: string) => string
  appWrap?: (app: string) => string
  render?: (render: string) => string
  renderRun?: (renderRun: string) => string
}

export interface SetupOptions {
  isProd: boolean
  root: string
}
