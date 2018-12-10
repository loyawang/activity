// 判断使用类型(WeChat,app(苹果：WebKit,安卓：Chrome WebView), 浏览器)
// 根据browserName设置环境memberFrom、localStorage信息
const BrowserEnv = (browserName) => {
  console.log('browserEnv:' + browserName)

  var memberFrom = '兜礼会员'
  if (browserName === 'Chrome WebView' && localStorage.ownApp === 'other') {
    Vue.prototype.$BrowserName = 'otherAPPAndroid'
    memberFrom = '武钢会员'
  }
  if (browserName === 'WebKit' && localStorage.ownApp === 'other') {
    Vue.prototype.$BrowserName = 'otherAPPIos'
    memberFrom = '武钢会员'
  }

  if (/wiscowechat/.test(window.location.href)) {
    memberFrom = '钢城e家会员'
  }
  // 获取用户信息（安卓）
  if (browserName === 'Chrome WebView' || browserName === 'otherAPPAndroid') {
    localStorage.token = RHNativeJS.getToken()
    localStorage.mobile = RHNativeJS.getPhone()
    localStorage.userId = RHNativeJS.getUserId()
    localStorage.groupShortName = RHNativeJS.getGroupShortName()
    localStorage.address = RHNativeJS.nativeLbsCity()
    localStorage.activateMobile = RHNativeJS.getLoginUserNumber()
    localStorage.authType = RHNativeJS.getAuthType()
    localStorage.ownApp = RHNativeJS.isOwnApp()
    localStorage.userName = RHNativeJS.getUserName()
    // 新增版本号方法
    if (RHNativeJS.getVersionName) {
      localStorage.versionName = RHNativeJS.getVersionName()
    }
    if (RHNativeJS.getPaymentType) {
      localStorage.isPayPassword = RHNativeJS.getPaymentType()
      if (localStorage.isPayPassword === 0) {
        localStorage.isSetPayPassword = 0
      } else {
        localStorage.isSetPayPassword = 1
      }
    }
    if (RHNativeJS.getGroupID) {
      localStorage.groupId = RHNativeJS.getGroupID()
      localStorage.blocId = RHNativeJS.getBlocID()
    }
  }

  const gotoJumpJq = function(url) {
    if (browserName === 'WeChat') {
      window.location.href = url
    } else {
      var jsonObj = {
        jumpType: 'InsideJump',
        jumpUrl: url,
      }
      if (browserName === 'WebKit') {
        // 判断iPhone|iPad|iPod|iOS
        window.webkit.messageHandlers.gotoNativeJump.postMessage(
          JSON.stringify(jsonObj)
        )
      } else if (browserName === 'Chrome WebView') {
        // 判断Android
        RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj))
      } else {
        window.location.href = url
      }
    }
  }

  // 判断是否为微信浏览器
  const isWeiXin = function() {
    var ua = window.navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) === 'micromessenger') {
      return true
    } else {
      return false
    }
  }
  // 判断是否为pc浏览器
  const IsPC = function() {
    var userAgentInfo = navigator.userAgent
    var Agents = [
      'Android',
      'iPhone',
      'SymbianOS',
      'Windows Phone',
      'iPad',
      'iPod',
    ]
    var flag = true
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
  }
  // 微信Url
  const WxAppIdUrls = () => {
    let _weixinUrl =
      'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
    // 微信首页跳转签名url
    let appidText, appidMain, appidDoooly
    let channelText, channelMain, channeltextDoooly, channelDoooly
    if (/wiscowechat/.test(window.location.href)) {
      channelText = encodeURIComponent(
        'https://admin.doooly.com/reachtest/wiscowechat/#/white'
      )
      channelMain = encodeURIComponent(
        'https://admin.doooly.com/reach_dist/wiscowechat/#/white'
      )
      channeltextDoooly = encodeURIComponent(
        'https://reach-life.com/pre_dist/wiscowechat/#/white'
      )
      channelDoooly = encodeURIComponent(
        'https://reach-life.com/pro_dist/wiscowechat/#/white'
      )

      // var appidText = 'wx5c433c925b44ad2e';
      appidText = 'wx58ada8d1e44c4f7b'
      appidMain = 'wx58ada8d1e44c4f7b'
      appidDoooly = 'wx93b36cf949d5fb6c'
    } else if (/zfhwechat/.test(window.location.href)) {
      channelText = encodeURIComponent(
        'https://admin.doooly.com/reachtest/zfhwechat/#/white'
      )
      channelMain = encodeURIComponent(
        'https://admin.doooly.com/reach_dist/zfhwechat/?t=1#/white'
      )
      channeltextDoooly = encodeURIComponent(
        'https://reach-life.com/pre_dist/zfhwechat/#/white'
      )
      channelDoooly = encodeURIComponent(
        'https://reach-life.com/pro_dist/zfhwechat/#/white'
      )

      appidText = 'wx2d328083c1b00c6a'
      appidMain = 'wx2d328083c1b00c6a'
      appidDoooly = 'wx07dc2a87c3d4ec88'
    } else {
      channelText = encodeURIComponent(
        'https://admin.doooly.com/reachtest/dist/#/white'
      )
      channelMain = encodeURIComponent(
        'https://admin.doooly.com/reach_dist/dist/?t=1#/white'
      )
      channeltextDoooly = encodeURIComponent(
        'https://reach-life.com/pre_dist/dist/#/white'
      )
      channelDoooly = encodeURIComponent(
        'https://reach-life.com/pro_dist/dist/#/white'
      )

      appidText = 'wx2d328083c1b00c6a'
      appidMain = 'wx2d328083c1b00c6a'
      appidDoooly = 'wx07dc2a87c3d4ec88'
    }

    return {
      text:
        _weixinUrl +
        appidText +
        '&redirect_uri=' +
        channelText +
        '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect',
      Main:
        _weixinUrl +
        appidMain +
        '&redirect_uri=' +
        channelMain +
        '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect',
      textDoooly:
        _weixinUrl +
        appidDoooly +
        '&redirect_uri=' +
        channeltextDoooly +
        '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect',
      Doooly:
        _weixinUrl +
        appidDoooly +
        '&redirect_uri=' +
        channelDoooly +
        '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect',
    }
  }
  return {
    memberFrom,
    gotoJumpJq,
    isWeiXin,
    IsPC,
    WxAppIdUrls
  }
}

export default BrowserEnv
