<template>
  <div id='spell'>
    <div
      v-for="(item,index) in list"
      :key="index"
      class="item"
      @click='getTargetUrl(item)'
    >
      <img
        :src='require("./images/img"+(index+1)+".jpg")'
        alt=""
      >
    </div>
  </div>

</template>
<script>
const url = 'https://douli.xianggou.ren/wap/tmpl/product_detail.html?goods_id='
export default {
  name: 'SpellList',
  data() {
    return {
      list: [url + '7922', url + '6612', url + '7981', url + '7982', url + '7950']
    }
  },
  created() {
    this.$DooolyAPP.initTitle('超划算！开馆首次拼购！')
  },
  methods: {

    getTargetUrl(url) {
      this.$UmengClick("超划算！开馆首次拼购！", "超划算！开馆首次拼购！", "购买跳转", '', '')
      this.$Http.get(this.$Constant.getTargetUrl, {
        businessId: '121',
        targetUrl: url
      }).then((result) => {
        if (result.data.code == 1000) {
          this.$DooolyAPP.externalJump(result.data.resultUrl)
        } else if (result.data.code == 1001) {
          this.$Toast("小兜兜正忙,请稍候重试!")
        }
      })
    }
  }
}
</script>
<style lang="less">
#spell {
  width: 100%;
  height: auto;
  .item {
    height: auto;
    cursor: pointer;
    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }
}
</style>


