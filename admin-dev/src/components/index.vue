<template>
  <div>
    <div class="p-20">
      <Button type="warning" @click="getOnePost">一篇文章</Button>
      <Button type="warning" @click="getMsg">留言列表</Button>
      <Button type="warning" @click="getGitHub">gitHub信息</Button>
      <Button type="warning" @click="genToken">七牛token</Button>
    </div>
    <div class="p-20">
      <Button type="primary" @click="postMsg">发布一条留言</Button>
      <Button type="warning" @click="updateMsg">修改一条留言</Button>
      <Button type="primary" @click="postArt">发布一篇文章</Button>
      <Button type="primary" @click="postComment">发布一个评论</Button>
    </div>
    <div class="p-20">
      <Button type="primary" @click="loginAdmin">管理员登录</Button>
      <Button type="error" @click="handleLogOut">注销</Button>
      <Button type="primary" @click="showCurrentUser">查看当前用户</Button>
      <Button type="error" @click="addToGroup">当前用户加入管理组</Button>
    </div>
  </div>
</template>
<script type="text/babel">
  import FnMixins from '../assets/js/fn-mixins'
  import ModelMixins from '../assets/js/model-mixins'

  export default{
    data() {
      return {
        data: null,
      }
    },
    methods: {
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
      getMsg() {
        const messages = this.queryMessages()
        messages.descending('createdAt').find().then((res) => {
          console.log('Messages', JSON.parse(JSON.stringify(res)))
        }).catch((err) => {
          console.log('err', err)
          this.$Message.error('出错啦')
        })
      },
      loginAdmin() {
        this.logIn('admin', 'admin')
      },
      handleLogOut() {
        this.logOut()
      },
      showCurrentUser() {
        this.currentUser()
      },
      createGroup() {
        const roleAcl = new AV.ACL()
        roleAcl.setPublicReadAccess(true)
        roleAcl.setPublicWriteAccess(false)
        roleAcl.setWriteAccess(AV.User.current(), true)
        const administratorRole = new AV.Role('Administrator', roleAcl)
        administratorRole.save().then((role) => {
          console.log('创建成功', role)
          const roleQuery = new AV.Query(AV.Role)
          roleQuery.equalTo('name', 'Administrator')
          roleQuery.equalTo('users', AV.User.current())
          roleQuery.find().then((results) => {
            if (results.length > 0) {
              role = results[0]
              return administratorRole
            }
            const relation = role.getUsers()
            relation.add(AV.User.current())
            return role.save()
          }).then((res) => {
            console.log('administratorRole', res)
          }).catch((error) => {
            console.log(error)
          })
        }).catch((error) => {
          console.log(error)
        })
      },
      addToGroup() {
        const roleQuery = new AV.Query(AV.Role)
        roleQuery.equalTo('name', 'Administrator')
        roleQuery.equalTo('users', AV.User.current())
        roleQuery.find().then((results) => {
          if (results.length > 0) {
            return results[0]
          }
          const relation = roleQuery.getUsers()
          relation.add(AV.User.current())
          return roleQuery.save()
        }).then((role) => {
          console.log('administratorRole', role)
        }).catch((error) => {
          console.log(error)
        })
      },
      postMsg() {
        if (this.currentUser()) {
          const messagesObject = this.modelMsg()
          messagesObject.save({
            nickName: 'test5',
            content: 'testtesttesttest5',
            createdBy: AV.User.current().toJSON(),
          }).then((res) => {
            this.$Message.success('操作成功')
            console.log('发布留言成功', res)
          }).catch((err) => {
            console.log('err', err)
            this.$Message.error('出错啦')
          })
        }
      },
      postArt() {
        if (this.currentUser()) {
          const posts = this.modelPosts()
          posts.save({
            createdBy: AV.User.current().toJSON(),
            content: '乾三连，坤六断，震仰盂，艮覆碗，离中虚，坎中满，兑上缺，巽下断。',
            files: ['http://img.hidoge.cn/v1.0/photo-1000x1000-2.jpg', 'http://img.hidoge.cn/v1.0/photo-1000x1000.jpg', 'http://img.hidoge.cn/v1.0/photo-1240x698-2.jpg'],
          }).then((res) => {
            this.$Message.success('操作成功')
            console.log('发布Posts成功', res)
          }).catch((err) => {
            console.log('err', err)
            this.$Message.error('出错啦')
          })
        }
      },
      postComment() {
        if (this.currentUser()) {
          const comments = this.modelComments()
          comments.save({
            createdBy: AV.User.current().toJSON(),
            content: '习习谷风，以阴以雨。',
            post: '58eb59caac502e006c469210',
          }).then((res) => {
            this.$Message.success('操作成功')
            console.log('发布comments成功', res)
          })
        }
      },
      getOnePost() {
        const post = this.queryPosts()
        post.find().then((postsRes) => {
          const onePost = postsRes[0].toJSON()
          const comments = this.queryComments()
          comments.equalTo('post', onePost.objectId)
          comments.find().then((commentsRes) => {
            onePost.comments = _.map(commentsRes, (item) => {
              return item.toJSON()
            })
            console.log('onePost', onePost)
          }).catch((err) => {
            console.log('err', err)
            this.$Message.error('出错啦')
          })
        }).catch((err) => {
          console.log('err', err)
          this.$Message.error('出错啦')
        })
      },
      getOnePost1() {
        const post = this.queryPosts()
        post.get('58eb59caac502e006c469210').then((postsRes) => {
          const onePost = postsRes.toJSON()
          const comments = this.queryComments()
          comments.equalTo('post', onePost.objectId)
          comments.find().then((commentsRes) => {
            onePost.comments = _.map(commentsRes, (item) => {
              return item.toJSON()
            })
            console.log('onePost', onePost)
          }).catch((err) => {
            console.log('err', err)
            this.$Message.error('出错啦')
          })
        }).catch((err) => {
          console.log('err', err)
          this.$Message.error('出错啦')
        })
      },
      updateMsg() {
        const obj = this.modelUpdate('Messages', '58eceee3b123db00523b8666')
        obj.save({
          content: '习习谷风，以阴以雨。',
        }).then((res) => {
          console.log('res', res)
          this.$Message.success('操作成功')
        }).catch((err) => {
          console.log('err', err)
          this.$Message.error('出错啦')
        })
      },
    },
    mixins: [ModelMixins, FnMixins],
  }
</script>
