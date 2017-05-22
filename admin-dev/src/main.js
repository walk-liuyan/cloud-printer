/**
 * @file Make this project worked .
 * @author Dino Chiu <bigboss@hidoge.cn>
 * @requires Vue
 * @requires VueRouter
 * @requires Moment
 * @requires ./vuex/store
 * @requires vuex-router-sync.sync
 * @requires ./routes
 * @requires ./App.vue
 */
import axios from 'axios'
import AV from 'leancloud-storage/dist/av-min'
import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
import Moment from 'moment'
import { sync } from 'vuex-router-sync'
import 'vue2-animate/src/vue2-animate.less'
import store from './vuex/store'
import './assets/less/custom-theme.less'
import './assets/sass/screen.scss'
import routes from './routes'
import App from './App.vue'

const _ = require('lodash')

Moment.locale('zh-CN')

AV.init({
  appId: globalArg.APP_ID,
  appKey: globalArg.APP_KEY,
})

_.assign(window, {
  Vue,
  store,
  Moment,
  axios,
  AV,
})
Vue.use(VueRouter)
Vue.use(iView)

axios.defaults.baseURL = 'https://api.github.com'
// axios.defaults.baseURL = globalArg.apiUrl
// axios.defaults.headers.common['authorization'] = window.userToken || ''
const router = new VueRouter({
  routes,
})
sync(store, router)

Vue.config.devtools = true

new Vue({
  store,
  router,
  render: (h) => { return h(App) },
}).$mount('App')
