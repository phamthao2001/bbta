import { createRouter, createWebHistory } from 'vue-router'

import { useAuth } from '@/stores/useAuth'

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
  ],
})

const { isLoginedIn } = useAuth()

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !isLoginedIn.value) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
