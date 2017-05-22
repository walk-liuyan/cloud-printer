<template>
  <div>
    <Modal
            v-model="editing"
            :loading="saving"
            title="编辑订单">
      <div class="fix p-l-10 p-r-10" v-if="openLoad">
        <div class="upload-preview tc m-b-20 l">
          <figure>
            <img :src="`${thumbnail}?imageView2/1/w/100/h/100/interlace/0/q/100`" class="rounded bd-blue m-r-5" v-for="thumbnail in thumbnails"/>
          </figure>
        </div>
        <QiniuUpload :multiple="true" @complete="uploadComplete" ref="qiniuUpload" class="l">
          <a></a>
        </QiniuUpload>
      </div>
      <div class="m-b-10"></div>
      <Form :model="editingOrders" ref="editingForm" :label-width="80" :rules="editingRules">
        <Form-item label="订单状态" prop="status">
          <Input v-model="editingOrders.status" placeholder="请输入">
          </Input>
        </Form-item>
        <Form-item label="订单内容" v-if="editingOrders.currentGoods">
          <Input v-model="editingOrders.currentGoods"  placeholder="请输入...">
          </Input>
        </Form-item>
        <Form-item label="订单单号">
          <Input v-model="editingOrders.deliveryCode" type="textarea" placeholder="请输入...">
          </Input>
        </Form-item>
        <Form-item label="订单地址" prop="address">
        <Input v-model="editingOrders.address" type="textarea" :autosize="{minRows: 4,maxRows: 10}" placeholder="请输入...">
        </Input>
      </Form-item>
        <Form-item>
          <Button class="r" type="primary" @click="handleSubmit('editingForm')">提交</Button>
        </Form-item>
      </Form>
      <div slot="footer"></div>
    </Modal>
    <div class="ivu-article p-20">
      <h1>订单列表</h1>
      <div>
        <div class="hr"></div>
        <Form :model="formItem" ref="formInline" :label-width="80" inline>
          <Form-item label="信息检索">
            <Input v-model="formItem.input" placeholder="电话、地址、收货人、id"></Input>
          </Form-item>
          <Form-item label="日期控件">
            <Row>
              <Col span="11">
              <Date-picker type="date" placeholder="选择日期" v-model="formItem.date1"></Date-picker>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
              <Date-picker type="date" placeholder="选择日期" v-model="formItem.date2"></Date-picker>
              </Col>
            </Row>
          </Form-item>
        </Form>
        <div class="tr">
          <Button type="ghost" style="margin-left: 8px" @click="clear">取消</Button>
          <Button type="primary" @click="search">筛选</Button>
        </div>
        <div class="hr"></div>
      </div>
      <Table height="310" border :columns="columns2" :data="ordersList" class="w-100 m-b-15"></Table>
      <div class="fix">
        <Page :total="100" class="r"></Page>
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
        openLoad: null,
        currentUserData: null,
        pageSize: 10,
        count: 0,
        editing: false,
        saving: false,
        thumbnails: [],
        editingOrders: {},
        editingRules: {
          address: { required: true, max: 1000, message: '最多1000个文字', trigger: 'blur' },
        },
        formItem: {
          input: '',
          select: '',
          date1: '',
          date2: '',
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
            filters: [
              {
                label: '等待发货',
                value: 1,
              },
              {
                label: '已发货',
                value: 2,
              },
              {
                label: '交易成功',
                value: 3,
              },
            ],
            filterMultiple: false,
            filterMethod(value, row) {
              if (value === 1) {
                return row.formatStatus === '等待发货'
              } else if (value === 2) {
                return row.formatStatus === '已发货'
              } else if (value === 3) {
                return row.formatStatus === '交易成功'
              }
              return ''
            },
          },
          {
            title: '订单类别',
            key: 'currentGoodsType',
            width: 110,
            sortable: true,
          },
          {
            title: '打印机id',
            key: 'currentGoods',
            width: 250,
          },
          {
            title: '照片内容',
            key: 'currentPhotoes',
            width: 250,
          },
          {
            title: '收货人',
            key: 'userName',
            width: 120,
            sortable: true,
          }, {
            title: '电话号码',
            key: 'mobilePhoneNumber',
            width: 120,
            sortable: true,
          }, {
            title: '地址',
            key: 'address',
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
        ordersList: [],
      }
    },
    methods: {
      query() {
        const addressQuery = this.queryOrders()
        const telQuery = this.queryOrders()
        const usernameQuery = this.queryOrders()
        const objectIdQuery = this.queryOrders()
        const startDateQuery = this.queryOrders()
        const endDateQuery = this.queryOrders()
        telQuery.contains('createdBy.mobilePhoneNumber', this.formItem.input)
        usernameQuery.contains('createdBy.username', this.formItem.input)
        addressQuery.contains('address', this.formItem.input)
        objectIdQuery.contains('objectId', this.formItem.input)
        startDateQuery.greaterThanOrEqualTo('createdAt', new Date(this.formItem.date1))
        endDateQuery.lessThan('createdAt', new Date(this.formItem.date2))
        AV.Query.and(startDateQuery, endDateQuery)
        return AV.Query.or(telQuery, usernameQuery, objectIdQuery)
      },
      clear() {
        this.formItem.input = ''
      },
      search() {
        this.commentsList = []
        const posts = this.query()
        posts.descending('updatedAt').limit(this.pageSize).find().then((res) => {
          this.ordersList = _.map(res, (item) => {
            const obj = item.toJSON()
            console.log(obj.goods)
            obj.userName = obj.createdBy.username
            obj.mobilePhoneNumber = obj.createdBy.mobilePhoneNumber
            if (obj.goods) {
              obj.currentGoodsType = '打印机'
              obj.currentGoods = obj.goods
            } else {
              obj.currentGoodsType = '照片打印'
              obj.currentGoods = null
              obj.currentPhotoes = obj.photos
            }
            obj.formatStatus = this.formatState(obj.status)
            obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
            console.log(obj)
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
        const orders = this.queryOrders()
        orders.descending('createdAt').limit(this.pageSize).skip(page * this.pageSize - this.pageSize).find()
          .then((res) => {
            this.ordersList = _.map(res, (item) => {
              const obj = item.toJSON()
              if (obj.goods) {
                obj.currentGoodsType = '打印机'
                obj.currentGoods = obj.goods
              } else {
                obj.currentGoodsType = '照片打印'
                obj.currentGoods = obj.photos
              }
              obj.formatStatus = this.formatState(obj.status)
              obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
              console.log(obj)
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
            console.log(this.ordersList[index].objectId)
            const dealId = this.ordersList[index].objectId
            const todo = AV.Object.createWithoutData('Orders', dealId)
            todo.destroy().then((success) => {
              console.log(success)
              this.$Message.info('删除成功！')
              this.ordersList.splice(index, 1)
              console.log(this.ordersList.toJSON())
            }, (error) => {
              console.log(error)
            })
          },
        })
      },
      add() {
        this.editing = true
        this.thumbnails = []
        this.editingOrders = {
          status: '1',
          title: null,
          description: null,
          price: 0,
        }
      },
      edit(index) {
        this.editing = true
        this.editingOrders = this.ordersList[index]
        console.log('this.editingPost', this.editingOrders)
        this.thumbnails = this.ordersList[index].photos
        if (this.ordersList[index].goods === undefined) {
          this.openLoad = 'open'
        } else {
          this.openLoad = null
        }
      },
      show(index) {
        this.$Modal.info({
          title: '订单详情',
          content: `
            <div><span class="c-g9">订单id：</span>${this.ordersList[index].objectId}</div>
            <div><span class="c-g9">收货人信息：</span>${this.ordersList[index].userName}</div>
            <div><span class="c-g9">收货人电话：</span>${this.ordersList[index].mobilePhoneNumber}</div>
            <div><span class="c-g9">收货人地址：</span>${this.ordersList[index].address}</div>
            <div><span class="c-g9">订单状态：</span>${this.ordersList[index].formatStatus || '空'}</div>
            <div><span class="c-g9">订单单号：</span>${this.ordersList[index].deliveryCode || '空'}</div>
            <div><span class="c-g9">订单类别：</span>${this.ordersList[index].currentGoodsType}</div>
            <div><span class="c-g9">打印机id：</span>${this.ordersList[index].currentGoods || '空'}</div>
            <div><span class="c-g9">照片内容：</span>${this.ordersList[index].currentPhotoes || '空'}</div>
          `,
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
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.saving = true
            const modelOrders = this.modelUpdate('Orders', this.editingOrders.objectId)
            modelOrders.save({
              photos: this.thumbnails,
              address: this.editingOrders.address,
              deliveryCode: this.editingOrders.deliveryCode,
              goods: this.editingOrders.currentGoods,
              status: _.toNumber(this.editingOrders.status),
            }).then((res) => {
              const obj = res.toJSON()
              console.log('修改', obj)
              this.$Message.success('修改成功')
              this.editing = false
              this.saving = false
              obj.formatStatus = this.formatState(obj.status)
              obj.formatUpdatedAt = this.dateFormat(new Date(), 'L')
              this.ordersList = _.map(this.ordersList, (item) => {
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
    },
    created() {
      const currentUserData = this.currentUser()
      if (currentUserData) {
        this.currentUserData = currentUserData
        const orders = this.queryOrders()
        orders.count().then((res) => {
          this.count = res
          console.log('this.count', this.count)
        })
        orders.descending('createdAt').limit(this.pageSize).find().then((res) => {
          this.ordersList = _.map(res, (item) => {
            const obj = item.toJSON()
            console.log(obj.goods)
            obj.userName = obj.createdBy.username
            obj.mobilePhoneNumber = obj.createdBy.mobilePhoneNumber
            if (obj.goods) {
              obj.currentGoodsType = '打印机'
              obj.currentGoods = obj.goods
            } else {
              obj.currentGoodsType = '照片打印'
              obj.currentGoods = null
              obj.currentPhotoes = obj.photos
            }
            obj.formatStatus = this.formatState(obj.status)
            obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
            console.log(obj)
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
