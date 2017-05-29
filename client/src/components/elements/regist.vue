<template>
    <div class="p-b-50">
        <div class="upload-preview tc m-b-20" v-if="thumbnail">
            <figure>
                <img :src="`${thumbnail}?imageView2/1/w/100/h/100/interlace/0/q/100`" class="rounded bd-blue"/>
            </figure>
            <div class="tc">
                <Button type="primary" @click="thumbnail = false">修改头像</Button>
            </div>
        </div>
        <QiniuUpload :multiple="false" @complete="uploadComplete" ref="qiniuUpload" class="m-b-20" v-else>
            <a></a>
        </QiniuUpload>
        <group>
            <x-input v-model="email" title="邮箱" name="email" placeholder="请输入邮箱地址" is-type="email"></x-input>
        </group>
        <group>
            <x-input v-model="mobilePhoneNumber" title="手机号码" name="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"></x-input>
        </group>
        <group >
            <x-input v-model="username" title="用户名" name="username" placeholder="用户名"></x-input>
        </group>
        <group>
            <x-input title="密码" type="password" placeholder="请输入至少6位密码" v-model="password" :min="6"
                     @on-change="change"></x-input>
            <x-input title="验证" v-model="password2" type="password" placeholder="再次输入密码"
                     :equal-with="password"></x-input>
        </group>
        <x-button type="primary" @click.native="handleSubmit()" is-link class="h30 rounded-4x m-b-10 m-t-10"
                  style="width: 50%">注册
        </x-button>
    </div>
</template>

<script>
  import { XInput, Group, XButton } from 'vux'
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'
  import QiniuUpload from '../common/qiniuUpload.vue'

  export default {
    components: {
      XInput,
      XButton,
      Group,
      QiniuUpload,
    },
    data() {
      return {
        email: null,
        username: null,
        password: null,
        password2: null,
        thumbnail: null,
        mobilePhoneNumber: null,
      }
    },
    methods: {
      change(val) {
        console.log(val)
      },
      showPlugin(string) {
        this.$vux.alert.show({
          title: string,
        })
      },
      showPluginAuto(string) {
        this.showPlugin(string)
        setTimeout(() => {
          this.$vux.alert.hide()
        }, 4000)
      },
      handleSubmit() {
        /* 判断当前输入框中的用户名和密码，邮箱是否为空，不为空则执行一下代码*/
        if (this.password === this.password2 && this.email !== '' && this.username !== '' && this.mobilePhoneNumber !== '') {
          /* 新建 AVUser 对象实例*/
          const user = new AV.User()
          /* 存储用户信息*/
          user.save({
            email: this.email,
            username: this.username,
            password: this.password,
            avatar: this.thumbnail ? this.thumbnail : 'http://oo6bhdayj.bkt.clouddn.com/FgzNI3WqTOj8wrh3Y1jb6iWCR33j',
            mobilePhoneNumber: this.mobilePhoneNumber,
          }).then((res) => {
            /* 存储完成以后，将其直接登录*/
            console.log('res', res)
            this.showPluginAuto('小可爱，注册成功啦')
            this.logIn(this.username, this.password)
              .then((currentUser) => {
                console.log('currentUser', currentUser.toJSON())
                /* this.store.dispatch 是vux用来存储当前用户数据的固定写法*/
                this.$store.dispatch('currentUserInfo', currentUser.toJSON()).then(() => {
                  /* 当前路由跳转至me*/
                  this.$router.push('/me')
                })
              }).catch((error) => {
                console.log('error', error)
                console.log(JSON.parse(JSON.stringify(error)))
                this.showPluginAuto('error')
              })
          }).catch((err) => {
            console.log('err', err)
            const errMess = JSON.parse(JSON.stringify(err)).code
            console.log(errMess)
            if (errMess === 214) {
              this.showPluginAuto('此号码已经注册')
            } else if (errMess === 202) {
              this.showPluginAuto('此用户名已经被使用')
            } else {
              this.showPluginAuto(err)
            }
          })
        } else {
          this.showPluginAuto('请填写正确信息')
        }
      },
      /* 头像上传*/
      uploadComplete(status, result) {
        /* 当上传状态等于200时，说明上传成功，则当下的头像值为上传至七牛的地址*/
        if (status === 200) {
          this.thumbnail = `http://j.bkt.con.com/${result.key}`
        } else {
          this.showPluginAuto('上传错误')
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
