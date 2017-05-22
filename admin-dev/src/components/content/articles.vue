<template>
    <div>
        <Modal
                v-model="editing"
                :loading="saving"
                title="编辑图文">
            <div class="fix p-l-10 p-r-10">
                <div class="upload-preview tc m-b-20 l">
                    <figure v-for="(thumbnail, index) in thumbnails" class="l pos-rel">
                        <img :src="`${thumbnail}?imageView2/1/w/100/h/100/interlace/0/q/100`"     class="rounded bd-blue m-r-5"/>
                        <Icon type="close-circled" @click.native="deleteFile(index)" class="c-red btn_remove"></Icon>
                    </figure>
                </div>
                <QiniuUpload :multiple="true" @complete="uploadComplete" ref="qiniuUpload" class="l">
                    <a></a>
                </QiniuUpload>
            </div>
            <div class="m-b-10"></div>
            <Form :model="editingPost" ref="editingForm" :label-width="80" :rules="editingRules">
                <Form-item label="状态" prop="status">
                    <Input v-model="editingPost.status" placeholder="请输入">
                    </Input>
                </Form-item>
                <Form-item label="图文内容" prop="content">
                    <Input v-model="editingPost.content" type="textarea" :autosize="{minRows: 4,maxRows: 10}"
                           placeholder="请输入...">
                    </Input>
                </Form-item>

                <Form-item>
                    <Button class="r" type="primary" @click="handleSubmit('editingForm')">提交</Button>
                </Form-item>
            </Form>
            <div slot="footer"></div>
        </Modal>
        <div class="ivu-article">
            <h1>文章列表</h1>
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
                <div class="tr m-b-15">
                    <Button type="primary" @click="add">新增</Button>
                </div>
            </div>
            <Table height="500" border :columns="columns2" :data="postsList" class="w-100 m-b-15"></Table>
            <div class="fix">
                <Page :total="count" :page-size="pageSize" @on-change="changePage" class="r"></Page>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
  import QiniuUpload from '../common/qiniuUpload.vue'
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'

  export default{
    components: {
      QiniuUpload,
    },
    data() {
      return {
        currentUserData: null,
        pageSize: 10,
        count: 0,
        thumbnails: [],
        editing: false,
        saving: false,
        editingPost: {},
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
          },
          {
            title: '用户名',
            key: 'username',
            width: 100,
          },
          {
            title: '内容',
            key: 'content',
            width: 300,
          },
          {
            title: '图片张数',
            key: 'picNum',
            width: 120,
            sortable: true,
          },
          {
            title: '最后更新',
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
        postsList: [],
      }
    },
    methods: {
      deleteFile(index) {
        this.thumbnails.splice(index, 1)
      },
      query() {
        const userQuery = new AV.Query('Posts')
        const createdByIdQuery = new AV.Query('Posts')
        const contentQuery = new AV.Query('Posts')
        userQuery.contains('createdBy.username', this.formItem.input)
        createdByIdQuery.contains('createdById', this.formItem.input)
        contentQuery.contains('content', this.formItem.input)
        return AV.Query.or(userQuery, createdByIdQuery, contentQuery)
      },
      clear() {
        this.formItem.input = ''
      },
      search() {
        this.postsList = []
        const posts = this.query()
        posts.descending('updatedAt').limit(this.pageSize).find()
          .then((res) => {
            this.postsList = _.map(res, (item) => {
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
              obj.picNum = obj.files.length
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
      add() {
        this.editing = true
        this.thumbnails = []
        this.editingPost = {
          content: null,
          status: 1,
        }
      },
      changePage(page) {
        const posts = this.queryPosts()
        posts.descending('createdAt').limit(this.pageSize).skip(page * this.pageSize - this.pageSize).find()
          .then((res) => {
            this.postsList = _.map(res, (item) => {
              const obj = item.toJSON()
              console.log(obj)
              obj.username = obj.createdBy.username
              obj.formatStatus = this.formatStatus(obj.status)
              console.log(obj.formatStatus)
              obj.status = _.toNumber(obj.status)
              obj.picNum = obj.files.length
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
            console.log(this.postsList[index].objectId)
            const dealId = this.postsList[index].objectId
            const todo = AV.Object.createWithoutData('Posts', dealId)
            todo.destroy().then((success) => {
              console.log(success)
              this.$Message.info('删除成功！')
              this.postsList.splice(index, 1)
              console.log(this.postsList.toJSON())
            }, (error) => {
              console.log(error)
            })
          },
        })
      },
      show(index) {
        this.$Modal.info({
          title: '图文详情',
          content: `
            <div><span class="c-g9">用户名：</span>${this.postsList[index].username}</div>
            <div><span class="c-g9">留言时间：</span>${this.postsList[index].formatUpdatedAt || '空'}</div>
            <div><span class="c-g9">图文状态：</span>${this.postsList[index].formatStatus}</div>
            <div><span class="c-g9">文章内容：</span>${this.postsList[index].content || '空'}</div>
          <div><span class="c-g9">图片张数：</span>${this.postsList[index].picNum || '空'}</div>
          <div><span class="c-g9">图片详情：</span><div v-for="item in ${this.postsList[index].files}"><img src="item"></div></div>
          `,
        })
      },
      edit(index) {
        this.editing = true
        this.editingPost = this.postsList[index]
        this.editingPost.status = 1
        console.log('this.editingPost', this.editingPost)
        this.thumbnails = this.postsList[index].files
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.editingPost && this.editingPost.objectId) {
              this.saving = true
              const modelPost = this.modelUpdate('Posts', this.editingPost.objectId)
              modelPost.save({
                files: this.thumbnails,
                status: _.toNumber(this.editingPost.status),
                content: this.editingPost.content,
                createdBy: this.currentUserData,
                createdById: this.currentUserData.objectId,
              }).then((res) => {
                const obj = res.toJSON()
                console.log('修改', obj)
                this.$Message.success('操作成功')
                this.editing = false
                this.saving = false
                obj.picNum = this.thumbnails.length
                obj.username = obj.createdBy.username
                obj.formatStatus = this.formatStatus(obj.status)
                obj.formatUpdatedAt = this.dateFormat(new Date(), 'L')
                this.postsList = _.map(this.postsList, (item) => {
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
              this.saving = true
              const modelPost = this.modelPosts()
              modelPost.save({
                files: this.thumbnails,
                status: _.toNumber(this.editingPost.status),
                content: this.editingPost.content,
                createdBy: this.currentUserData,
                createdById: this.currentUserData.objectId,
              }).then((res) => {
                const obj = res.toJSON()
                console.log('新增', obj)
                this.editing = false
                this.saving = false
                obj.picNum = this.thumbnails.length
                obj.username = obj.createdBy.username
                obj.formatStatus = this.formatStatus(obj.status)
                obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
                this.postsList = [obj, ...this.postsList]
                this.$Message.success('操作成功')
              }).catch((err) => {
                console.log('err', err)
                this.$Message.error('出错啦')
              })
            }
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
      uploadComplete(status, result) {
        if (status === 200) {
          this.thumbnails.push(`http://oo6dayj.bt.cloddn.com/${result.key}`)
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
        const posts = this.queryPosts()
        posts.count().then((res) => {
          this.count = res
          console.log('this.count', this.count)
        })
        posts.descending('createdAt').limit(this.pageSize).find().then((res) => {
          this.postsList = _.map(res, (item) => {
            const obj = item.toJSON()
            obj.username = obj.createdBy.username
            obj.formatStatus = this.formatStatus(obj.status)
            obj.picNum = obj.files.length
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
