<template>
    <div style="padding-bottom: 50px">
        <group v-for="item in userListContent">
            <div class="w-100">
                <div class="l h80">
                    <router-link :to="`/user/${item.createdBy.objectId}`">
                        <img :src="item.createdBy.avatar" class="rounded-x m-t-10 m-r-20 m-l-10" width="60px"
                             height="60px">
                    </router-link>
                </div>
                <p class="c-black fz-18 p-t-10">
                    <router-link :to="`/user/${item.createdBy.objectId}`">
                        <span class="c-black">{{item.createdBy.username}}</span>
                    </router-link>
                </p>
                <p class="c-g9 p-t-10 fz-12">{{item.createdBy.bio}}</p>
            </div>
            <br>
            <div class="tc m-b-10" v-if="item.files.length !== 0">
                <router-link :to="`/img_detail/${item.objectId}`">
                    <span style="font-size:20px;"><i class="fa fa-spin fa-spinner"></i></span>
                    <x-img :src="`${item.firstFile}?imageView2/1/w/600/h/600/interlace/0/q/100`" @on-success="success"
                           @on-error="error"
                           class="ximg-demo" error-class="ximg-error" :offset="-100"
                           container="#vux_view_box_body"></x-img>
                    <p class="r fz-12 c-g9 p-r-10">共{{item.files.length}}张图</p>
                </router-link>
            </div>
            <!--    <router-link :to="`/img_detail/${item.objectId}`">
                    <div class="w100 tc m-t-10" v-if="item.files.length !== 0">
                        <span style="font-size:20px;"><i class="fa fa-spin fa-spinner"></i></span>
                        <x-img :src="`${item.firstFile}?imageView2/1/w/600/h/600/interlace/0/q/100`" @on-success="success" @on-error="error"
                               class="ximg-demo" error-class="ximg-error" :offset="-100"
                               container="#vux_view_box_body"></x-img>
                        <p class="r fz-12 c-g9 p-r-10">共{{item.files.length}}张图</p>
                    </div>
                </router-link>-->
            <router-link :to="`/img_detail/${item.objectId}`">
                <div class=" fz-12 c-g6 h25 m-t-20 p-l-10 p-r-10">{{item.content}}</div>
            </router-link>
            <flexbox class="m-t-10 m-b-10">
                <flexbox-item>
                    <div class="tc bg-white rounded" @click="addNum(item.objectId)">
                        <i class="fz-16 fa fa-thumbs-o-up fa-lg c-red" aria-hidden="true"></i><span
                            class="c-g6 fz-12"> {{item.thumbs}}个赞</span>
                    </div>
                </flexbox-item>
                <router-link :to="`/img_detail/${item.objectId}`">
                    <flexbox-item>
                        <div class="tc bg-white rounded"><i class="fz-16 fa fa-commenting-o fa-lg c-gray"></i></div>
                    </flexbox-item>
                </router-link>
                <flexbox-item>
                    <router-link :to="`/shop/2/${item.objectId}`">
                        <div v-if="item.files.length !== 0" class="tc bg-white rounded"><i
                                class="fz-16 fa fa-print fa-lg c-black"></i></div>
                    </router-link>
                </flexbox-item>
            </flexbox>
        </group>
        <p class="tc" @click="morePosts">...more...</p>
        <navigation></navigation>
    </div>
</template>
<script type="text/babel">
  import { Divider, Group, XImg, Flexbox, FlexboxItem, LoadMore, Scroller } from 'vux'
  import ModelMixins from '../assets/js/model-mixins'
  import FnMixins from '../assets/js/fn-mixins'
  import navigation from './common/navigation.vue'

  export default{
    components: {
      Divider, Group, XImg, Flexbox, FlexboxItem, navigation, LoadMore, Scroller,
    },
    data() {
      return {
        page: 1,
        count: null,
        pageSize: 5,
        totalCount: 5,
        itemContent: {},
        userListContent: [],
        currentUserList: [],
      }
    },
    methods: {
      morePosts() {
        this.totalCount += 5
        this.page += 1
        if (this.totalCount === this.count) {
          console.log('到底')
        } else {
          console.log('>10')
          const post = this.queryPosts()
          post.descending('createdAt').limit(this.pageSize).skip(this.page * this.pageSize - this.pageSize).find()
            .then((res) => {
              console.log(this.page)
              console.log('res', JSON.parse(JSON.stringify(res)))
              if (res.length === 0) {
                this.showPluginAuto('宝宝到底啦！')
              }
              this.currentUserList = _.map(res, (item) => {
                const obj = item.toJSON()
                obj.firstFile = obj.files[0]
                return obj
              })
              this.userListContent = this.userListContent.concat(this.currentUserList)
            })
            .catch((err) => {
              console.log('err', err)
              this.$Message.error('出错啦')
            })
          console.log(this.userListContent)
        }
      },
      addNum(id) {
        console.log('id', id)
        _.forEach(this.userListContent, (user) => {
          if (user.objectId === id) {
            user.thumbs += 1
            const modelUser = this.modelUpdate('Posts', id)
            modelUser.save({
              thumbs: user.thumbs,
            })
            this.showPluginAuto('赞+1!')
          }
        })
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
      getGitHub() {
        const req = () => {
          return Promise.all([this.usersList(), this.user('keroVieux')])
        }
        req().then((res) => {
          const [resA, resB] = res
          console.log('good resA', resA)
          console.log('good resB', resB)
        }).catch((error) => {
          console.log(error)
        })
      },
    },
    created() {
      const post = this.queryPosts()
      post.count().then((res) => {
        this.count = res
        console.log('--------------this.count-----------', this.count)
      })
      post.descending('createdAt').limit(this.pageSize).find().then((postsRes) => {
        console.log('postsRes', JSON.parse(JSON.stringify(postsRes)))
        this.userListContent = _.map(postsRes, (item) => {
          const obj = item.toJSON()
          obj.firstFile = obj.files[0]
          console.log('userContentList data:', obj)
          return obj
        })
      })
        .catch((err) => {
          console.log('err', err)
          this.showPluginAuto('获取post出错啦')
        })
    },
    mixins: [ModelMixins, FnMixins],
  }
</script>

<style lang="less">
    @import '~vux/src/styles/1px.less';

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

    .weui-media-box__thumb {
        border-radius: 30px;
    }

    .ximg-error {
        background-color: darkorange;
    }

    .ximg-error:after {
        content: '加载失败';
        color: red;
    }
</style>
