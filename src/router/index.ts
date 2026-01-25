import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/pages/HomePage.vue') },
  { path: '/link', component: () => import('@/pages/LinkPage.vue') },
  { path: '/button', component: () => import('@/pages/ButtonPage.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
