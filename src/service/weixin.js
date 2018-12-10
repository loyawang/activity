import Vue from 'vue'
// import Axios from 'axios'
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)
const Wechat = (Vue) => {
  const _this = Vue.prototype
  return {
    getWechatConfig() {
      return new Promise((resolve, reject) => {
        Vue.jsonp(_this.$Constant.commonShareJSONPConfig + '?client=wechat&url=' + encodeURIComponent(window.location.href), {
          callbackName: 'jsonpCallback'
        })
          .then((res) => {
            resolve(res)
          })
          .catch(err => reject(err))
      })
    },
    shareWithFriendsWX(data) {
      console.log(data)
      wx.config({
        debug: false, // 是否开启调试模式
        appId: data.appid, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'onMenuShareQZone',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',
          'translateVoice',
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'playVoice',
          'onVoicePlayEnd',
          'pauseVoice',
          'stopVoice',
          'uploadVoice',
          'downloadVoice',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
          'getNetworkType',
          'openLocation',
          'getLocation',
          'hideOptionMenu',
          'showOptionMenu',
          'closeWindow',
          'scanQRCode',
          'chooseWXPay',
          'openProductSpecificView',
          'addCard',
          'chooseCard',
          'openCard'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

      })
      wx.ready(function () {
        // 微信JS接口: 分享给朋友
        wx.onMenuShareAppMessage({
          title: data.title, // 分享标题
          desc: data.desc, // 分享描述
          link: data.link, // 分享链接
          imgUrl: data.imgUrl, // 分享图标
          success: function () {
            console.log('分享好友成功')
          },
          cancel: function () {
            console.log('取消分享')
          }
        })
        // 微信JS接口: 分享到朋友圈
        wx.onMenuShareTimeline({
          title: data.title, // 分享标题
          link: data.link, // 分享链接
          imgUrl: data.imgUrl, // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
            console.log('分享成功') // 这里加上h5分享代码
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
      })
    },
    shareWithFriendsAPP(data) {
      // if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  // 判断iPhone|iPad|iPod|iOS
      if (browserName === 'WebKit' || browserName === 'otherAPPIos') {
        window.webkit.messageHandlers.share.postMessage(data)
      } else if (browserName === 'Chrome WebView' || browserName === 'otherAPPAndroid') { // 判断Android
        // else if (/(Android)/i.test(navigator.userAgent)) {   // 判断Android
        RHNativeJS.share(JSON.stringify(data))
      }
    }
  }
}
export default Wechat
