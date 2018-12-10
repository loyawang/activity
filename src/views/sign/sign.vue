<template>
  <div id="sign">
    <div class="top">
      <div class="large">
        <div class="middle">
          <div class="btn" @click='signHandle'>
            <span v-if='!isSign' class="sign_text">签到</span>
            <img v-if='isSign' class='ok' src="@/assets/images/ok.png" />
          </div>
        </div>
      </div>
      <div class="count">
        <span class="lable">累计签到积分</span>
        <label class="amount">{{signInfo.signIntegralTotal}}</label>
      </div>
      <p class="totalBar">累计签到{{signInfo.signCount}}天</p>
    </div>
    <div class="luckyBar">
      <img class="lucky_img" src="@/assets/images/lucky.png" alt="">
      <div class="nameList record">
        <ul ref="scroll">
          <li v-for="(item,index) in scrollList" :key="index">
            {{item.mobile}}&nbsp;&nbsp;&nbsp;签到获得{{item.signIntegral}}积分
          </li>
        </ul>
      </div>
    </div>
    <div class="signCon">
      <p class="continuous">您已连续签到<span class="day">{{signInfo.continuousCount}}天/{{signInfo.topPriseDay}}天</span></p>
      <ul class="continuousList">
        <li v-for="(item,index) in weekList" :key="index" class="everyDay" :class="{grayColor:item.isSign === 0}">
          <div class="title">{{item.signDate}}</div>
          <div class="content">
            <div class="gray">
              <img v-if='item.isTopPrise ===0' class="jindou_big" src="@/assets/images/jindou_big.png" alt="">
            </div>
            <img v-if='item.isSign === 1 && item.isTopPrise === 1' class="jindou_big" src="@/assets/images/gift.png" alt="大礼包">
            <img v-if='item.isSign === 0 && item.isTopPrise === 2' class="jindou_big" src="@/assets/images/gift_gray.png" alt="灰色大礼包">
            <p v-if='item.isSign === 1 && item.isTopPrise !== 1 ' class="jindou_count">+{{item.signIntegral}}</p>
          </div>
        </li>
        <li class="everyDay" @click="open">
          <div class="content">
            <img class="calendar_big" src="@/assets/images/calendar_big.png" alt="">
            <p class="all">展开全部</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="rule">
      <!-- <router-link to="/rule">签到规则</router-link> -->
      <a @click='goRule'>签到规则</a>
    </div>
    <calandar v-if='isShowModal' v-on:changeStatus='closeModal' v-bind:serviceTime='serviceTime'></calandar>
    <alert-modal v-if="isShowAlert" v-on:changeAlert='closeAlert' :point='signIntegral'></alert-modal>
  </div>
</template>

<script>
let timer = null
import Cookies from 'js-cookie'
import { mapMutations } from 'vuex'
export default {
  name: 'Sign',
  data() {
    return {
      isSign: false,
      isShowModal: false,
      isShowAlert: false,
      signIntegral: 0, // 单次签到金额
      serviceTime: new Date(),
      userId: localStorage.userId || Cookies.get('userId'),
      signInfo: {
        signIntegralTotal: 0,
        signCount: 0
      },
      weekList: [{
        isSign: 0, // 0未签到，1已签到
        signDate: '',
        isTopPrise: '', //  0 不是大礼包 1是大礼包（isSign是1的时候才会有大礼包） 2可能是大礼包（未签到情况）
        signIntegral: 0 // 签到金额
      }, {
        isSign: 0,
        signDate: '',
        isTopPrise: '',
        signIntegral: 0
      }, {
        isSign: 0,
        signDate: '',
        isTopPrise: '',
        signIntegral: 0
      }, {
        isSign: 0,
        signDate: '',
        isTopPrise: '',
        signIntegral: 0
      }, {
        isSign: 0,
        signDate: '',
        isTopPrise: '',
        signIntegral: 0
      }, {
        isSign: 0,
        signDate: '',
        isTopPrise: '',
        signIntegral: 0
      }, {
        isSign: 0,
        signDate: '',
        isTopPrise: '',
        signIntegral: 0
      }],
      scrollList: []
    }
  },
  created() {
    this.$DooolyAPP.initTitle('每日签到')
    this.getWeek()
    this.getMoth()
    this.add()
    console.log(this.$store.state.count)
  },
  mounted() {
    this.scroll()
  },
  methods: {
    ...mapMutations({
      add: 'increament' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    }),
    goRule() {
      this.$DooolyAPP.internalJump.call(this, '/rule')
    },
    open() {
      this.$UmengClick("每日签到", "签到", "展开全部", '', '')
      this.$data.isShowModal = true
    },
    closeModal() {
      this.$data.isShowModal = false
    },
    closeAlert() {
      this.$data.isShowAlert = false
    },
    signHandle() {
      if (this.$data.isSign) return
      this.$UmengClick("每日签到", "签到", "签到按钮", '', '')
      this.$Http.post(this.$Constant.clickAttend, {
        userId: this.$data.userId
      }).then((res) => {
        const data = res.data.data
        if (res.data.code === 1000) { // 签到成功
          this.$data.isShowAlert = true
          this.$data.isSign = true
          this.$data.signIntegral = data.signIntegral
        } else if (res.data.code === 1001) {
          this.$data.isSign = true
          this.$Toast(res.data.info)
        }
        // 签到完刷新一下周数据
        this.getWeek()
      })
    },
    getWeek() {
      this.$Http.post(this.$Constant.findWeekList, {
        userId: this.$data.userId
      }).then((res) => {
        const data = res.data.data
        const serviceTime = new Date(res.headers.date) // 获取服务器时间
        this.$data.serviceTime = serviceTime
        if (res.data.code === 1000 && data.adAttendanceRecord) { // 获取签到信息成功，签到日期和当天服务器日期做比较，判断今天是否签到过
          if (new Date(this.formatDate(data.adAttendanceRecord.signDate)).getTime() >= new Date(this.formatDate(serviceTime)).getTime()) {
            this.$data.isSign = true
          }
          // let signIntegralTotal = data.adAttendanceRecord.signIntegralTotal // 累计签到积分
          // let topPriseDay = data.adAttendanceRecord.topPriseDay // 7天
          // let continuousCount = data.adAttendanceRecord.continuousCount // 连续签到次数
          // let signCount = data.adAttendanceRecord.signCount // 累计签到次数
          // let firstDate = data.adAttendanceRecord.firstDate // 连续第一次签到日期
          // let isTopPrise = data.adAttendanceRecord.isTopPrise
          let { signIntegralTotal, topPriseDay, continuousCount, signCount, firstDate, isTopPrise } = data.adAttendanceRecord
          let adAttendanceRecordList = data.adAttendanceRecordList // 本周已签到的数据
          const signDate = data.adAttendanceRecord.signDate

          // 可能会出现大礼包的日期（灰色的）
          let firstDay = 0, expectedGiftDate = ''
          if (isTopPrise === 1) { // 当天是大礼包，要把firstDate设置为大礼包日期
            firstDay = new Date(signDate).getDate()
            expectedGiftDate = new Date(signDate).setDate(firstDay + 7)
          } else {
            firstDay = new Date(firstDate).getDate()
            expectedGiftDate = new Date(firstDate).setDate(firstDay + 6)
          }

          this.$data.signInfo = { signIntegralTotal, topPriseDay, continuousCount, signCount }
          this.initCurrentWeek(serviceTime, adAttendanceRecordList, firstDate, expectedGiftDate)
        }
      })
    },
    getMoth() {
      let data = {}
      this.$Http.post(this.$Constant.findlist, data).then((res) => {
        let data = res.data.data
        this.$data.scrollList = data.adAttendanceRecordList
        if (this.$data.scrollList.length < 2) { // 只有一条数据，清楚定时器
          clearInterval(timer)
        }
      })
    },
    initCurrentWeek(serviceTime, adAttendanceRecordList, firstDate, expectedGiftDate) {

      // 根据服务器时间计算本周日期
      let currentTime = new Date(serviceTime)
      let currentWeek = currentTime.getDay() // 获取当前周几（星期）
      let currentDay = currentTime.getDate()   // 获取当前日（天）
      let weekList = []
      // 本周当前日期前几天（包含当天）
      for (let i = currentWeek;i >= 0;i--) {
        let currentTime = new Date(serviceTime)
        let newDay = currentDay - i
        let date = new Date(currentTime.setDate(newDay))
        weekList.push({ isSign: 0, signDate: date, isTopPrise: 0, signIntegral: 0 })
      }
      // 本周当前日期后几天
      for (let i = currentWeek + 1;i <= 6;i++) {
        let currentTime = new Date(serviceTime)
        let newDay = currentDay + (i - currentWeek)
        let date = new Date(currentTime.setDate(newDay))
        weekList.push({ isSign: 0, signDate: date, isTopPrise: 0, signIntegral: 0 })
      }
      this.getServiceWeek(adAttendanceRecordList, weekList, expectedGiftDate)
    },
    getServiceWeek(adAttendanceRecordList, weekList, expectedGiftDate) {
      // isSign: 0, // 0未签到，1已签到
      // signDate: '',
      // isTopPrise: '', //  0 不是大礼包 1是大礼包（isSign是1的时候才会有大礼包） 2可能是大礼包（未签到情况）
      // signIntegral: 0 // 签到金额

      // 是大礼包并且是期望大礼包的那天
      let obj = null
      // alert('5' + adAttendanceRecordList.find)
      // if (adAttendanceRecordList.length > 0) {
      //   obj = adAttendanceRecordList.find((obj) => {
      //     return obj.isTopPrise === 1 && obj.signDate === this.formatDate(expectedGiftDate)
      //   })
      // }
      if (adAttendanceRecordList.length > 0) {
        adAttendanceRecordList.map((item, index) => {
          if (item.isTopPrise === 1 && item.signDate === this.formatDate(expectedGiftDate)) {
            obj = item
          }
        })
      }
      // 本地周数据与服务端返回数据做匹配
      for (let j = 0;j < weekList.length;j++) {
        let localDate = new Date(this.formatDate(weekList[j].signDate)).getTime()
        if (adAttendanceRecordList.length > 0) {
          for (let x = 0;x < adAttendanceRecordList.length;x++) {
            let serveSignDate = new Date(this.formatDate(adAttendanceRecordList[x].signDate)).getTime()
            // 比较时间都转化为年月日（不含时分秒），再获取时间戳判断
            // 和后台数据对比，有日期的话，则表示已签到
            if (localDate === serveSignDate) {
              weekList[j].isSign = 1
              weekList[j].isTopPrise = adAttendanceRecordList[x].isTopPrise
              weekList[j].signIntegral = adAttendanceRecordList[x].signIntegral
            }
            else { // 未签到可能会出现大礼包的情况
              if (localDate === new Date(this.formatDate(expectedGiftDate)).getTime() && !obj) {
                weekList[j].isTopPrise = 2
              }
            }
          }
        } else { // 未签到可能会出现大礼包的情况
          if (localDate === new Date(this.formatDate(expectedGiftDate)).getTime() && !obj) {
            weekList[j].isTopPrise = 2
          }
        }
        weekList[j].signDate = this.formatDate(localDate, true)
      }
      this.$data.weekList = weekList
    },
    // 返回 类似 2018-11-08 格式的字符串，第二个参数为true,则返回11.08
    formatDate: function (str, isPoint) {
      let date = new Date(str)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      if (m < 10) m = '0' + m
      let d = date.getDate()
      if (d < 10) d = '0' + d
      if (isPoint) return m + '.' + d
      return y + '-' + m + '-' + d
    },
    scroll() {
      const scroll = this.$refs['scroll']
      let distance = 0 // 0.18rem == 18px 110ms 1像素 18px 2s
      timer = setInterval(() => {
        if (-distance > scroll.clientHeight - 18) {
          distance = 0
          scroll.style.transform = 'translateY(0)'
        }
        distance -= 1
        scroll.style.transform = 'translateY(' + distance / 100 + 'rem)'
        // console.log(scroll.clientHeight)
      }, 120)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
@mainColor: #ee3f44;
@grayColor: #ccc;
#sign {
  width: 100%;
  min-height: 100%;
  background-color: #f5f5f5;
  font-size: 0.12rem;
  .jindou_small {
    width: 0.16rem;
    height: 0.16rem;
    margin: 0.06rem 0.1rem 0 0.06rem;
  }
  .top {
    width: 100%;
    height: auto;
    padding-top: 0.3rem;
    background: url('../../assets/images/bg.png') no-repeat center 0.98rem;
    background-color: #fff;
    background-size: 100% auto;
    .large {
      margin: 0 auto;
      margin-bottom: 0.15rem;
      width: 1.5rem;
      height: 1.5rem;
      border: 0.15rem solid rgba(238, 63, 68, 0.1);
      border-radius: 50%;
      .middle {
        width: 1.2rem;
        height: 1.2rem;
        border: 0.12rem solid @mainColor;
        border-radius: 50%;
      }
      .btn {
        position: relative;
        width: 0.96rem;
        height: 0.96rem;
        border-radius: 50%;
        background: #fff;
        text-align: center;
        & > * {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .sign_text {
          font-size: 0.2rem;
          color: @mainColor;
        }
        .ok {
          width: 0.36rem;
          height: 0.26rem;
        }
      }
    }
    .count {
      display: inline-block;
      width: auto;
      padding: 0 0.18rem;
      height: 0.28rem;
      line-height: 0.28rem;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 0.3rem;
      color: #333333;
      text-align: center;
      .lable {
        display: inline-block;
        font-size: 0.12rem;
      }
      .amount {
        position: relative;
        padding-left: 0.25rem;
        font-size: 0.12rem;
        color: @mainColor;
        display: inline-block;
        vertical-align: middle;
        img {
          display: inline-block;
          width: 0.16rem;
          height: 0.16rem;
          vertical-align: middle;
        }
      }
      .amount:before {
        content: '';
        position: absolute;
        line-height: 0.28rem;
        left: 0.05rem;
        top: 50%;
        transform: translateY(-50%);
        width: 0.16rem;
        height: 0.16rem;
        background: url('../../assets/images/jindou_samll.png') no-repeat;
        background-size: 0.15rem;
      }
    }
    .totalBar {
      padding: 0.06rem 0 0.13rem;
      text-align: center;
      color: #999;
      font-size: 0.1rem;
    }
  }
  .luckyBar {
    margin: 0.1rem auto;
    position: relative;
    width: 100%;
    height: 0.4rem;
    padding: 0 0.15rem;
    background-color: #fff;
    text-align: left;
    .lucky_img {
      width: 0.56rem;
      height: auto;
      display: inline-block;
      padding-top: 0.13rem;
    }

    .nameList {
      position: absolute;
      left: 0.92rem;
      top: 50%;
      transform: translateY(-50%);
      height: 0.4rem;
      line-height: 0.4rem;
      overflow: hidden;
      &.record {
        height: 0.18rem;
        ul {
          transition: all 0s;
        }
      }
      &::before {
        content: '';
        position: absolute;
        left: -0.1rem;
        top: 0.13rem;
        height: 0.12rem;
        border-left: 1px solid #ccc;
        color: #333333;
      }
      .marquee {
        vertical-align: middle;
      }
      ul {
        width: 100%;
        height: auto;
      }
      li {
        font-size: 0.12rem;
        color: #666666;
        height: 0.18rem;
        line-height: normal;
      }
    }
  }
  .signCon {
    width: 100%;
    height: 2.3rem;
    padding: 0.15rem 4%;
    background-color: #fff;
    .continuous {
      position: relative;
      // height: 0.17rem;
      padding-left: 0.2rem;
      padding-bottom: 0.13rem;
      text-align: left;
      font-size: 0.12rem;
      color: #666666;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 0.14rem;
        height: 0.14rem;
        background: url('../../assets/images/calendar_small.png') no-repeat;
        background-size: 0.13rem;
      }
      .day {
        color: @mainColor;
        font-size: 0.12rem;
      }
    }
    .continuousList {
      overflow: hidden;
      min-height: 1.84rem;
      .everyDay {
        float: left;
        width: 20vw;
        height: 20vw;
        margin-right: 3.6vw;
        margin-bottom: 0.17rem;
        border: 1px solid @mainColor;
        border-radius: 0.08rem;
        &:nth-child(4n) {
          margin-right: 0;
        }
        &.grayColor {
          border-color: @grayColor;
          .title {
            background-color: @grayColor;
          }
          .content {
            .gray {
              filter: grayscale(100%);
            }
            .jindou_big {
              filter: grayscale(100%);
            }
            .jindou_count {
              color: @grayColor;
            }
          }
        }
        .title {
          width: 100%;
          height: 0.2rem;
          line-height: 0.2rem;
          border-top-left-radius: 0.06rem;
          border-top-right-radius: 0.06rem;
          background-color: @mainColor;
          color: #fff;
          font-size: 0.12rem;
        }
        .content {
          .jindou_big {
            width: 0.24rem;
            height: auto;
            margin: 0.1rem auto 0;
          }
          .jindou_count {
            font-size: 0.1rem;
            color: @mainColor;
          }
          .calendar_big {
            width: 0.2rem;
            height: 0.2rem;
            margin: 0.2rem auto 0.04rem;
          }
          .all {
            font-size: 0.12rem;
            color: @mainColor;
          }
        }
      }
    }
  }
  .rule {
    padding: 0.22rem 0;
    a {
      font-size: 0.14rem;
      color: @mainColor;
    }
  }
}
</style>
