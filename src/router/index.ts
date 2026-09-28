import { createRouter, createWebHistory } from 'vue-router'
import GameView from '@/views/GameView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: GameView,
    },
  ],
})