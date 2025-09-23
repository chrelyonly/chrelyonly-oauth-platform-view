import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import oauth2 from "@/views/oauth2/oauth2.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/oauth2',
      name: '开放授权',
      component: oauth2
    },
  ]
})

export default router
