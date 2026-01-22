import { defineConfig } from '@l-comedy/core'

export default defineConfig({
  plugins: ['route', 'redux-toolkit'],
  port: 9001,
  html: {
    title: 'Redux',
  },
  route: {
    routes: [
      {
        path: '/',
        component: '@/views/Home',
      },
    ],
  },
})
