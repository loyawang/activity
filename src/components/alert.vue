<template>
  <div id='alertModal'>
    <div class="modal" @click='closeAlert'>
      <img src="@/assets/images/modal.png" alt="签到成功">
      <p class="point">签到积分&nbsp;&nbsp;+{{point}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AlertModal',
  props: {
    point: 0
  },
  data() {
    return {
    }
  },
  created() {

  },
  methods: {
    closeAlert() {
      this.$emit('changeAlert')
    }
  }
}
</script>
<style lang="less">
#alertModal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  transition: all 3s;
  .modal {
    position: absolute;
    left: 50%;
    top: 20%;
    transform: translateX(-50%);
    width: 2.33rem;
    height: auto;
    img {
      width: 100%;
    }
    .point {
      position: absolute;
      top: 72%;
      left: 0;
      width: 100%;
      height: 0.2rem;
      font-size: 0.14rem;
      color: #fff;
    }
  }
}
</style>
