## 安装

```
pnpm add @l-comedy/core
```

## 添加配置文件

```
// lcomedy.config.ts 在项目根部
import { defineConfig } from '@l-comedy/core'

export default defineConfig({
  plugins: ['route'],
  port: 9000,
  html: {
    title: 'Basic',
  },
  route: {
    routes: [
      {
        path: '/',
        component: '@/views/Home',
      }
    ],
  },
})
```

## 运行

```
# 本地调试
lcomedy dev
# 打开http://localhost:9000

# 打包
lcomedy build
# 生成dist
```
