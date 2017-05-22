<template>
  <div>
    <Modal
            v-model="editing"
            :loading="saving"
            title="编辑留言">
      <Form :model="editingComment" ref="editingForm" :label-width="80" :rules="editingRules">
        <Form-item label="状态" prop="status">
          <Input v-model="editingComment.status" placeholder="请输入">
          </Input>
        </Form-item>
        <Form-item label="留言内容" prop="content">
          <Input v-model="editingComment.content" type="textarea" :autosize="{minRows: 4,maxRows: 10}" placeholder="请输入...">
          </Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSubmit('editingForm')">提交</Button>
        </Form-item>
      </Form>
      <div slot="footer"></div>
    </Modal>
    <div class="ivu-article">
      <h1>评论列表</h1>
      <div>
        <div class="hr"></div>
        <Form :model="formItem" ref="formInline" :label-width="80" inline>
          <Form-item label="搜索框：">
            <Input v-model="formItem.input" placeholder="id/用户名/内容">
            </Input>
          </Form-item>
          <Form-item>
            <div class="tr">
              <Button type="ghost" style="margin-left: 8px" @click="clear">取消</Button>
              <Button type="primary" @click="search">筛选</Button>
            </div>
            </Input>
          </Form-item>
        </Form>
        <div class="hr"></div>
      </div>
      <Table height="400" border :columns="columns2" :data="commentsList" class="w-100 m-b-15"></Table>
      <div class="fix">
        <Page :total="count" :page-size="pageSize" @on-change="changePage" class="r"></Page>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'

  export default{
    data() {
      return {
        pageSize: 10,
        count: 0,
        editing: false,
        saving: false,
        editingComment: {},
        editingRules: {
          content: { required: true, max: 500, message: '最多500个文字', trigger: 'blur' },
        },
        formItem: {
          input: '',
        },
        columns2: [
          {
            title: 'objectId',
            key: 'objectId',
            fixed: 'left',
            width: 200,
          },
          {
            title: '状态',
            key: 'formatStatus',
            width: 100,
            sortable: true,
          },
          {
            title: '用户名',
            key: 'username',
            width: 150,
          },
          {
            title: '文章id',
            key: 'post',
            width: 180,
          },
          {
            title: '内容',
            key: 'content',
            width: 300,
          },
          {
            title: '点赞数',
            key: 'thumbs',
            width: 100,
            sortable: true,
          },
          {
            title: '发表日期',
            key: 'formatUpdatedAt',
            width: 150,
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 150,
            render(row, column, index) {
              return `<i-button type="text" size="small" @click="show(${index})">查看</i-button><i-button type="text" size="small" @click="edit(${index})">编辑</i-button><i-button type="text" size="small" @click="delOne(${index})">删除</i-button>`
            },
          },
        ],
        commentsList: [],
      }
    },
    methods: {
      query() {
        const userQuery = this.queryComments()
        const createdByIdQuery = this.queryComments()
        const contentQuery = this.queryComments()
        const postIdQuery = this.queryComments()
        userQuery.contains('createdBy.username', this.formItem.input)
        createdByIdQuery.contains('createdById', this.formItem.input)
        contentQuery.contains('content', this.formItem.input)
        postIdQuery.contains('post', this.formItem.input)
        return AV.Query.or(postIdQuery, userQuery, createdByIdQuery, contentQuery)
      },
      clear() {
        this.formItem.input = ''
      },
      search() {
        this.commentsList = []
        const posts = this.query()
        posts.descending('updatedAt').limit(this.pageSize).find().then((res) => {
          this.commentsList = _.map(res, (item) => {
            const obj = item.toJSON()
            obj.username = obj.createdBy.username
            if (obj.status === 1) {
              obj.formatStatus = '正常'
            } else {
              obj.formatStatus = '禁用'
            }
            console.log(obj.formatStatus)
            obj.status = _.toNumber(obj.status)
            obj.content = obj.content ? obj.content : '无'
            obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
            return obj
          })
        })
      .catch((err) => {
        console.log('err', err)
        this.$Message.error('出错啦')
      })
        posts.count().then((res) => {
          this.count = res
        }).catch((err) => {
          console.log('err', err)
          this.$Loading.error()
          this.$Message.error('出错啦')
        })
      },
      changePage(page) {
        const comments = this.queryComments()
        comments.descending('createdAt').limit(this.pageSize).skip(page * this.pageSize - this.pageSize).find()
          .then((res) => {
            this.commentsList = _.map(res, (item) => {
              const obj = item.toJSON()
              console.log(obj)
              obj.username = obj.createdBy.username
              if (obj.status === 1) {
                obj.formatStatus = '正常'
              } else {
                obj.formatStatus = '禁用'
              }
              console.log(obj.formatStatus)
              obj.status = _.toNumber(obj.status)
              obj.content = obj.content ? obj.content : '无'
              obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
              return obj
            })
          })
        .catch((err) => {
          console.log('err', err)
          this.$Message.error('出错啦')
        })
      },
      delOne(index) {
        this.$Modal.confirm({
          title: '确定删除吗？',
          content: '删除以后将不可恢复！',
          onOk: () => {
            console.log(this.commentsList[index].objectId)
            const dealId = this.commentsList[index].objectId
            const todo = AV.Object.createWithoutData('Comments', dealId)
            todo.destroy().then((success) => {
              console.log(success)
              this.$Message.info('删除成功！')
              this.commentsList.splice(index, 1)
              console.log(this.commentsList.toJSON())
            }, (error) => {
              console.log(error)
            })
          },
        })
      },
      show(index) {
        console.log(index)
        this.$Modal.info({
          title: '图文详情',
          content: `
            <div><span class="c-g9">用户名：</span>${this.commentsList[index].username}</div>
            <div><span class="c-g9">发表时间：</span>${this.commentsList[index].formatCreatedAt || '空'}</div>
            <div><span class="c-g9">评论状态：</span>${this.commentsList[index].formatStatus}</div>
            <div><span class="c-g9">评论内容：</span>${this.commentsList[index].content || '空'}</div>
           <div><span class="c-g9">文章id：</span>${this.commentsList[index].post || '空'}</div>

          `,
        })
      },
      edit(index) {
        console.log(index)
        console.log(this.editingComment)
        this.editing = true
        this.editingComment = this.commentsList[index]
        console.log('this.editingComment', this.editingComment)
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.saving = true
            const modelPost = this.modelUpdate('Comments', this.editingComment.objectId)
            modelPost.save({
              status: this.editingComment.status,
              content: this.editingComment.content,
            }).then((res) => {
              const obj = res.toJSON()
              console.log('修改', obj)
              this.$Message.success('操作成功')
              this.editing = false
              this.saving = false
              obj.formatStatus = this.formatStatus(obj.status)
              obj.formatUpdatedAt = this.dateFormat(new Date(), 'L')
              this.commentsList = _.map(this.commentsList, (item) => {
                if (item.objectId === obj.objectId) {
                  item = obj
                }
                return item
              })
            }).catch((err) => {
              console.log('err', err)
              this.$Message.error('出错啦')
            })
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
      uploadComplete(status, result) {
        if (status === 200) {
          this.thumbnails.push(`http://oo6bhdayj.bkt.clouddn.com/${result.key}`)
          console.log(this.thumbnails)
        } else {
          console.log('出错', status)
        }
      },
    },
    created() {
      const currentUserData = this.currentUser()
      if (currentUserData) {
        this.currentUserData = currentUserData
        const comments = this.queryComments()
        comments.count().then((res) => {
          this.count = res
          console.log('this.count', this.count)
        })
        comments.descending('createdAt').limit(this.pageSize).find().then((res) => {
          this.commentsList = _.map(res, (item) => {
            const obj = item.toJSON()
            console.log(obj)
            obj.username = obj.createdBy.username
            if (obj.status === 1) {
              obj.formatStatus = '正常'
            } else {
              obj.formatStatus = '禁用'
            }
            console.log(obj.formatStatus)
            obj.status = _.toNumber(obj.status)
            obj.content = obj.content ? obj.content : '无'
            obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
            return obj
          })
        })
      .catch((err) => {
        console.log('err', err)
        this.$Message.error('出错啦')
      })
      }
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
