<template>
    <group>
        <cell title="订单管理" link="/order_list" ></cell>
        <cell title="个人资料"  link="/user_info" ></cell>
        <cell title="收货地址管理"  link="/address_list"  ></cell>
        <cell title="重置密码"  link="/reset_password" ></cell>
        <cell title="投诉建议"  link="/messages" ></cell>
        <cell title="退出登录" @click.native="handleLogOut()" is-link></cell>
    </group>
</template>
<script type="text/babel">
  import { Cell, Group } from 'vux'
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'

  export default {
    components: {
      Group,
      Cell,
    },
    data() {
      return {
      }
    },
    methods: {
      showPlugin(string) {
        this.$vux.alert.show({
          title: string,
        })
      },
      showPluginAuto(string) {
        this.showPlugin(string)
        setTimeout(() => {
          this.$vux.alert.hide()
        }, 2000)
      },
      handleLogOut() {
        this.logOut()
        this.showPluginAuto('已退出')
        this.$router.push('/')
        this.$store.dispatch('currentUserInfo', null)
      },
    },
    computed: {
      currentUserInfo() {
        const user = this.currentUser()
        if (user) {
          return user.toJSON()
        }
        return this.$store.getters.currentUserInfo || null
      },
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
