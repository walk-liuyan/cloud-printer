<template>
  <div class="page_header bg-white box_shadow">
    <div class="container">
      <Row>
        <Col span="4" class="p-t-15 p-b-15">
          <router-link to="/"><img src="http://img.hidoge.cn/logo/logo-300x300.jpg" alt="" height="45px"></router-link>
        </Col>
        <Col span="20">
          <Menu mode="horizontal" theme="light" active-name="1" class="r">
            <Menu-item name="1" @click.native="goToLink('/content/articles')">
              <Icon type="ios-paper"></Icon>
              内容管理
            </Menu-item>
            <Menu-item name="2" @click.native="goToLink('/users')">
              <Icon type="ios-people"></Icon>
              用户管理
            </Menu-item>
            <Menu-item name="3" @click.native="goToLink('/orders')">
              <Icon type="settings"></Icon>
              订单管理
            </Menu-item>
            <Menu-item name="4" @click.native="goToLink('/messages')">
              <Icon type="settings"></Icon>
              反馈意见
            </Menu-item>
            <Submenu name="5" v-if="currentUserInfo && currentUserInfo.username">
              <template slot="title">
                <Icon type="person"></Icon>
                <span>
                  {{currentUserInfo.username}}
                </span>
              </template>
              <Menu-item name="3-1" @click.native="handleLogOut">退出登录</Menu-item>
            </Submenu>
            <Menu-item name="6" @click.native="goToLink('/login')" v-else>
              <Icon type="person"></Icon>
              请先登录
            </Menu-item>
          </Menu>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script type="text/babel">
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'

  export default{
    methods: {
      handleLogOut() {
        this.logOut()
        this.$store.dispatch('currentUserInfo', null).then(() => {
          this.$router.push('/login')
        })
      },
    },
    computed: {
      currentUserInfo() {
        const currentUser = AV.User.current()
        if (!currentUser) {
          return this.$store.getters.currentUserInfo || null
        }
        return currentUser.toJSON()
      },
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
