// https正在用
var httpsbase = {
  dev: {
    webSite: 'http://' + window.location.hostname + ':8080/#/',
    reach: '/reachtest/',
    doooly: '/Doooly/',
    newDoooly: '/activity/'
  },
  reachtest: { // 测试分支
    webSite: 'https://admin.doooly.com/reachtest/dist/#/',
    reach: 'https://admin.doooly.com/reachtest/',
    doooly: 'https://admin.doooly.com/Doooly/',
    newDoooly: 'https://admin.doooly.com/activity/'
  },
  reach_dist: { // 测试主干
    webSite: 'https://admin.doooly.com/reach_dist/dist/#/',
    reach: 'https://admin.doooly.com/reach_api/',
    doooly: 'https://admin.doooly.com/doooly_api/',
    newDoooly: 'https://admin.doooly.com/activity/'
  },
  pre_activity: { // pre
    webSite: 'https://reach-life.com/pre_dist/dist/#/',
    reach: 'https://reach-life.com/pre_api/',
    doooly: 'https://api.doooly.com/pre_doooly/',
    newDoooly: 'https://reach-life.com/pre_activity_api/'
  },
  pro_activity: { // production
    webSite: 'https://reach-life.com/pro_dist/dist/#/',
    reach: 'https://reach-life.com/pro_api/',
    doooly: 'https://api.doooly.com/pro_doooly/',
    newDoooly: 'https://reach-life.com/pro_activity_api/'
  }

}

// let Host = httpsbase[process.env.NODE_ENV]
// console.log('host:' + process.env.NODE_ENV)
// if (!Host) {
//   Host = httpsbase['dev']
// }
// 根据url路径判断接口地址
const envUrl = ['reachtest', 'reach_dist', 'pre_activity', 'pro_activity']
let Host = httpsbase['dev']
if (document.location.protocol === 'https:') {
  envUrl.map((item, index) => {
    if (window.location.href.indexOf(item) > -1) {
      Host = httpsbase[item]
    }
  })
}
console.log(Host)
export default Host
