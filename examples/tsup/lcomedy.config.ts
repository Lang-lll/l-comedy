import { defineConfig } from '@l-comedy/core'

export default defineConfig({
  tsup: {
    targets: [
      { entry: 'src/components/HelloWorld', relativeOutDir: 'components' },
      { entry: 'src/utils' },
    ],
  },
})
