import fs from 'fs-extra'
import path from 'path'
import type { EntryModifier, SetupConfig } from '../../types'

export async function generateEntryFile(
  modifiers: EntryModifier[],
  targetDir: string,
  setupConfig: SetupConfig,
) {
  const allImports = new Set<string>()
  const allReactImports = new Set<string>()
  modifiers.forEach((m) => {
    m.imports?.forEach((i) => allImports.add(i))
    m.reactImports?.forEach((i) => allReactImports.add(i))
  })

  let appCode = '<div />'
  let entryCode = `import React${
    allReactImports.size >= 0
      ? `, { ${Array.from(allReactImports).join(', ')} }`
      : ''
  } from 'react';
import { createRoot } from 'react-dom/client';
`

  entryCode += Array.from(allImports).join('\n') + '\n'

  // 插入前置代码
  modifiers.forEach((m) => {
    if (m.beforeRender) {
      entryCode += m.beforeRender + '\n'
    }
    if (m.app) {
      appCode = m.app(appCode)
    }
  })

  modifiers.forEach((m) => {
    if (m.appWrap) {
      appCode = m.appWrap(appCode)
    }
  })

  appCode = `<React.StrictMode>
  ${appCode}
</React.StrictMode>`

  let renderCode = `function render() {
  const rootContainer = document.getElementById('${
    setupConfig.userConfig.html?.rootId || 'root'
  }');

  if (rootContainer) {
    const root = createRoot(rootContainer);
    root.render(${appCode});
  }
}`

  let renderRunCode = `render();`

  modifiers.forEach((m) => {
    if (m.render) {
      renderCode = m.render(renderCode)
    }
    if (m.renderRun) {
      renderRunCode = m.renderRun(renderCode)
    }
  })

  entryCode += renderCode + '\n'

  entryCode += renderRunCode + '\n'

  // 插入后置代码
  modifiers.forEach((m) => {
    if (m.afterRender) {
      entryCode += m.afterRender + '\n'
    }
  })

  await fs.outputFile(
    path.posix.join(targetDir, 'exports.ts'),
    `${modifiers
      .filter((item) => item.runtimeExports)
      .map(
        (item) =>
          `${item.runtimeExports?.map((exportStr) => exportStr).join('\n')}`,
      )
      .join('\n')}`,
  )

  await fs.outputFile(path.posix.join(targetDir, 'entry.tsx'), entryCode)
}
