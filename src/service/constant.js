import Host from '@/service/hosts'

export default { // Host.doooly +
  webSite: Host.webSite,
  clickAttend: Host.newDoooly + 'activity/adAttendance/clickAttend',
  findWeekList: Host.newDoooly + 'activity/adAttendance/findWeekList',
  findlist: Host.newDoooly + 'activity/adAttendance/findlist',
  commonShareJSONPConfig: Host.doooly + 'jersey/share/commonShareJSONPConfig',
  getTargetUrl: Host.reach + 'wechat/oneNumber/getTargetUrl.jhtml',
  errorLog: Host.doooly + 'jersey/app/error-log/save/v1' // 捕获错误信息接口
}
