import fs from 'fs-extra'
import path from 'path'
import type { LComedyPlugin } from '../../types'

export function createLComedyPluginPageLoading(): LComedyPlugin {
  return {
    name: 'l-comedy-plugin-page-loading',
    modifyEntry(setupConfig) {
      let hasLoading = false
      const imports: string[] = []
      const pageLoadingPath = path.posix.join(
        setupConfig.sourceDir,
        'layout/PageLoading.tsx'
      )

      if (fs.existsSync(pageLoadingPath)) {
        hasLoading = true
        imports.push("import PageLoading from '@/layout/PageLoading'")
      }

      return {
        imports,
        reactImports: ['Suspense'],
        appWrap(app) {
          return `<Suspense fallback={${
            hasLoading ? '<PageLoading />' : '<div />'
          }}>
  ${app}
</Suspense>`
        },
      }
    },
  }
}
