import fs from 'fs-extra'
import path from 'path'
import type { LComedyPlugin } from '../../types'

export function createLComedyPluginLayout(): LComedyPlugin {
  return {
    name: 'l-comedy-plugin-layout',
    modifyEntry(setupConfig) {
      let hasLayout = false
      const imports: string[] = []
      const layoutPath = path.posix.join(
        setupConfig.sourceDir,
        'layout/index.tsx'
      )

      if (fs.existsSync(layoutPath)) {
        hasLayout = true
        imports.push("import Layout from '@/layout/index'")
      }

      return {
        imports,
        appWrap(app) {
          if (!hasLayout) {
            return app
          }

          return `<Layout>
  ${app}
</Layout>`
        },
      }
    },
  }
}
