import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { createHtmlFile } from './createHtmlFile'
import { createTemplateParameters } from './createTemplateParameters'
import type { LComedyPlugin } from '../../types'

// TODO: 改成rspack插件
export function createLComedyPluginHtml(): LComedyPlugin {
  return {
    name: 'l-comedy-plugin-html',
    rspackConfig(rspackConfig, setupConfig) {
      return {
        ...rspackConfig,
        plugins: [
          ...(rspackConfig.plugins || []),
          new HtmlWebpackPlugin({
            template: path.posix.join(setupConfig.workDir, 'index.html'),
            filename: 'index.html',
            minify: setupConfig.isProd
              ? {
                  collapseWhitespace: true,
                  removeComments: true,
                  removeRedundantAttributes: true,
                }
              : false,
            cache: true,
            inject: true,
            ...setupConfig.userConfig.html?.htmlWebpackOptions,
            templateParameters: {
              ...setupConfig.userConfig.html?.htmlTemplateParametersData,
              ...createTemplateParameters(setupConfig),
            },
          }),
        ],
      }
    },
    async generateFiles(setupConfig) {
      createHtmlFile(setupConfig)
    },
  }
}
