/* 启动文件 */
import 'es6-shim'
import Vue from 'vue/dist/vue.js'
import router from '@/routes/'
import App from '@/components/App'
import xhr from '@/service/xhr/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$XHR = xhr
Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

if (__DEV__) {
  console.info('[当前环境] 开发环境')
  Vue.config.devtools = true
}

if (__PROD__) {
  console.info('[当前环境] 生产环境')
  Vue.config.devtools = false
}

import '@/assets/less/style.less'
