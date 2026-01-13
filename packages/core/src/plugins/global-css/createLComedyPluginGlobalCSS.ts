import fs from 'fs-extra'
import path from 'path'
import type { LComedyPlugin } from '../../types'

const names = ['global.css', 'global.less']

export function createLComedyPluginGlobalCSS(): LComedyPlugin {
  return {
    name: 'l-comedy-plugin-global-css',
    modifyEntry(setupConfig) {
      const imports: string[] = []

      names.forEach((name) => {
        const cssPath = path.posix.join(setupConfig.sourceDir, name)

        if (fs.existsSync(cssPath)) {
          imports.push(`import '@/${name}'`)
        }
      })

      return {
        imports,
      }
    },
  }
}
