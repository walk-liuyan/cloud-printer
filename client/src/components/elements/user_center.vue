<template>
    <div>
        <div class="bg_img w-100">
            <router-link to="/menu_list" v-if="!xeId">
                <i class="fa fa-cog fa-lg c-g6" aria-hidden="true" style="position: absolute;right: 10px;top: 10px"></i>
            </router-link>
            <img :src="data.avatar" class="head_img" v-if="data && data.avatar">
        </div>
        <!-- show :username-->
        <flexbox class="p-t-10">
            <flexbox-item :span="2">
                <div class="tc "></div>
            </flexbox-item>
            <flexbox-item :span="4">
                <div class="tc fz-14" v-if="data && data.username"> {{data.username}}</div>
            </flexbox-item>
            <flexbox-item :span="5">
                <X-Button v-if="openFollow && btnOpen" type="primary" @click.native="followOne()" class="w-50 h20 fz-12"
                          style="width: 50%">关注
                </X-Button>
                <X-Button v-if="unOpenFollow && btnOpen" type="primary" @click.native="unFollowOne()"
                          class="w-50 h20 fz-12"
                          style="width: 60%">取消关注
                </X-Button>
            </flexbox-item>
        </flexbox>
        <div class=" fz-12 p-t-10 p-l-10 p-r-10 c-g9">个性签名：{{bio}}</div>
        <!-- show fans follow data-->
        <flexbox class="p-t-10">
            <flexbox-item :span="2">
            </flexbox-item>
            <flexbox-item :span="4">
            </flexbox-item>
            <flexbox-item :span="5">
                <div class="tc ">
                    <flexbox class="fz-12">
                        <flexbox-item>
                            <router-link to="/follow" v-if="!xeId">
                                <div class="flex-demo c-black tc">
                                    <p>关注</p>
                                    <span class="c-gray">{{followEeNum}}</span>
                                </div>
                            </router-link>
                        </flexbox-item>
                        <flexbox-item>
                            <router-link to="/fans">
                                <div class="flex-demo c-black tc">
                                    <p>粉丝</p>
                                    <span class="c-gray">{{fansNum}}</span>
                                </div>
                            </router-link>
                        </flexbox-item>
                        <flexbox-item class="p-r-10">
                            <div class="flex-demo c-black tc" @click="addNum()">
                                <p>被赞</p>
                                <span class="c-gray">{{thumbs}}</span>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </div>
            </flexbox-item>
        </flexbox>

        <group v-if="!xeId">
            <cell title="福利商城" link="/shop_mall" class="fz-12">
                <i class="fa fa-shopping-cart fa-lg c-black " aria-hidden="true"></i>
            </cell>
        </group>
        <div class="m-b-10"></div>
        <div v-for="item in postList" class="tc m-b-10">
            <div v-if="!item.open">
                <router-link :to="`/img_detail/${item.objectId}`">
                    <span style="font-size:20px;"><i class="fa fa-spin fa-spinner"></i></span>
                    <Divider class="fz-12">{{item.formatUpdatedAt}}</Divider>
                    <x-img :src="item.files" @on-success="success" @on-error="error"
                           class="ximg-demo" error-class="ximg-error" :offset="-100"
                           container="#vux_view_box_body"></x-img>
                </router-link>
            </div>
        </div>
        <navigation></navigation>
    </div>
</template>
<script type="text/babel">
  import { Cell, Group, Flexbox, FlexboxItem, Divider, Scroller, Spinner, XImg, XButton } from 'vux'
  import navigation from '../common/navigation.vue'
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'

  export default {
    components: {
      Cell,
      Group,
      Flexbox,
      FlexboxItem,
      Divider,
      Scroller,
      Spinner,
      navigation,
      XImg,
      XButton,
    },
    data() {
      return {
        currentUseData: null,
        userID: null,
        bio: null,
        thumbs: null,
        xeId: null,
        data: null,
        postList: null,
        currentPageId: null,
        followInfo: null,
        followEeNum: 0,
        fansNum: 0,
        btnOpen: 'true',
        openFollow: true,
        unOpenFollow: null,
        queryFollowEeList: null,
      }
    },
    watch: {
      $route(to, from) {
        console.log('watch', to, from)
        this.loadMeData()
      },
      userID(val) {
        console.log('watch-userID', val)
        if (val === undefined) {
          this.loadMeData()
        } else {
          this.loadOtherData(val)
        }
      },
    },
    methods: {
      show(index) {
        this.$refs.previewer.show(index)
      },
      loadOtherData(val) {
        console.log('他人！！！！', val)
        console.log('this.currentUseData.objectId', this.currentUseData.objectId)
        if (val === this.currentUseData.objectId) {
          this.btnOpen = null
          this.openFollow = null
        } else {
          this.btnOpen = true
        }
        this.xeId = val
        console.log('他的id', this.xeId)
        const query = AV.Object.createWithoutData('_User', val)
        query.fetch().then((resData) => {
          const res = resData.toJSON()
          this.data = res
          this.bio = res.bio
          this.thumbs = res.thumbs ? res.thumbs : 0
        })
        const post = this.queryPosts()
        post.equalTo('createdById', val)
        post.find().then((postsRes) => {
          this.postList = _.map(postsRes, (item) => {
            const obj = item.toJSON()
            obj.files = obj.files[0]
            obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
            if (obj.files === undefined) {
              obj.open = true
            }
            console.log('objectId data:', obj.objectId)
            return obj
          })
        }).catch((err) => {
          console.log('err', err)
          this.showPluginAuto('出错啦')
        })
      },
      loadMeData() {
        console.log('2')
        this.openFollow = null
        this.unOpenFollow = null
        this.xeId = null
        this.data = this.currentUseData
        this.bio = this.currentUseData.bio ? this.currentUseData.bio : '无'
        this.thumbs = this.currentUseData.thumbs ? this.currentUseData.thumbs : 0
        const post = this.queryPosts()
        post.equalTo('createdById', this.data.objectId)
        post.find().then((postsRes) => {
          this.postList = _.map(postsRes, (item) => {
            const obj = item.toJSON()
            console.log('me obj', obj)
            obj.files = obj.files[0]
            obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
            if (obj.files === undefined) {
              obj.open = true
            }
            console.log('postList data:', obj.files)
            return obj
          })
          console.log('postList', this.postList)
        }).catch((err) => {
          console.log('err', err)
          this.showPluginAuto('出错啦')
        })
      },
      followOne() {
        AV.User.current().follow(this.currentPageId).then((res) => {
          console.log(res)
          this.showPluginAuto('关注成功啦！')
          this.fansNum += 1
          this.openFollow = null
          this.unOpenFollow = true
        }, (err) => {
          console.dir('err', err)
        })
      },
      unFollowOne() {
        AV.User.current().unfollow(this.currentPageId).then((res) => {
          console.log(res)
          this.showPluginAuto('已取消关注')
          this.fansNum -= 1
          this.openFollow = true
          this.unOpenFollow = null
        }, (err) => {
          console.dir('err', err)
        })
      },
      success(src, ele) {
        console.log('success load', src)
        const span = ele.parentNode.querySelector('span')
        ele.parentNode.removeChild(span)
      },
      error(src, ele, msg) {
        console.log('error load', msg, src)
        const span = ele.parentNode.querySelector('span')
        span.innerText = '宝宝没有上传图片'
        span.style.cssText = 'color:black;font-size:12px;'
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
      addNum() {
        this.thumbs += 1
        const modelUser = this.modelUpdate('_User', this.data.objectId)
        modelUser.save({
          thumbs: this.thumbs,
        })
        this.showPluginAuto('赞+1!')
      },
    },
    created() {
      console.log('111', this.$route.params.objectId)
      const currentUseData = this.currentUser()
      if (currentUseData) {
        console.log('data', this.data)
        this.currentUseData = currentUseData
        console.log(this.currentUseData)
        const userID = this.$route.params.objectId
        this.userID = userID
        this.currentPageId = userID
        console.log('userID', userID)
        const queryFollowEe = this.queryFollowEe()
        queryFollowEe.include('followee')
        queryFollowEe.find().then((followees) => {
          console.log(followees.length)
          this.followEeNum = followees.length || 0
          this.queryFollowEeList = _.map(followees, (item) => {
            console.log('queryFollowEeList', item.toJSON())
            if (item.toJSON().objectId === userID) {
              console.log('item.toJSON().objectId', item.toJSON().objectId)
              console.log('userID', userID)
              this.openFollow = null
              this.unOpenFollow = userID
            } else {
              this.unOpenFollow = null
              this.openFollow = userID
            }
            return item.toJSON()
          })
        })
        const queryFollower = this.queryFollower()
        queryFollower.include('follower')
        queryFollower.find().then((followers) => {
          console.log(followers.length)
          this.fansNum = followers.length || 0
        })
      }
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
<style>
    .card-padding {
        padding: 15px;
    }

    .bg_img {
        height: 120px;
        position: relative;
        top: 0px;
        left: 0;
        background: #A1FFCE;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #FAFFD1, #A1FFCE);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #FAFFD1, #A1FFCE); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }

    .head_img {
        position: absolute;
        left: 10px;
        bottom: -30%;
        height: 80px;
        width: 80px;
        border: 1px dashed black;
        border-radius: 50%;
        background: white;
    }

    .ximg-demo {
        width: 100%;
        height: auto;
    }

    .ximg-error {
        background: url("../../assets/images/logo.jpg") no-repeat;
    }

    .ximg-error:after {
        content: '加载失败';
        color: red;
    }
</style>
