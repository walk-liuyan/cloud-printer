<template>
    <div>
        <group>
            <div v-for="(item, index) in list">
                <img class="previewer-demo-img tc m-5 l" :src="item.src" width="46%" @click="show()">
                <div v-transfer-dom>
                    <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur>
                        <div class="img-box">
                            <img :src="item.src" style="max-width:100%">
                        </div>
                        <div @click="showHideOnBlur=false">
                            <span class="vux-close"></span>
                        </div>
                    </x-dialog>
                </div>
            </div>
            <div class=" fz-12 p-l-10 p-r-10 c-g6 m-b-20 m-t-10" style="clear: both">{{content}}</div>
            <div class="w-100">
                <div class="l h80" >
                    <router-link :to="`/user/${objectId}`">
                        <img :src="avatar" class="rounded-x m-t-10 m-r-20 m-l-10" width="60px" height="60px">
                    </router-link>
                </div>
                <p class="c-black fz-18 p-t-10">
                    <router-link :to="`/user/${objectId}`">
                        <span class="c-black">{{username}}</span>
                    </router-link>
                </p>
                <p class="c-g9 p-t-10 fz-12">{{bio}}</p>
            </div>
            <flexbox class="m-t-20 m-b-10">
                <flexbox-item>
                    <div class="tc bg-white rounded fz-12" @click="addNum()">
                        <i class="fz-16 fa fa-thumbs-o-up fa-lg c-red" aria-hidden="true"></i><span class="c-g6 fz-12" > {{thumbs}}个赞</span>
                    </div>
                </flexbox-item>
                <flexbox-item>
                    <router-link :to="`/shop/2/${postId}`">
                        <div v-if="printerBtn" class="tc bg-white rounded"><i class="fz-16 fa fa-print fa-lg c-black"></i></div>
                    </router-link>
                </flexbox-item>
            </flexbox>

            <group>
                <x-textarea class="fz-12" v-model="commentsTxt" :max="200" name="detail" placeholder="小可爱，请说点什么" :show-counter="false"></x-textarea>
            </group>
            <x-button type="primary" @click.native="handleSubmit" is-link class="h30 rounded-4x m-b-10 m-t-10"
                      style="width: 50%">
                保存
            </x-button>
        </group>

            <group v-for="item in commentList">
            <p class="tc c-g6 p-t-10 fz-10"><span class="fz-12">{{item.updateAt | dateFormat('L')}}</span></p>
            <div class="l h80">
                <router-link :to="`/user/${item.createdById}`">
                    <img :src="item.createdBy.avatar" class="rounded-x m-t-10 m-r-20 m-l-5" width="60px" height="60px">
                </router-link>
            </div>
            <p class="c-black fz-18 p-t-10">
                <router-link :to="`/user/${item.createdById}`"><span class="c-black">{{item.createdBy.username}}</span></router-link>
            </p>
            <p class="c-g9 p-t-10 fz-12">{{item.content || '无'}}</p>
            </group>

    </div>
</template>
<script type="text/babel">
  import { Panel, Group, Scroller, Spinner, Flexbox, FlexboxItem, XTextarea, XButton, TransferDomDirective as TransferDom, XDialog } from 'vux'
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'
  import FiltersMixins from '../../assets/js/filters-mixins'

  export default {
    components: {
      Panel, Group, Scroller, Spinner, Flexbox, FlexboxItem, XTextarea, XButton, XDialog,
    },
    directives: {
      TransferDom,
    },
    data() {
      return {
        showHideOnBlur: false,
        data: null,
        postId: null,
        postdata: null,
        content: null,
        thumbs: null,
        files: null,
        list: [{
          src: null,
        }],
        objectId: null,
        avatar: null,
        username: null,
        bio: null,
        commentList: null,
        commentsTxt: null,
        printerBtn: null,
      }
    },
    methods: {
      show() {
        this.showHideOnBlur = true
      },
      success(src, ele) {
        console.log('success load', src)
        const span = ele.parentNode.querySelector('span')
        ele.parentNode.removeChild(span)
      },
      error(src, ele, msg) {
        console.log('error load', msg, src)
        const span = ele.parentNode.querySelector('span')
        span.innerText = 'load error'
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
        if (this.currentUser()) {
          this.data = this.currentUser()
          console.log('user', this.data)
          const commentsObject = this.modelComments()
          const user = this.currentUser()
          commentsObject.save({
            content: this.commentsTxt,
            createdBy: user,
            createdById: user.objectId,
            post: this.postId,
          }).then((res) => {
            this.showPluginAuto('评论成功')
            console.log('发布留言成功', res)
            this.commentList = [res.toJSON(), ...this.commentList]
            this.commentsTxt = null
          }).catch((err) => {
            console.log('err', err)
            this.showPluginAuto('出错啦')
          })
        } else {
          this.showPluginAuto('宝宝，要登录才能留下你的爪印哦！')
        }
      },
      addNum() {
        this.thumbs += 1
        const modelUser = this.modelUpdate('Posts', this.postId)
        modelUser.save({
          thumbs: this.thumbs,
        })
        this.showPluginAuto('赞+1!')
      },
    },
    created() {
      const postID = this.$route.params.objectId
      this.postId = postID
      console.log('postID', postID)
      if (postID) {
        console.log('他的id', postID)
        const query = AV.Object.createWithoutData('Posts', postID)
        query.fetch().then((res) => {
          const postdata = res.toJSON()
          console.log('res data', postdata)
          this.postdata = postdata
          this.files = postdata.files
          this.list = _.map(this.files, (item) => {
            const obj = {}
            obj.src = item
            return obj
          })
          if (this.files.length === 0) {
            this.printerBtn = null
          } else {
            this.printerBtn = 'open'
          }
          this.thumbs = postdata.thumbs
          this.content = postdata.content
          this.objectId = postdata.createdById
          this.avatar = postdata.createdBy.avatar
          this.bio = postdata.createdBy.bio
          this.username = postdata.createdBy.username
        })
        const comments = this.queryComments()
        comments.equalTo('post', postID)
        comments.find().then((commentsRes) => {
          this.commentList = _.map(commentsRes, (item) => {
            return item.toJSON()
          })
        }).catch((err) => {
          console.log('err', err)
          this.showPluginAuto('出错啦')
        })
      } else {
        this.showPluginAuto('get error！')
      }
    },
    mixins: [FnMixins, ModelMixins, FiltersMixins],
  }
</script>
<style lang="less" scoped>
    @import '~vux/src/styles/close';

    .dialog-demo {
    .weui-dialog{
        border-radius: 8px;
        padding-bottom: 8px;
    }
    .dialog-title {
        line-height: 30px;
        color: #666;
    }
    .img-box {
        height: 350px;
        overflow: hidden;
    }
    .vux-close {
        margin-top: 8px;
        margin-bottom: 8px;
    }
    }
    .weui-media-box__thumb {
        border-radius: 30px;
    }

    .ximg-demo {
        width: 100%;
        height: auto;
    }

    .ximg-error {
        background-color: yellow;
    }

    .ximg-error:after {
        content: '加载失败';
        color: red;
    }
</style>
