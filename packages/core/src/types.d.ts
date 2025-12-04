import type { Configuration as RSPackConfig } from '@rspack/core'

export interface UserConfig {
  port?: number
  html?: HtmlConfig
  route?: {
    routes?: RouteConfig[]
  }
  plugins: Array<'route' | LComedyPlugin>
  rspackConfig?: RSPackConfig
}

export interface LComedyPlugin {
  name: string
  generateFiles?: (service: SetupConfigPlugin) => Promise<void>
  modifyEntry?: (
    service: SetupConfigPlugin
  ) => EntryModifier | Promise<EntryModifier>
  config?: (config: SetupConfig) => SetupConfig | Promise<SetupConfig>
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
  bodyTags?: string[]
  // 用户自定义的模板数据
  templateData?: Record<string, any>
  // html-webpack-plugin 配置
  htmlWebpackOptions?: {
    filename?: string
    minify?: boolean | any
    inject?: boolean | 'head' | 'body'
  }
}

export interface SetupConfig {
  isProd: boolean
  root: string
  userConfig: UserConfig
  plugins: LComedyPlugin[]
  workDir: string
  sourceDir: string
}

export type SetupConfigPlugin = Omit<SetupConfig, 'plugins'>

export interface EntryModifier {
  imports?: string[]
  beforeRender?: string
  afterRender?: string
  appRender?: (app: string) => string
  appWrapRender?: (app: string) => string
  render?: (render: string) => string
}

export interface SetupOptions {
  root: string
  workDir: string
  sourceDir: string
}
