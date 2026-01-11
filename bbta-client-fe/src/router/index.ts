import { createRouter, createWebHistory } from 'vue-router'

import { api } from '@/plugin/axios'

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
    {
      path: '/home',
      name: 'home',
      component: () => import('@/pages/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginView.vue'),
    },
    {
      path: '/my-order',
      name: 'my-order',
      component: () => import('@/pages/MyOrder.vue'),
    },
    {
      path: '/table-booking',
      name: 'table-booking',
      component: () => import('@/pages/TableBooking.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const serve_session = localStorage.getItem('serve-session-id')

  if (serve_session) {
    const { data } = await api.get(`/serve-session/check/${serve_session}`)

    if (!data.exist) {
      localStorage.removeItem('serve-session-id')
    }
  }

  next()
})

export default router
