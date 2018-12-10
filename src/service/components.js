import Vue from 'vue'
import {
  Button,
  Cell,
  Swipe,
  SwipeItem,
  Indicator,
  Toast
} from 'mint-ui' // 按需加载，配置.babelrc
import Calandar from '@/components/calandar'
import AlertModal from '@/components/alert'

Vue.component('calandar', Calandar)
Vue.component('alert-modal', AlertModal)

Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.prototype.$Indicator = Indicator
Vue.prototype.$Toast = Toast
