<template>
    <div>
        <div class="upload-preview tc m-b-20" v-if="currentUser.thumbnail">
            <figure>
                <img :src="`${currentUser.thumbnail}?imageView2/1/w/100/h/100/interlace/0/q/100`" class="rounded bd-blue"/>
            </figure>
            <div class="tc">
                <Button type="primary" @click="currentUser.thumbnail = false">修改头像</Button>
            </div>
        </div>
        <QiniuUpload flag="'thumbnail'" @complete="uploadComplete" ref="qiniuUpload" v-else>
            <a></a>
        </QiniuUpload>
        <group >
            <x-input title="邮箱" v-model="currentUser.email" placeholder="请输入邮箱" is-type="email"></x-input>
        </group>
        <group>
            <x-input  title="昵称" v-model="currentUser.username" placeholder="请输入昵称"></x-input>
        </group>
        <group >
            <x-input title="个性签名" v-model="currentUser.bio" placeholder="请输入签名"></x-input>
        </group>
        <group >
        <x-input title="电话号码" v-model="currentUser.mobilePhoneNumber" placeholder="请输入电话号码"></x-input>
    </group>
        <group title="性别">
            <select v-model="currentUser.gender" class="w-100 p-l-10 fz-14" style="border: none;height: 40px">
                <option disabled value="">Please select one</option>
                <option>保密</option>
                <option>男</option>
                <option>女</option>
            </select>
        </group>
        <x-button @click.native="handleSubmit()" type="primary" class="h30 rounded-4x m-b-10 m-t-10" style="width: 50%">
            保存
        </x-button>
    </div>
</template>
<script type="text/babel">
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
        currentUser: {
          email: null,
          username: null,
          password: null,
          bio: null,
          gender: null,
          thumbnail: null,
          mobilePhoneNumber: null,
        },
        currentUserData: null,
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
      uploadComplete(status, result) {
        if (status === 200) {
          this.currentUser.thumbnail = `http://ooj.bt.cldn.com/${result.key}`
        } else {
          this.showPluginAuto('上传错误')
        }
      },
      handleSubmit() {
        const modelUser = this.modelUpdate('_User', this.currentUserData.objectId)
        modelUser.save({
          username: this.currentUser.username,
          email: this.currentUser.email,
          gender: _.toNumber(this.formatOptionGender(this.currentUser.gender)),
          bio: this.currentUser.bio,
          avatar: this.currentUser.thumbnail,
        })
        this.showPluginAuto('保存!')
        this.currentUser.gender = this.formatGender(_.toNumber(this.currentUser.gender))
      },
    },
    created() {
      const user = AV.User.current().toJSON()
      this.currentUserData = user
      this.currentUser.email = user.email
      this.currentUser.username = user.username
      this.currentUser.bio = user.bio
      this.currentUser.thumbnail = user.avatar
      this.currentUser.gender = this.formatGender(user.gender)
      this.currentUser.mobilePhoneNumber = user.mobilePhoneNumber
/*
      const query = AV.Object.createWithoutData('_User', user.objectId)
      query.fetch().then((res) => {
        console.log('最新', res.toJSON())
        const resItem = res.toJSON()
        console.log('resItem', resItem)
        this.currentUser.email = resItem.email
        this.currentUser.username = resItem.username
        this.currentUser.bio = resItem.bio
        this.currentUser.thumbnail = resItem.avatar
        console.log('this.formatGender(resItem.gender)', this.formatGender(resItem.gender))
        this.currentUser.gender = this.formatGender(resItem.gender)
        this.currentUser.mobilePhoneNumber = resItem.mobilePhoneNumber
      })*/
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
