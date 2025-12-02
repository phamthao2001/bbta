import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layout/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
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

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('bbta_staff_token')
  if (to.path === '/login' && token) {
    next('/home')
  } else if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
