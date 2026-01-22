import fs from 'fs-extra'
import path from 'path'
import fg from 'fast-glob'
import type { LComedyPlugin } from '../../types'

// TODO: 优化依赖
export function createLComedyPluginReduxToolkit(): LComedyPlugin {
  return {
    name: 'l-comedy-plugin-redux-toolkit',
    async generateFiles(setupConfig) {
      // TODO: 简化slice导出
      const sliceDir =
        setupConfig.userConfig.reduxToolkit?.slicesDir || `store/slice`
      const entires = await fg([`${sliceDir}/*.ts`, '!**/*.tsx'], {
        cwd: setupConfig.sourcePath,
        onlyFiles: true,
      })
      const fileMap = entires.map((filePath) => ({
        name: path.parse(filePath).name,
        filePath,
      }))
      fs.outputFileSync(
        path.posix.join(setupConfig.workDir, 'runtimes', 'redux/store.ts'),
        `import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  useStore,
} from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

// 导入所有 slice reducer
${fileMap.map((item) => `import ${item.name}Reducer from '@/${sliceDir}/${item.name}';`).join('\n')}

// 创建 store
export const store = configureStore({
  reducer: {
    ${fileMap.map((item) => `${item.name}: ${item.name}Reducer,`).join('\n')}
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<RootState>();
`,
      )
    },
    async modifyEntry() {
      return {
        imports: [
          `import { Provider as ReduxProvider } from 'react-redux'`,
          `import { store as reduxStore } from './runtimes/redux/store'`,
        ],
        runtimeExports: [
          `export { useAppSelector, useAppDispatch, useAppStore } from './runtimes/redux/store'`,
        ],
        appWrap(app) {
          return `<ReduxProvider store={reduxStore}>
  ${app}
</ReduxProvider>`
        },
      }
    },
  }
}
