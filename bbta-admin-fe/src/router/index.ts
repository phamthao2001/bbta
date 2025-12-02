import { createRouter, createWebHistory } from 'vue-router'

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
          path: 'admin',
          name: 'admin',
          component: () => import('@/views/AdminView.vue'),
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

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('bbta_admin_token')
//   if (to.path === '/login' && token) {
//     next('/tables')
//   } else if (to.path !== '/login' && !token) {
//     next('/login')
//   } else {
//     next()
//   }
// })

export default router
