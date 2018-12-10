// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/service/global'
import store from './store'

// 生产环境不可调试
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'pro_activity') {
  Vue.config.debug = false
  Vue.config.devtools = false
}
Vue.config.devtools = true
// 路由切换时回到顶部
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
