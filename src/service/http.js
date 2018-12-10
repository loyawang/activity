import Vue from 'vue'
import Axios from 'axios'
import Cookies from 'js-cookie'
// import * as deviceInit from '@/tools/deviceInit'
// const browserName = deviceInit.default.browserName
// baseURL: 'http://test1.doooly.com',
const _this = Vue.prototype
// cookie有效期设置久一点
const cookieObj = {
  expires: new Date(2020, 11, 19),
  path: '/',
  domain: window.location.hostname
}
const axios = Axios.create({
  timeout: 10000,
  headers: {}
})

const Http = browserName => {
  if (!sessionStorage.httpTimestamp) {
    sessionStorage.httpTimestamp = new Date().getTime()
  } else if (new Date().getTime() - sessionStorage.httpTimestamp > 86400000) {
    sessionStorage.httpTimestamp = new Date().getTime()
  }

  axios.interceptors.request.use(
    config => {
      if (browserName === 'Chrome WebView') {
        if (config.data && config.data.outAPP) {
          _this.$Indicator.open({
            text: '加载中...',
            spinnerType: 'snake'
          })
        } else {
          RHNativeJS.showWaitPanel()
        }
      } else {
        _this.$Indicator.open({
          text: '加载中...',
          spinnerType: 'snake'
        })
      }
      if (
        config.url.indexOf('?') > -1 &&
        config.url.indexOf('timestamp') < 0
      ) {
        config.url += '&timestamp=' + sessionStorage.httpTimestamp
      } else {
        config.url += '?timestamp=' + sessionStorage.httpTimestamp
      }

      if (browserName === 'WeChat') {
        if (window.location.href.indexOf('wiscowechat') > 0) {
          if (localStorage.wiscoToken) {
            localStorage.token = localStorage.wiscoToken
          }
        } else {
          if (localStorage.dooolyToken) {
            localStorage.token = localStorage.dooolyToken
          }
        }
      }
      if (localStorage.token || Cookies.get('token')) {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        console.log(Cookies.get('token'))
        config.headers.token = localStorage.token || Cookies.get('token')
      }
      if (browserName === 'WeChat') {
        if (
          !localStorage.wiscowechatCodeType &&
          window.location.href.indexOf('wiscowechat') > 0
        ) {
          config.headers.channel = 'wiscowechat'
        } else {
          config.headers.channel = 'wechat'
        }
      } else if (
        browserName === 'WebKit' ||
        browserName === 'Chrome WebView'
      ) {
        config.headers.channel = 'app'
      } else if (browserName === 'otherAPPAndroid') {
        config.headers.channel = 'wiscoapp'
      } else if (browserName === 'otherAPPIos') {
        config.headers.channel = 'wiscoapp'
      } else {
        config.headers.channel = 'h5'
      }
      // if (!localStorage.userId && !Cookies.get('userId')) {
      //   let url = _this.$Constant.webSite
      //   window.location.href = url
      // }
      return config
    },
    err => {
      if (browserName === 'Chrome WebView') {
        RHNativeJS.hideWaitPanel()
      } else {
        _this.$Indicator.close()
      }
      sessionStorage.httpTimestamp = new Date().getTime()
      return Promise.reject(err)
    }
  )

  // 对数据返回进行拦截
  axios.interceptors.response.use(
    res => {
      if (browserName === 'Chrome WebView') {
        if (res.config.data && JSON.parse(res.config.data).outAPP) {
          _this.$Indicator.close()
        } else {
          RHNativeJS.hideWaitPanel()
        }
      } else {
        _this.$Indicator.close()
      }
      if (res.data.code && res.data.code == '40001') {
        _this.$Toast(res.data.info)
        if (browserName === 'WebKit' || browserName === 'otherAPPIos') {
          window.webkit.messageHandlers.forceLoginOut.postMessage('1')
        } else if (
          browserName === 'Chrome WebView' ||
          browserName === 'otherAPPAndroid'
        ) {
          RHNativeJS.forceLoginOut('')
        } else {
          let loginUrl = window.location.href
          if (loginUrl) {
            localStorage.loginUrl = loginUrl
            Cookies.set('loginUrl', loginUrl, cookieObj)
          }
          let url = _this.$Constant.webSite
          localStorage.removeItem('wiscowechatCodeType')
          if (window.location.href.indexOf('wiscowechat') > 0) {
            localStorage.removeItem('wiscoToken')
            localStorage.removeItem('token')
          } else {
            localStorage.removeItem('dooolyToken')
            localStorage.removeItem('token')
          }
          if (/wiscowechat/.test(window.location.href)) {
            window.location.replace(url + 'companyLogin/wugang')
          } else if (/zfhwechat/.test(window.location.href)) {
            window.location.replace(url + 'companyLogin/zfh')
          } else {
            window.location.replace(url)
          }
        }
      }
      return res
    },
    error => {
      // 返回错误统一处理, vuex内无需另行处理，比如自身网络错误等
      if (browserName === 'Chrome WebView') {
        RHNativeJS.hideWaitPanel()
      } else {
        _this.$Indicator.close()
      }
      sessionStorage.httpTimestamp = new Date().getTime()
      if (navigator.onLine) {
        _this.$Toast('小兜兜正忙,请稍候重试!')
        if (errorFlag !== 0) {
          return
        } else {
          errorFlag = 1
          errorLog(browserName, error)
        }
      } else {
        _this.$Toast('网络已断开，请检查网络并刷新!')
      }
      return Promise.reject(error)
    }
  )
  return {
    get(url, params) {
      return new Promise((resolve, reject) => {
        axios.get(url, {
          params: params
        })
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    post(url, params) {
      return new Promise((resolve, reject) => {
        axios.post(url, params)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
}

var errorFlag = 0
var errorLog = function (browserName, error) {
  let clientChannel = 'h5'
  if (browserName == 'WeChat') {
    clientChannel = 'wechat'
  } else if (browserName == 'WebKit') {
    clientChannel = 'iOS'
  } else if (browserName == 'Chrome WebView') {
    clientChannel = 'Android'
  }
  axios({
    method: 'post',
    url: _this.$Constant.errorLog,
    data: {
      'timestamp': sessionStorage.httpTimestamp, // 当前时间戳
      'clientChannel': clientChannel, // 终端渠道 H5/iOS/Android
      'sign': '', // md5 签名，暂可为空
      'param': {
        'logStr': error, // 异常信息
        'terminalModel': '', // 机型及操作系统
        'userId': localStorage.userId || Cookies.get('userId'), // 用户ID
        'appVersion': localStorage.versionName, // app当前版本
        'pageUrl': window.location.href // 页面请求链接url
      }
    }
  }).then((res) => {})
}

export default Http
