/**
 * Created by PetitKero on 27/9/2016.
 */
/**
 * The map for this entire project .
 * @module routes
 */

export default [
  {
    path: '/reset',
    component(resolve) {
      require(['./components/elements/reset.vue'], resolve)
    },
    name: 'reset',
  }, {
    path: '/fans',
    component(resolve) {
      require(['./components/elements/fans.vue'], resolve)
    },
    name: 'fans',
  },
  {
    path: '/follow',
    component(resolve) {
      require(['./components/elements/followee.vue'], resolve)
    },
    name: 'follow',
  },
  {
    path: '/reset_password',
    component(resolve) {
      require(['./components/elements/reset_password.vue'], resolve)
    },
    name: 'reset_password',
  },
  {
    path: '/address_list',
    component(resolve) {
      require(['./components/elements/address_list.vue'], resolve)
    },
    name: 'address_list',
  },
  {
    path: '/user_info',
    component(resolve) {
      require(['./components/elements/user_info.vue'], resolve)
    },
    name: 'user_info',
  },
  {
    path: '/menu_list',
    component(resolve) {
      require(['./components/elements/menu_list.vue'], resolve)
    },
    name: 'menu_list',
  },
  {
    path: '/order_detail/:objectId',
    component(resolve) {
      require(['./components/elements/order_detail.vue'], resolve)
    },
    name: 'order_detail',
  },
  {
    path: '/order_list',
    component(resolve) {
      require(['./components/elements/order_list.vue'], resolve)
    },
    name: 'order_list',
  },
  {
    path: '/shop/:type/:objectId',
    component(resolve) {
      require(['./components/elements/shop.vue'], resolve)
    },
    name: 'shop',
  },
  {
    path: '/goods_detail/:objectId',
    component(resolve) {
      require(['./components/elements/goods_detail.vue'], resolve)
    },
    name: 'goods_detail',
  },
  {
    path: '/shop_mall',
    component(resolve) {
      require(['./components/elements/shop_mall.vue'], resolve)
    },
    name: 'shop_mall',
  },
  {
    path: '/user/:objectId',
    component(resolve) {
      require(['./components/elements/user_center.vue'], resolve)
    },
    name: 'user_center',
  },
  {
    path: '/me',
    component(resolve) {
      require(['./components/elements/user_center.vue'], resolve)
    },
    name: 'me',
  },
  {
    path: '/img_detail/:objectId',
    component(resolve) {
      require(['./components/elements/img_detail.vue'], resolve)
    },
    name: 'img_detail',
  },
  {
    path: '/login',
    component(resolve) {
      require(['./components/elements/login.vue'], resolve)
    },
    name: 'login',
  },
  {
    path: '/regist',
    component(resolve) {
      require(['./components/elements/regist.vue'], resolve)
    },
    name: 'regist',
  },
  {
    path: '/messages',
    component(resolve) {
      require(['./components/elements/messages.vue'], resolve)
    },
    name: 'messages',
  },
  {
    path: '/loader',
    component(resolve) {
      require(['./components/elements/loader.vue'], resolve)
    },
    name: 'loader',
  },
  {
    path: '/navigation',
    component(resolve) {
      require(['./components/common/navigation.vue'], resolve)
    },
    name: 'navigation',
  },
  {
    path: '/bar',
    component(resolve) {
      require(['./components/bar.vue'], resolve)
    },
    name: 'Bar',
  },
  {
    path: '/foo',
    component(resolve) {
      require(['./components/foo.vue'], resolve)
    },
    name: 'Foo',
  },
  {
    path: '/',
    component(resolve) {
      require(['./components/index.vue'], resolve)
    },
    name: 'Index',
  },
  {
    path: '*',
    component(resolve) {
      require(['./components/common/page_error.vue'], resolve)
    },
    name: 'PageError',
  },
]
