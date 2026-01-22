import type { Configuration as RSPackConfig } from '@rspack/core'
import type { Options as TsupOptions } from 'tsup'
import type { Options as HtmlWebpackOptions } from 'html-webpack-plugin'
import type { TestConfig } from '../../jest-preset/dist'

export interface UserConfig {
  port?: number
  html?: HtmlConfig
  route?: {
    basename?: string
    routes?: RouteConfig[]
  }
  reduxToolkit?: {
    /** 相对于@ */
    slicesDir?: string
  }
  plugins?: Array<'route' | 'redux-toolkit' | LComedyPlugin>
  rspackConfig?: RSPackConfig
  sourceDir?: string
  output?: string
  publicDir?: string
  test?: TestConfig
  tsup?: TsupConfig
}

export interface LComedyPlugin {
  name: string
  generateFiles?: (setupConfig: SetupConfigPlugin) => Promise<void> | viod
  modifyEntry?: (
    setupConfig: SetupConfigPlugin,
  ) => EntryModifier | Promise<EntryModifier>
  rspackConfig?: (
    rspackConfig: RSPackConfig,
    setupConfig: SetupConfig,
  ) => RSPackConfig | Promise<RSPackConfig>
  runtimeExports?: string[]
}

export interface RouteConfig {
  path: string
  index?: boolean
  component: string
  children?: RouteConfig[]
  lazy?: boolean
}

export interface HtmlConfig {
  title?: string
  rootId?: string
  headTags?: string[]
  bodyBeforeTags?: string[]
  bodyAfterTags?: string[]
  metaViewport?: string
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
  runtimeExports?: string[]
  reactImports?: string[]
  beforeRender?: string
  afterRender?: string
  devNeedWatchAddPaths?: string[]
  devNeedWatchChangePaths?: string[]
  app?: (app: string) => string
  appWrap?: (app: string) => string
  render?: (render: string) => string
  renderRun?: (renderRun: string) => string
}

export interface SetupOptions {
  isProd: boolean
  root: string
}

export interface TsupConfig {
  targets: TsupConfigTarget[]
  outDir?: string
  options?: Partial<Omit<TsupOptions, 'entry' | 'outDir'>>
}

export interface TsupConfigTarget {
  entry: string
  relativeOutDir?: string
}
