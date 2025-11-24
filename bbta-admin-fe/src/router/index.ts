import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layout/MainLayout.vue'),
      children: [
        {
          path: 'tables',
          name: 'tables',
          component: () => import('@/views/TablesView.vue'),
        },
        {
          path: 'menu',
          name: 'menu',
          component: () => import('@/views/MenuView.vue'),
        },
        {
          path: 'staff',
          name: 'staff',
          component: () => import('@/views/StaffView.vue'),
        },
      ],
    },
  ],
})

export default router
