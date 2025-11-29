import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layout/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'thanh-toan/:serve_session_id',
          name: 'thanh-toan',
          component: () => import('@/views/PaymentView.vue'),
        },
      ],
    },
  ],
})

export default router
