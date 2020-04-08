import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Home from '../views/Home.vue'
import Product from '../views/Product.vue'

const router = new VueRouter({
  routes: [
    {
      path: '',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/product',
      component: Product
    }
  ]
})

export default router
