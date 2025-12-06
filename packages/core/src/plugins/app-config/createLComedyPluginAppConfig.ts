import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import type { Configuration as RSPackConfig } from '@rspack/core'
import type { LComedyPlugin } from '../../types'

export function createLComedyPluginAppConfig(): LComedyPlugin {
  return {
    name: 'l-comedy-plugin-app-config',
    rspackConfig(rspackConfig, setupConfig) {
      const publicDir = setupConfig.userConfig.publicDir || 'public'
      const newConfig: RSPackConfig = {
        ...rspackConfig,
        entry: path.posix.join(setupConfig.workPath, 'entry.tsx'),
        output: {
          path: path.posix.join(
            setupConfig.root,
            setupConfig.userConfig.output || 'dist'
          ),
          filename: setupConfig.isProd
            ? 'js/[name].[contenthash:8].js'
            : 'js/[name].js',
          publicPath: '/',
        },
        module: {
          ...rspackConfig.module,
          rules: [
            ...(rspackConfig.module?.rules || []),
            {
              test: /\.(css|less)$/,
              use: [
                setupConfig.isProd
                  ? MiniCssExtractPlugin.loader
                  : 'style-loader',
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    modules: {
                      auto: true,
                      localIdentName: setupConfig.isProd
                        ? '[hash:base64:8]'
                        : '[path][name]__[local]--[hash:base64:5]',
                      exportLocalsConvention: 'camelCaseOnly',
                    },
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                },
                {
                  loader: 'less-loader',
                  options: {
                    lessOptions: {
                      javascriptEnabled: true,
                    },
                  },
                },
              ],
            },
          ],
        },
        plugins: [
          ...(rspackConfig.plugins || []),
          ...(setupConfig.isProd
            ? [
                new CopyWebpackPlugin({
                  patterns: [
                    {
                      from: 'public',
                      to: '.',
                    },
                  ],
                }),
              ]
            : []),
        ],
      }

      if (!setupConfig.isProd) {
        newConfig.devServer = {
          ...rspackConfig.devServer,
          hot: true,
          historyApiFallback: true,
          static: {
            directory: path.posix.join(setupConfig.root, publicDir),
          },
        }
      }

      return newConfig
    },
  }
}
