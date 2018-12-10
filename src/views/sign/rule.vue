<template>
  <div id='rule'>
    <p>1、参与签到活动可获得一定数量的积分奖励；若连续签到满7天，第7天将获得大奖！</p>
    <p>2、同一用户每日仅可参与一次，不可重复参加。</p>
    <p>3、连续签到规则：连续签到日期不可中断。若日期中断，连续签到的天数会从1天开始重新计算；用户获得连续签到大奖后，连续签到天数会重新计算，并在连续签到满7天时再次获得连签大奖。</p>
    <p>例如：您从6月1日开始每日连续签到，您将在6月7日获得连续签到大奖；6月8日，您的连续签到天数从1天开始重新累计；6月14日，您可再次获得连签7天的积分大奖。</p>
    <p>4、签到活动一经发现通过违规手段套取奖励，将取消获取资格及当期累积的奖励。</p>
    <p>5、本活动最终解释权归兜礼所有。</p>
  </div>
</template>
<script>
export default {
  name: 'Rule',
  data() {
    return {}
  },
  created() {
    this.$DooolyAPP.initTitle('签到规则')
    console.log(this.$store.state.count)
  }
}
</script>
<style lang="less">
#rule {
  padding: 0.15rem;
  font-size: 0.14rem;
  color: #333;
  text-align: left;
  p {
    padding-bottom: 0.18rem;
    line-height: 0.2rem;
  }
}
</style>
