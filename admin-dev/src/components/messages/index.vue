<template>
  <div>
    <Modal
            v-model="editing"
            :loading="saving"
            title="编辑留言">
      <Form :model="editingMsg" ref="editingForm" :label-width="80" :rules="editingRules">
        <Form-item label="状态" prop="status">
          <Input v-model="editingMsg.status" placeholder="请输入">
          </Input>
        </Form-item>
        <Form-item label="留言内容" prop="content">
          <Input v-model="editingMsg.content" type="textarea" :autosize="{minRows: 4,maxRows: 10}" placeholder="请输入...">
          </Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSubmit('editingForm')">提交</Button>
        </Form-item>
      </Form>
      <div slot="footer"></div>
    </Modal>
    <div class="ivu-article p-20">
      <h1>反馈意见列表</h1>
      <div class="tr m-b-15">
        <Button type="primary" @click="add">新增</Button>
      </div>
      <Table height="600" border :columns="columns2" :data="msgList" class="w-100 m-b-15"></Table>
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
        editingMsg: {},
        editingRules: {
          status: { required: true, trigger: 'blur' },
          content: { required: true, max: 500, message: '最多500个文字', trigger: 'blur' },
        },
        formItem: {
          input: '',
          select: '',
          radio: 'male',
          checkbox: [],
          date: '',
          time: '',
          textarea: '',
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
            width: 150,
          },
          {
            title: '昵称',
            key: 'nickName',
            width: 150,
          },
          {
            title: '最后更新',
            key: 'formatUpdatedAt',
            width: 150,
            sortable: true,
          },
          {
            title: '内容',
            key: 'content',
            width: 300,
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
        msgList: [],
      }
    },
    methods: {
      changePage(page) {
        const messages = this.queryMessages()
        const currentPageSize = page * this.pageSize
        messages.descending('createdAt').limit(this.pageSize).skip(currentPageSize - this.pageSize).find()
        .then((res) => {
          this.msgList = _.map(res, (item) => {
            const obj = item.toJSON()
            obj.username = obj.createdBy.username
            obj.nickName = obj.createdBy.nickName
            obj.formatStatus = this.formatStatus(obj.status)
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
            console.log(this.msgList[index].objectId)
            const dealId = this.msgList[index].objectId
            const todo = AV.Object.createWithoutData('Messages', dealId)
            todo.destroy().then((success) => {
              console.log(success)
              this.$Message.info('删除成功！')
              this.msgList.splice(index, 1)
              console.log(this.msgList.toJSON())
            }, (error) => {
              console.log(error)
            })
          },
        })
      },
      show(index) {
        this.$Modal.info({
          title: '留言详情',
          content: `
            <div><span class="c-g9">用户名：</span>${this.msgList[index].username}</div>
            <div><span class="c-g9">昵称：</span>${this.msgList[index].nickName || '空'}</div>
            <div><span class="c-g9">留言时间：</span>${this.msgList[index].formatCreatedAt || '空'}</div>
            <div><span class="c-g9">内容：</span>${this.msgList[index].content || '空'}</div>
          `,
        })
      },
      edit(index) {
        this.editing = true
        this.editingMsg = this.msgList[index]
      },
      add() {
        this.editing = true
        this.editingMsg = {
          content: null,
          status: '1',
        }
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.editingMsg && this.editingMsg.objectId) {
              this.saving = true
              const modelMsg = this.modelUpdate('Messages', this.editingMsg.objectId)
              const user = this.currentUser()
              modelMsg.save({
                status: this.editingMsg.status,
                content: this.editingMsg.content,
                createdBy: user,
                createdById: user.objectId,
              }).then((res) => {
                const obj = res.toJSON()
                console.log('修改', obj)
                this.$Message.success('操作成功')
                this.editing = false
                this.saving = false
                obj.username = obj.createdBy.username
                obj.nickName = obj.createdBy.nickName
                obj.formatStatus = this.formatStatus(obj.status)
                obj.formatUpdatedAt = this.dateFormat(new Date(), 'L')
                this.msgList = _.map(this.msgList, (item) => {
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
              const modelMsg = this.modelMsg()
              const user = this.currentUser()
              modelMsg.save({
                status: this.editingMsg.status,
                content: this.editingMsg.content,
                createdBy: user,
                createdById: user.objectId,
              }).then((res) => {
                const obj = res.toJSON()
                console.log('新增', obj)
                this.editing = false
                this.saving = false
                obj.username = obj.createdBy.username
                obj.nickName = obj.createdBy.nickName
                obj.formatStatus = this.formatStatus(obj.status)
                obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
                this.msgList = [obj, ...this.msgList]
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
    },
    created() {
      if (this.currentUser()) {
        const messages = this.queryMessages()
        messages.count().then((res) => {
          this.count = res
          console.log('this.count', this.count)
        })
        messages.descending('createdAt').limit(this.pageSize).find()
        .then((res) => {
          this.msgList = _.map(res, (item) => {
            const obj = item.toJSON()
            obj.username = obj.createdBy.username
            obj.nickName = obj.createdBy.nickName
            obj.formatStatus = this.formatStatus(obj.status)
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
