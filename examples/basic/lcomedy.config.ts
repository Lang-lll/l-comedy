import { defineConfig } from '@l-comedy/core'

export default defineConfig({
  plugins: ['route'],
  port: 9000,
  html: {
    title: 'Basic',
    rootId: 'app-root',
  },
  route: {
    routes: [
      {
        path: '/',
        component: '@/views/Home',
        children: [
          {
            path: '/child',
            component: '@/views/Child',
            children: [
              { path: '/child/grand', component: '@/views/Grand', lazy: true },
            ],
          },
          { path: '/child2', component: '@/views/Child2' },
        ],
      },
      { path: '/bro', component: '@/views/Bro', lazy: true },
    ],
  },
})
