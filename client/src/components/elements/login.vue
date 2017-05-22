<template>
    <div>
        <form>
            <group>
                <x-input title="用户名" v-model="loginInputs.username" name="username" placeholder="请输入用户名"></x-input>
            </group>
            <group>
                <x-input title="密码" v-model="loginInputs.password" type="password" placeholder="请输入密码"></x-input>
            </group>
        </form>
        <router-link to="/reset">
            <div class="w-80 tr c-g9 fz-12">忘记密码</div>
        </router-link>
        <flexbox>
            <flexbox-item>
                <x-button type="primary" @click.native="goToLink('/regist')" class="h30 rounded-4x m-b-10 m-t-10"
                          style="width: 80%">去注册
                </x-button>
            </flexbox-item>
            <flexbox-item>
                <x-button type="primary" @click.native="handleSubmit()" class="h30 rounded-4x m-b-10 m-t-10"
                          style="width: 80%">登录
                </x-button>
            </flexbox-item>
        </flexbox>

    </div>
</template>

<script>
  import { XInput, Group, XButton, Flexbox, FlexboxItem } from 'vux'
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'

  export default {
    components: {
      XInput,
      XButton,
      Group,
      Flexbox,
      FlexboxItem,
    },
    data() {
      return {
        loginInputs: {
          username: null,
          password: null,
        },
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
        if (this.loginInputs.username !== '' && this.loginInputs.password !== '') {
          console.log(this.logIn(this.loginInputs.username, this.loginInputs.password))
          this.logIn(this.loginInputs.username, this.loginInputs.password)
          .then((currentUser) => {
            console.log('currentUser', currentUser.toJSON())
            this.$store.dispatch('currentUserInfo', currentUser.toJSON()).then(() => {
              console.log('小可爱登录成功')
              this.showPluginAuto('小可爱登录成功 ！')
              this.$router.push('/')
            })
          }).catch((error) => {
            console.log('error', error)
            this.showPluginAuto('error')
          })
        } else {
          this.showPluginAuto('小可爱要填写完整在登录啊！')
        }
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
