/**
 * Created by PetitKero on 27/9/2016.
 */
/**
 * The map for this entire project .
 * @module routes
 */

export default [
  {
    path: '/orders',
    component(resolve) {
      require(['./components/orders/index.vue'], resolve)
    },
    name: 'OrdersIndex',
  },
  {
    path: '/messages',
    component(resolve) {
      require(['./components/messages/index.vue'], resolve)
    },
    name: 'Messages',
  },
  {
    path: '/users',
    component(resolve) {
      require(['./components/users/index.vue'], resolve)
    },
    name: 'UsersIndex',
  },
  {
    path: '/content',
    component(resolve) {
      require(['./components/content/index.vue'], resolve)
    },
    name: 'ContentIndex',
    children: [
      {
        path: 'articles',
        component(resolve) {
          require(['./components/content/articles.vue'], resolve)
        },
        name: 'ContentArticles',
      },
      {
        path: 'comments',
        component(resolve) {
          require(['./components/content/comments.vue'], resolve)
        },
        name: 'ContentComments',
      },
      {
        path: 'products',
        component(resolve) {
          require(['./components/content/products.vue'], resolve)
        },
        name: 'ContentProducts',
      },
    ],
  },
  {
    path: '/login',
    component(resolve) {
      require(['./components/login.vue'], resolve)
    },
    name: 'Login',
  },
  {
    path: '/test',
    component(resolve) {
      require(['./components/index.vue'], resolve)
    },
    name: 'test',
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
