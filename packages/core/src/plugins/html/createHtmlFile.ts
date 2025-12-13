import fs from 'fs-extra'
import path from 'path'
import type { SetupConfigPlugin } from '../../types'

export function createHtmlFile(setupConfig: SetupConfigPlugin) {
  const htmlConfig = setupConfig.userConfig.html || {}

  fs.outputFileSync(
    path.posix.join(setupConfig.workDir, 'index.html'),
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title><%= TITLE %></title>
  ${htmlConfig.headTags?.join('\n') || ''}
</head>
<body>
  ${htmlConfig.bodyBeforeTags?.join('\n') || ''}
  <div id="<%= ROOT_ID %>"></div>
  ${htmlConfig.bodyAfterTags?.join('\n') || ''}
</body>
</html>`
  )
}
