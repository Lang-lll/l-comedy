import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
// import CopyWebpackPlugin from 'copy-webpack-plugin'
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
            ? 'static/js/[name].[contenthash:8].js'
            : 'static/js/[name].js',
          clean: true,
        },
        module: {
          ...rspackConfig.module,
          rules: [
            ...(rspackConfig.module?.rules || []),
            {
              test: /\.(ts|tsx)$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: require.resolve('ts-loader'),
                  options: {
                    transpileOnly: true,
                    compilerOptions: {
                      paths: {
                        '@/*': ['src/*'],
                      },
                    },
                  },
                },
              ],
            },
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
                        ? 'static/css/[hash:base64:8]'
                        : 'static/css/[path][name]__[local]--[hash:base64:5]',
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
                /*new CopyWebpackPlugin({
                  patterns: [
                    {
                      from: path.resolve(setupConfig.root, publicDir),
                      to: '.',
                      globOptions: {
                        dot: false,
                      },
                    },
                  ],
                }),*/
              ]
            : []),
        ],
      }

      if (!setupConfig.isProd) {
        newConfig.devServer = {
          ...rspackConfig.devServer,
          port: setupConfig.userConfig.port,
          hot: true,
          historyApiFallback: true,
          static: {
            directory: publicDir,
          },
        }
      }

      return newConfig
    },
  }
}
