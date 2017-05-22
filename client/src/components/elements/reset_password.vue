<template>
    <div>
        <Divider>重置申明</Divider>
        <div class="p-l-10 p-r-10 m-t-20 m-b-20">
            <p class="fz-12">  1、我们将向您邮箱发送一封包含重置密码的特殊链接的电子邮件；</p>
            <p class="fz-12">  2、您点击重置密码链接后，一个特殊的页面会打开，让他们输入新密码；</p>
            <p class="fz-12">  3、用户的密码已被重置为新输入的密码。</p>
        </div>
        <x-button type="primary" @click.native="handleSubmit()" class="h30 rounded-4x m-b-10 m-t-10"
                  style="width: 80%">发送重置邮件
        </x-button>
    </div>
</template>

<script>
  import { XButton, Divider } from 'vux'
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'

  export default {
    components: {
      XButton, Divider,
    },
    data() {
      return {
        data: null,
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
      handleSubmit() {
        this.data = this.currentUser()
        console.log(this.data.email)
        AV.User.requestPasswordReset(this.data.email).then((success) => {
          console.log(success)
          this.showPluginAuto('已经发送，注意查收')
        }, (error) => {
          this.showPluginAuto('err')
          console.log(error)
        })
      },
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
<style scoped>
    .red {
        color: red;
    }

    .green {
        color: green;
    }
</style>
