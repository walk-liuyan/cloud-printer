<template>
  <div>
    <Modal
        v-model="editing"
        :loading="saving"
        title="编辑用户资料">
      <div class="upload-preview tc m-b-20" v-if="thumbnail">
        <figure>
          <img :src="`${thumbnail}?imageView2/1/w/100/h/100/interlace/0/q/100`" class="rounded bd-blue" />
        </figure>
        <div class="tc">
          <Button type="primary" @click="thumbnail = false">修改头像</Button>
        </div>
      </div>
      <QiniuUpload :multiple="false" @complete="uploadComplete" ref="qiniuUpload" class="m-b-20" v-else>
        <a></a>
      </QiniuUpload>
      <Form :model="editingUser" ref="editingUser" :label-width="80" :rules="userProfileRules">
        <Form-item label="昵称" prop="nickName">
          <Input v-model="editingUser.nickName" placeholder="请输入">
          </Input>
        </Form-item>
        <Form-item label="新字段" prop="whoIsyourDaddy">
          <Input v-model="editingUser.whoIsyourDaddy" placeholder="请输入">
          </Input>
        </Form-item>
        <Form-item label="邮箱" prop="email">
          <Input v-model="editingUser.email" placeholder="请输入">
          </Input>
        </Form-item>
        <Form-item label="性别" prop="gender">
          <Select v-model="editingUser.gender" placeholder="请选择">
            <Option value="0">保密</Option>
            <Option value="1">男</Option>
            <Option value="2">女</Option>
          </Select>
        </Form-item>
        <Form-item label="出生日期">
          <Row>
            <Col span="24">
            <Date-picker type="date" placeholder="选择日期" v-model="editingUser.birthDay"></Date-picker>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="个性签名" prop="bio">
          <Input v-model="editingUser.bio" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入...">
          </Input>
        </Form-item>
        <Form-item label="收货地址" prop="address">
          <Input v-model="editingUser.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入...">
          </Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSubmit('editingUser')">提交</Button>
        </Form-item>
      </Form>
      <div slot="footer"></div>
    </Modal>
    <div class="ivu-article p-20">
      <h1>用户列表</h1>
      <div class="anchor p-t-20 p-b-10">
        <h2>概述</h2>
      </div>
      <Table height="400" border :columns="columns2" :data="userList" class="w-100 m-b-15"></Table>
      <!--<div class="fix">-->
        <!--<Page :total="100" class="r"></Page>-->
      <!--</div>-->
      <div class="fix">
        <Page :total="count" :page-size="pageSize" @on-change="changePage" class="r"></Page>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'
  import QiniuUpload from '../common/qiniuUpload.vue'

  export default{
    components: {
      QiniuUpload,
    },
    data() {
      return {
        pageSize: 10,
        count: 0,
        saving: false,
        thumbnail: null,
        progress: 0,
        editing: false,
        editingUser: {},
        userProfileRules: {
          nickName: [
            { required: true, message: '请填写用户名', trigger: 'blur' },
            { type: 'string', min: 2, message: '至少两个文字', trigger: 'blur' },
          ],
          whoIsyourDaddy: [
            { required: true, message: '请填写字段内容', trigger: 'blur' },
            { type: 'string', min: 2, max: 8, message: '至少两个文字，最多8个字', trigger: 'blur' },
          ],
          email: [
            { required: true, message: '请填写邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请填写正确的邮箱', trigger: 'blur' },
          ],
          gender: { required: true, message: '必填', trigger: 'blur' },
          bio: { max: 140, message: '最多140个文字', trigger: 'blur' },
          address: { max: 140, message: '最多140个文字', trigger: 'blur' },
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
            width: 200,
            fixed: 'left',
          },
          {
            title: '用户名',
            key: 'username',
            width: 100,
          },
          {
            title: '昵称',
            key: 'nickName',
            width: 100,
          },
          {
            title: '出生日期',
            key: 'formatBirthDay',
            width: 200,
            sortable: true,
          },
          {
            title: '年龄',
            key: 'formatAge',
            width: 100,
          },
          {
            title: '性别',
            key: 'formatGender',
            width: 100,
            sortable: true,
          },
          {
            title: '注册日期',
            key: 'formatCreatedAt',
            width: 200,
            sortable: true,
          },
          {
            title: '签名',
            key: 'bio',
            width: 200,
          },
          {
            title: '地址',
            key: 'address',
            width: 200,
          },
          {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 150,
            render(row, column, index) {
              return `<i-button type="text" size="small" @click="show(${index})">查看</i-button><i-button type="text" size="small" @click="edit(${index})">编辑</i-button>`
            },
          },
        ],
        userList: [],
      }
    },
    methods: {
      changePage(page) {
        console.log(page)
        const userData = new AV.Query('_User')
        userData.descending('createdAt').limit(this.pageSize).skip(page * this.pageSize - this.pageSize).find()
          .then((res) => {
            this.userList = _.map(res, (item) => {
              const objItem = item.toJSON()
              objItem.formatGender = this.formatGender(objItem.gender)
              objItem.formatBirthDay = objItem.birthDay ? this.dateFormat(objItem.birthDay, 'L') : '未填写'
              objItem.formatAge = objItem.birthDay ? this.dateToNow(objItem.birthDay) : '未填写'
              objItem.formatCreatedAt = objItem.createdAt ? this.dateFormat(objItem.createdAt, 'L') : '未填写'
              return objItem
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
            console.log(this.userList[index].objectId)
            const dealId = this.userList[index].objectId
            const todo = AV.Object.createWithoutData('_User', dealId)
            todo.destroy().then((success) => {
              console.log(success)
              this.$Message.info('删除成功！')
            }, (error) => {
              console.log(error)
            })
          },
        })
      },
      show(index) {
        console.log('show', this.userList[index])
        this.$Modal.info({
          title: '用户信息',
          content: `
            <div class="tc m-b-10"><img src="${this.userList[index].avatar}" class="rounded bd-blue img-size"/></div>
            <div><span class="c-g9">objectId：</span>${this.userList[index].objectId}</div>
            <div><span class="c-g9">用户名：</span>${this.userList[index].username}</div>
            <div><span class="c-g9">昵称：</span>${this.userList[index].nickName || '未填写'}</div>
            <div><span class="c-g9">出生日期：</span>${this.userList[index].formatBirthDay || '未填写'}</div>
            <div><span class="c-g9">性别：</span>${this.userList[index].formatGender || '未填写'}</div>
            <div><span class="c-g9">注册日期：</span>${this.userList[index].formatCreatedAt}</div>
            <div><span class="c-g9">签名：</span>${this.userList[index].bio || '未填写'}</div>
            <div><span class="c-g9">地址：</span>${this.userList[index].address || '未填写'}</div>
          `,
        })
      },
      edit(index) {
        this.editing = true
        this.editingUser = this.userList[index]
        this.editingUser.gender = _.toString(this.userList[index].gender)
        this.editingUser.bio = this.editingUser.bio || null
        this.editingUser.address = this.editingUser.address || null
        this.thumbnail = this.editingUser.avatar
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log('this.editingUser', this.editingUser)
            this.saving = true
            const modelUser = this.modelUpdate('_User', this.editingUser.objectId)
            modelUser.save({
              nickName: this.editingUser.nickName,
              whoIsyourDaddy: this.editingUser.whoIsyourDaddy,
              email: this.editingUser.email,
              gender: _.toNumber(this.editingUser.gender),
              birthDay: Moment(this.editingUser.birthDay).valueOf(),
              bio: this.editingUser.bio,
              address: this.editingUser.address,
            })
            this.editing = false
            this.saving = false
            this.$Message.success('提交成功!')
            this.editingUser.formatGender = this.formatGender(_.toNumber(this.editingUser.gender))
            this.editingUser.formatBirthDay = this.editingUser.birthDay ? this.dateFormat(this.editingUser.birthDay, 'L') : '未填写'
            this.editingUser.formatAge = this.editingUser.birthDay ? this.dateToNow(this.editingUser.birthDay) : '未填写'
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
      uploadComplete(status, result) {
        if (status === 200) {
          const modelUser = this.modelUpdate('_User', this.editingUser.objectId)
          modelUser.save({
            avatar: `http://oo6bhdayj.bkt.clouddn.com/${result.key}?imageView2/1/w/100/h/100/interlace/0/q/100`,
          })
          this.thumbnail = `http://oo6bhdayj.bkt.clouddn.com/${result.key}?imageView2/1/w/100/h/100/interlace/0/q/100`
          this.editingUser.avatar = this.thumbnail
        } else {
          this.$Message.error('出错了!')
        }
      },
    },
    created() {
      if (this.currentUser()) {
        const query = new AV.Query('_User')
        query.count().then((res) => {
          this.count = res
          console.log('this.count', this.count)
        })
        query.descending('createdAt').limit(this.pageSize).find().then((res) => {
          this.userList = _.map(res, (item) => {
            const objItem = item.toJSON()
            objItem.formatGender = this.formatGender(objItem.gender)
            objItem.formatBirthDay = objItem.birthDay ? this.dateFormat(objItem.birthDay, 'L') : '未填写'
            objItem.formatAge = objItem.birthDay ? this.dateToNow(objItem.birthDay) : '未填写'
            objItem.formatCreatedAt = objItem.createdAt ? this.dateFormat(objItem.createdAt, 'L') : '未填写'
            return objItem
          })
        })
        .catch((error) => {
          console.log('error', error)
          this.$Message.error('出错了!')
        })
      }
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
