import Vue from 'vue'
import VueRouter from 'vue-router'
import routerList from './routerList'

Vue.use(VueRouter)

const router = new VueRouter({
  suppressTransitionError: __PROD__, // 生产环境下不抛出异常
  routes: routerList
})

export default router
