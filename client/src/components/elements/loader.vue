<template>
    <div style="margin-top: 10px">
        <div class="p-b-100" style="padding-bottom: 100px">
            <div class="fix p-l-10 p-r-10">
                <div class="upload-preview tc m-b-20 l">
                    <figure v-for="(thumbnail,index) in thumbnails" class="l pos-rel">
                        <div style="width: 100px" class="m-r-5 l">
                            <img :src="`${thumbnail}?imageView2/1/w/100/h/100/interlace/0/q/100`" class="rounded bd-blue m-r-5" />
                            <i class="fz-20 c-red fa fa-times btn_remove" aria-hidden="true" @click="del(index)" ></i>
                        </div>
                    </figure>
                </div>
                <QiniuUpload :multiple="true" @complete="uploadComplete" ref="qiniuUpload" class="l">
                    <a></a>
                </QiniuUpload>
            </div>
            <group>
                <x-textarea v-model="articleText" :max="200" placeholder="小可爱，在这里写内容啊！" :show-counter="false" :rows="6"></x-textarea>
            </group>
            <x-button type="primary" @click.native="postArt" class="h30 rounded-4x m-t-10"
                      style="width: 50%">发送
            </x-button>
        </div>
        <navigation></navigation>
    </div>
</template>
<script type="text/babel">
  import { XTextarea, Group, XButton } from 'vux'
  import navigation from '../common/navigation.vue'
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'
  import QiniuUpload from '../common/qiniuUpload.vue'

  export default{
    components: {
      navigation, XTextarea, Group, XButton, QiniuUpload,
    },
    data() {
      return {
        thumbnails: [],
        articleText: null,
        data: null,
      }
    },
    methods: {
      del(i) {
        console.log(i)
        this.thumbnails.splice(i, 1)
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
        }, 2000)
      },
      postArt() {
        /* this.currentUser()是调用了model-mixins中的currentUser()方法。
        currentUser() {
         //定义currentser为当前用户，这是leancloud已经集成给我们使用的方法
         const currentUser = AV.User.current()
         //判断如果当前没有当前用户信息，则提示没有登录，同时页面跳转至login
         if (!currentUser) {
         this.$Message.error('你没有登录')
         this.$router.push('/login')
         return false
         }
         return currentUser.toJSON()
         },*/
        const user = this.currentUser()
        if (user) {
          /* 定义posts为新增文字表的方法的返回，并且保存当前我添加的数据*/
          const posts = this.modelPosts()
          posts.save({
            createdBy: user,
            content: this.articleText,
            createdById: user.objectId,
            files: this.thumbnails,
          }).then((res) => {
            /* 数据添加成功以后，会提示发布成功，同时将页面跳转至首页，并且将输入框置空*/
            this.showPluginAuto('发布成功')
            this.$router.push('/')
            this.articleText = null
            console.log('发布Posts成功', res)
          }).catch((err) => {
            console.log('err', err)
            this.showPluginAuto('出错啦')
          })
        }
      },
      uploadComplete(status, result) {
        if (status === 200) {
          this.thumbnails.push(`http://oyj.bt.ldn.com/${result.key}`)
        } else {
          console.log('出错', status)
        }
      },
    },
    created() {
      this.data = this.currentUser()
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
