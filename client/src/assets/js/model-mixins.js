/**
 * Created by PetitKero on 13/10/2016.
 */
/**
 * This provides mixins used for common api in the Vue components.
 * Before you begin to used it , plz inject this mixins in the components
 * like mixins: [ApiMixin]
 *
 * @mixin
 */
import axios from 'axios'

const ModelMixin = {
  handleReqError(req) {
    if (req.data.error) {
      this.$Message.error('出错啦')
    }
    return req.data.error
  },
  handleCatchError(err) {
    console.log('err', err)
    this.$Message.error('出错啦')
    return false
  },
  logOut() {
    return AV.User.logOut()
  },
  logIn(userName, password) {
    return AV.User.logIn(userName, password)
  },
  currentUser() {
    const currentUser = AV.User.current()
    if (!currentUser) {
      this.$vux.toast.show({
        text: '你没有登录',
        type: 'text',
      })
      this.$router.push('/login')
      return false
    }
    return currentUser.toJSON()
  },
  modelUpdate(table, id) {
    return AV.Object.createWithoutData(table, id)
  },
  modelOrders() {
    const AVObj = AV.Object.extend('Orders')
    const obj = new AVObj()
    obj.setACL(this.commonAcl())
    return obj
  },
  modelMsg() {
    const AVObj = AV.Object.extend('Messages')
    const obj = new AVObj()
    obj.setACL(this.commonAcl())
    return obj
  },
  modelPosts() {
    const AVObj = AV.Object.extend('Posts')
    const obj = new AVObj()
    obj.setACL(this.commonAcl())
    return obj
  },
  modelComments() {
    const AVObj = AV.Object.extend('Comments')
    const obj = new AVObj()
    obj.setACL(this.commonAcl())
    return obj
  },
  queryFollowEe() {
    return AV.User.current().followeeQuery()
  },
  queryFollower() {
    return AV.User.current().followerQuery()
  },
  queryPosts() {
    return new AV.Query('Posts')
  },
  queryComments() {
    return new AV.Query('Comments')
  },
  queryMessages() {
    return new AV.Query('Messages')
  },
  queryOrderList() {
    return new AV.Query('Orders')
  },
  queryProducts() {
    return new AV.Query('Products')
  },
  async genToken() {
    return AV.Cloud.run('genUpToken')
  },
  async usersList() {
    try {
      const req = await axios.get('users')
      this.handleReqError(req)
      return req.data
    } catch (err) {
      this.handleCatchError(err)
      return err
    }
  },
  async user(username) {
    try {
      const req = await axios.get(`users/${username}`)
      this.handleReqError(req)
      return req.data
    } catch (err) {
      this.handleCatchError(err)
      return err
    }
  },
}

export default {
  created() {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  },
  methods: ModelMixin,
}
