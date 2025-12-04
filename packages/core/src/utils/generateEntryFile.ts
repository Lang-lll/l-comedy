import fs from 'fs-extra'
import path from 'path'
import type { EntryModifier } from '../types'

export async function generateEntryFile(
  modifiers: EntryModifier[],
  targetDir: string
) {
  let entryCode = `import React from 'react';
import { createRoot } from 'react-dom/client';
`
  let appCode = '<div />'

  const allImports = new Set<string>()
  modifiers.forEach((m) => m.imports?.forEach((i) => allImports.add(i)))
  entryCode += Array.from(allImports).join('\n') + '\n'

  // 插入前置代码
  modifiers.forEach((m) => {
    if (m.beforeRender) {
      entryCode += m.beforeRender + '\n'
    }
  })

  modifiers.forEach((m) => {
    if (m.appRender) {
      appCode = m.appRender(appCode)
    }
  })

  modifiers.forEach((m) => {
    if (m.appWrapRender) {
      appCode = m.appWrapRender(appCode)
    }
  })

  let renderCode = `function render() {
  const rootContainer = document.getElementById('root');
  const root = createRoot(rootContainer);
  root.render(${appCode});
}`

  modifiers.forEach((m) => {
    if (m.render) {
      renderCode = m.render(renderCode)
    }
  })

  entryCode += renderCode + '\n'

  // 插入后置代码
  modifiers.forEach((m) => {
    if (m.afterRender) {
      entryCode += m.afterRender + '\n'
    }
  })

  await fs.outputFile(path.posix.join(targetDir, 'entry.tsx'), entryCode)
}
