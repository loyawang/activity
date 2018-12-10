<template>
  <div id='calandar'>
    <div class="modal">
      <div class="calandar_container">
        <img class="close" src="@/assets/images/close.png" alt="关闭" @click="closeModal">
        <div class="head">
          <p class="date">
            <span class="arrow">
              <span class="left" :class="{gray: notClickLeft}" @click="pickPre(currentYear,currentMonth)"></span>
              <img class="cal_icon" src="@/assets/images/calendar_icon.png" />
            </span>
            <span class="time">{{currentYear}}年{{currentMonth}}月</span>
            <span class="arrow">
              <span class="left right" @click="pickNext(currentYear,currentMonth)"></span>
              <img class="cal_icon icon_right" src="@/assets/images/calendar_icon.png" />
            </span>
          </p>
        </div>
        <div class="content">
          <ul class="week_ul">
            <li v-for="(week,index) in weekList" :key='index'>{{week}}</li>
          </ul>
          <ul class="day_ul">
            <li v-for="(item,index) in days" :key="index">
              <!-- 未签到的，不是当前月的显示为灰色，三种情况 -->
              <label v-if='item.isSign ===0' v-bind:class="{'other-month':item.signDate.getMonth()+1 !== currentMonth}">
                <img v-if="item.isTopPrise ===2" class="jindou_big grayColor" src="@/assets/images/gift.png" alt="灰色大礼包">
                <!-- <span v-if="item.signDate.getFullYear() == new Date(serviceTime).getFullYear() && item.signDate.getMonth() == new Date(serviceTime).getMonth() && item.signDate.getDate() == new Date(serviceTime).getDate()" class="active">{{ item.signDate.getDate() }}</span> -->
                <span v-if="item.isTopPrise ===0" :class="{'active':item.signDate.getFullYear() == new Date(serviceTime).getFullYear() && item.signDate.getMonth() == new Date(serviceTime).getMonth() && item.signDate.getDate() == new Date(serviceTime).getDate()}"><span class="date">{{ item.signDate.getDate() }}</span></span>
              </label>
              <!-- 已签到的，两种情况 -->
              <label v-if='item.isSign ===1'>
                <img v-if="item.isTopPrise ===1" class="jindou_big" src="@/assets/images/gift.png" alt="大礼包">
                <!-- <img v-if='item.isTopPrise ===0 ' class="jindou_big" src="@/assets/images/jindou_big.png" alt="金豆"> -->
                <span v-if='item.isTopPrise ===0 ' :class="{'active':item.signDate.getFullYear() == new Date(serviceTime).getFullYear() && item.signDate.getMonth() == new Date(serviceTime).getMonth() && item.signDate.getDate() == new Date(serviceTime).getDate()}"><span class="date">{{ item.signDate.getDate() }}</span></span>
              </label>
              <img v-if='item.isSign === 1' class='confirmed' src="@/assets/images/confirm.png" alt="">
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  name: 'Calandar',
  props: {
    serviceTime: {
      type: Date,
      required: true
    }
  },
  data() {
    return {
      userId: localStorage.userId || Cookies.get('userId'),
      notClickLeft: false,
      notClickRight: true,
      weekList: ['日', '一', '二', '三', '四', '五', '六'],
      currentDay: 1,
      currentMonth: 1,
      currentYear: 1970,
      currentWeek: 1,
      days: []
    }
  },
  created() { // 在vue初始化时调用
    console.log(this.serviceTime)
    this.initData(null, this.serviceTime)
  },
  methods: {
    initData(cur, serviceTime, recordList) {
      var date
      if (cur) {
        date = new Date(cur)
      } else {
        var now = new Date(serviceTime)
        // var d = new Date(this.formatDate(now.getFullYear(), now.getMonth(), 1))
        // d.setDate(35)
        date = new Date(this.formatDate(now.getFullYear(), now.getMonth() + 1, 1))
      }
      this.$data.currentDay = date.getDate()
      this.$data.currentYear = date.getFullYear()
      this.$data.currentMonth = date.getMonth() + 1

      this.$data.currentWeek = date.getDay() + 1 // 1...6,0
      if (this.$data.currentWeek === 0) {
        this.$data.currentWeek = 1
      }
      var str = this.formatDate(this.$data.currentYear, this.$data.currentMonth, this.$data.currentDay)
      this.days.length = 0
      let daysList = []
      // 今天是周日，放在第一行第7个位置，前面6个
      // 初始化本周
      for (let i = this.$data.currentWeek - 1;i >= 0;i--) {
        let d = new Date(str)
        d.setDate(d.getDate() - i)
        let dayobject = { isSign: 0, signDate: d, isTopPrise: 0, signIntegral: 0 } // 用一个对象包装Date对象  以便为以后预定功能添加属性
        // dayobject.signDate = d
        daysList.push(dayobject) // 将日期放入data 中的days数组 供页面渲染使用
      }
      // 其他周
      const computedDay = this.judgeDay(daysList) // 此处daysList只有本周的数据
      for (let i = 1;i <= computedDay - this.$data.currentWeek;i++) {
        let d = new Date(str)
        d.setDate(d.getDate() + i)
        let dayobject = { isSign: 0, signDate: d, isTopPrise: 0, signIntegral: 0 }
        daysList.push(dayobject)
      }
      this.getServiceWeek(daysList)
    },
    async getServiceWeek(daysList) {
      let length = daysList.length
      let startDate = this.formatStrDate(daysList[0].signDate) // 传入后台的开始日期
      let endDate = this.formatStrDate(daysList[length - 1].signDate)// 传入后台的结束日期

      const serviceData = await this.getMoth(startDate, endDate) // 调用接口
      let adAttendanceRecord
      if (!serviceData.data.data.adAttendanceRecord) return // record没数据不向下执行
      adAttendanceRecord = serviceData.data.data.adAttendanceRecord
      const isTopPrise = adAttendanceRecord.isTopPrise
      const signDate = adAttendanceRecord.signDate
      let firstDate = adAttendanceRecord.firstDate

      const adAttendanceRecordList = serviceData.data.data.adAttendanceRecordList

      // 可能会出现大礼包的日期（灰色的）
      let firstDay = 0, expectedGiftDate = ''
      if (isTopPrise === 1) { // 当天是大礼包，要把firstDate设置为大礼包日期
        firstDay = new Date(signDate).getDate()
        expectedGiftDate = new Date(signDate).setDate(firstDay + 7)
      } else {
        firstDay = new Date(firstDate).getDate()
        expectedGiftDate = new Date(firstDate).setDate(firstDay + 6)
      }

      // 是大礼包并且是期望大礼包的那天
      let obj = null
      // if (adAttendanceRecordList.length > 0) {
      //   obj = adAttendanceRecordList.find((obj) => {
      //     return obj.isTopPrise === 1 && obj.signDate === this.formatStrDate(expectedGiftDate)
      //   })
      // }
      if (adAttendanceRecordList.length > 0) {
        adAttendanceRecordList.map((item, index) => {
          if (item.isTopPrise === 1 && item.signDate === this.formatDate(expectedGiftDate)) {
            obj = item
          }
        })
      }

      // 根据服务器获取的list和本地数据做匹配
      for (let j = 0;j < daysList.length;j++) {
        let localDate = new Date(this.formatStrDate(daysList[j].signDate)).getTime()
        if (adAttendanceRecordList.length > 0) {
          for (let x = 0;x < adAttendanceRecordList.length;x++) {
            let serveSignDate = new Date(this.formatStrDate(adAttendanceRecordList[x].signDate)).getTime()
            // 比较时间都转化为年月日（不含时分秒），再获取时间戳判断
            // 和后台数据对比，有日期的话，则表示已签到
            if (localDate === serveSignDate) {
              daysList[j].isSign = 1
              daysList[j].isTopPrise = adAttendanceRecordList[x].isTopPrise
              daysList[j].signIntegral = adAttendanceRecordList[x].signIntegral
            } else { // 未签到可能会出现大礼包的情况(有签到数据的情况)
              if (localDate === new Date(this.formatStrDate(expectedGiftDate)).getTime() && !obj) {
                daysList[j].isTopPrise = 2
              }
            }
          }
        } else { // 未签到可能会出现大礼包的情况（无签到数据的情况）
          if (localDate === new Date(this.formatStrDate(expectedGiftDate)).getTime() && !obj) {
            daysList[j].isTopPrise = 2
          }
        }
        daysList[j].signDate = new Date(localDate)
      }
      this.$data.days = daysList
    },
    getMoth(startDate, endDate) {
      const userId = this.$data.userId
      let data = {
        userId,
        startDate,
        endDate
      }
      return this.$Http.post(this.$Constant.findlist, data)
    },
    pickPre: function (year, month) {
      // setDate(0); 上月最后一天
      // setDate(-1); 上月倒数第二天
      // setDate(dx) 参数dx为 上月最后一天的前后dx天
      this.$UmengClick("每日签到", "月日历", "上个月", '', '')
      let d = new Date(this.formatDate(year, month, 1))
      this.$data.notClickRight = false // 只要向左边点了之后，右边就可以点击了
      d.setDate(0) // 上个月
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
    },
    pickNext: function (year, month) {
      this.$UmengClick("每日签到", "月日历", "下个月", '', '')
      let d = new Date(this.formatDate(year, month, 1))
      let dateCur = new Date(this.serviceTime)
      let yearCur = dateCur.getFullYear()
      let monthCur = dateCur.getMonth() + 1
      if (yearCur === year && month >= monthCur) {
        this.$data.notClickRight = true
        return false
      }
      d.setDate(35) // 下个月
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
    },

    // 返回 类似 2016-01-02 格式的字符串
    formatDate: function (year, month, day) {
      var y = year
      var m = month
      if (m < 10) m = '0' + m
      var d = day
      if (d < 10) d = '0' + d
      return y + '-' + m + '-' + d
    },
    // 返回 类似 2018-11-08 格式的字符串，第二个参数为true,则返回11.08
    formatStrDate: function (str, isPoint) {
      let date = new Date(str)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      if (m < 10) m = '0' + m
      let d = date.getDate()
      if (d < 10) d = '0' + d
      if (isPoint) return m + '.' + d
      return y + '-' + m + '-' + d
    },
    judgeDay(daysList) {
      // 判断显示35天还是42天
      const nextMonthDate = new Date(this.formatDate(this.$data.currentYear, this.$data.currentMonth + 1, 1))
      const curLastDate = nextMonthDate.setDate(0)// 获取当前月最后一天的天（先拿到下个月再往前推一天）
      const curLastDay = new Date(curLastDate).getDate() // 例如11月30天，这个值为30
      let computedDay = 42
      if (daysList.length - 1 + curLastDay <= 35) {
        computedDay = 35
      }
      return computedDay
    },
    closeModal() {
      this.$emit('changeStatus')
    }
  }
}
</script>
<style lang="less">
#calandar {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .modal {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .calandar_container {
    position: absolute;
    left: 4%;
    top: 15%;
    width: 92%;
    min-height: 4rem;
    height: auto;
    background-color: #fff;
    border-radius: 8px;
    .close {
      position: absolute;
      right: 0.18rem;
      top: -0.36rem;
      width: 0.26rem;
      height: 0.36rem;
    }
    .head {
      height: 0.9rem;
      background: #ee3f44;
      border-radius: 8px 8px 0 0;
      .date {
        padding: 0.33rem 0;
        margin: 0 auto;
        font-size: 0.22rem;
        color: #ffffff;
        .arrow {
          display: inline-block;
          position: relative;
          width: 20%;
          height: 100%;
          .cal_icon {
            position: absolute;
            left: 50%;
            bottom: -0.46rem;
            height: 0.27rem;
            transform: translateX(-50%);
            &.icon_right {
              left: 70%;
            }
          }
        }
        .time {
          display: inline-block;
          width: 46%;
        }
        .left {
          display: inline-block;
          width: 0.18rem;
          height: 0.18rem;
          // margin-right: 0.3rem;
          border-left: 2px solid #ffffff;
          border-bottom: 2px solid #ffffff;
          transform: rotate(45deg);
          transform-origin: 50% 50%;
          &.gray {
            border-color: #7d7676;
          }
        }

        .right {
          // margin-right: 0;
          // margin-left: 0.3rem;
          transform: rotate(-135deg);
        }
      }
    }
    .content {
      // height: 3rem;
      height: auto;
      padding: 0.27rem 0.23rem 0;
      .week_ul {
        display: flex;
        li {
          flex: 1;
          color: #999;
          font-size: 0.16rem;
        }
      }
      .day_ul {
        display: flex;
        flex-wrap: wrap;
        padding-top: 0.23rem;
        li {
          position: relative;
          align-items: center;
          width: 14.285%;
          height: 0.45rem;
          font-size: 0.16rem;
          color: #999999;
          label {
            position: relative;
            display: inline-block;
            width: 100%;
            height: 0.24rem;
            line-height: 0.24rem;
          }
          .other-month {
            color: #dcdcdc;
          }
          .active {
            position: relative;
            top: -0.01rem;
            display: inline-block;
            width: 0.24rem;
            height: 0.24rem;
            background: #ee3f44;
            color: #fff;
            border-radius: 50%;
            line-height: 0.24rem;
            text-align: center;
            .date {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate3d(-50%, -50%, 0);
              line-height: normal;
            }
          }
          .confirmed {
            position: absolute;
            top: 0.26rem;
            left: 50%;
            transform: translateX(-50%);
            width: 0.1rem;
            height: 0.1rem;
          }
          .jindou_big {
            width: 0.2rem;
            height: 0.2rem;
            &.grayColor {
              filter: grayscale(100%);
            }
          }
        }
      }
    }
  }
}
</style>
