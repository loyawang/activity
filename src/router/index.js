import Vue from 'vue'
import Router from 'vue-router'

const Sign = () => import(/* webpackChunkName: "sign" */'@/views/sign/sign')
const Rule = () => import(/* webpackChunkName: "rule" */'@/views/sign/rule')
const SpellList = () => import(/* webpackChunkName: "spellList" */'@/views/spellList/spell')

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'sign',
    component: Sign,
    meta: {
      title: '每日签到'
    }
  }, {
    path: '/rule',
    name: 'rule',
    meta: {
      title: '签到规则'
    },
    component: Rule
  }, {
    path: '/spellList',
    name: 'spellList',
    meta: {
      title: '量贩装拼购活动页面'
    },
    component: SpellList
  }]
})
