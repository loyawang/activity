import Vue from 'vue'
import '@/assets/css/reset.css'
import '@/assets/css/global.css'
import '@/tools/ua-parser.min.js'
import '@/tools/deviceInit.js'
import '@/service/components'
import BrowserEnv from '@/tools/browserEnv.js'
import DooolyFun from '@/tools/dooolyAPP.js'
import UmengClick from '@/tools/umeng.js'
import Http from '@/service/http'
import Constant from '@/service/constant'
import Wechat from '@/service/weixin'

const parser = new UAParser()
const result = parser.getResult()
let browser = result.browser.name
if (browser === 'Android Browser') {
  browser = 'Chrome WebView'
}
Vue.prototype.$BrowserName = browser
Vue.prototype.$BrowserEnv = BrowserEnv(Vue.prototype.$BrowserName)
Vue.prototype.$UmengClick = UmengClick(Vue.prototype.$BrowserName)
Vue.prototype.$DooolyAPP = DooolyFun(Vue.prototype.$BrowserName)
Vue.prototype.$Http = Http(Vue.prototype.$BrowserName)
Vue.prototype.$Constant = Constant
Vue.prototype.$Wechat = Wechat(Vue)
// 微信获取config配置
// Vue.prototype.$Wechat.getWechatConfig().then(res => {
//   const obj1 = {
//     title: '哈哈', // 分享标题
//     desc: '你好', // 分享描述
//     link: 'https://www.baidu.com', // 分享链接
//     imgUrl: 'http://www.doooly.com/static/images/logo.png' // 分享图标
//   }
//   const shareConfig = Object.assign({}, res.data, obj1);
//   if (res.code === '4001') {
//     Vue.prototype.$Wechat.shareWithFriendsWX(shareConfig) // 40001微信配置
//   } else if (res.code === '4002') {
//     Vue.prototype.$Wechat.shareWithFriendsAPP(shareConfig) // 40002兜里配置
//   }

// })
