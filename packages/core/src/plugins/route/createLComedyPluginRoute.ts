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
            return `<Route path="${
              route.path
            }" element={<Component${componentIndex} />}${
              route.index ? ' index' : ''
            }${
              route.children
                ? `>
  ${computeRoutesCode(route.children)}
</Route>`
                : ' />'
            }`
          })
          .join('\n')}`
      }

      let routesCode = `<Routes>
  ${computeRoutesCode(routes)}
</Routes>`

      fs.outputFileSync(
        path.posix.join(setupConfig.workDir, 'runtimes', 'route/AppRoutes.tsx'),
        `import { lazy } from 'react'
import { Routes, Route } from 'react-router'
${importsCode.join('\n')}

export default function AppRoutes() {
  return (
    ${routesCode}
  )
}`
      )
    },
    modifyEntry(setupConfig) {
      return {
        imports: [
          "import { BrowserRouter } from 'react-router'",
          "import AppRoutes from './runtimes/route/AppRoutes'",
        ],
        appWrap(app) {
          return `<BrowserRouter${
            setupConfig.userConfig.route?.basename
              ? ` basename="${setupConfig.userConfig.route.basename}"`
              : ''
          }>
  ${app}
</BrowserRouter>`
        },
        app() {
          return '<AppRoutes />'
        },
      }
    },
  }
}
