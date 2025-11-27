import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/order-food',
      name: 'order-food',
      component: () => import('@/pages/OrderFood.vue'),
    },
    {
      path: '/code-login',
      name: 'code-login',
      component: () => import('@/pages/CodeLogin.vue'),
    },
  ],
})

export default router
