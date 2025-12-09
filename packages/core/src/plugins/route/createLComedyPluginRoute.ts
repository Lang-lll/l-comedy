import fs from 'fs-extra'
import path from 'path'
import type { LComedyPlugin, RouteConfig } from '../../types'

export function createLComedyPluginRoute(): LComedyPlugin {
  let componentIndex = 0
  return {
    name: 'l-comedy-plugin-route',
    async generateFiles(setupConfig) {
      componentIndex = 0
      const routes = setupConfig.userConfig.route?.routes || []
      const importsCode: string[] = []

      const computeRoutesCode = (routes: RouteConfig[]): string => {
        return `  ${routes
          .map((route) => {
            ++componentIndex
            importsCode.push(
              route.lazy
                ? `const Component${componentIndex} = lazy(() => import('${route.component}'))`
                : `import Component${componentIndex} from '${route.component}'`
            )
            return `{ path: '${
              route.path
            }', element: <Component${componentIndex} />${
              route.children
                ? `,
    children: [
      ${computeRoutesCode(route.children)}
]`
                : ''
            } }`
          })
          .join(',\n')}`
      }

      let routesCode = `[
${computeRoutesCode(routes)}
]`

      fs.outputFileSync(
        path.posix.join(setupConfig.workDir, 'runtimes', 'route/routes.tsx'),
        `import { lazy } from 'react'
${importsCode.join('\n')}
export default ${routesCode}`
      )

      fs.outputFileSync(
        path.posix.join(
          setupConfig.workDir,
          'runtimes',
          'route/createRouter.ts'
        ),
        `import { createBrowserRouter } from 'react-router'
import routes from './routes'

export default createBrowserRouter(routes${
          setupConfig.userConfig.route?.basename
            ? `, { basename: '${setupConfig.userConfig.route.basename}' }`
            : ''
        })`
      )
    },
    /** Suspense */
    modifyEntry() {
      return {
        imports: [
          "import { RouterProvider } from 'react-router'",
          "import router from './runtimes/route/createRouter'",
        ],
        app() {
          return `<RouterProvider router={router} />`
        },
      }
    },
  }
}
