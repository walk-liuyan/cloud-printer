<template>
  <div>
    <Modal
            v-model="editing"
            :loading="saving"
            title="编辑商品">
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
      <Form :model="editingProducts" ref="editingForm" :label-width="80" :rules="editingRules">
        <Form-item label="状态" prop="status">
          <Input v-model="editingProducts.status" placeholder="请输入">
          </Input>
        </Form-item>
          <Form-item label="商品标题" prop="title">
              <Input v-model="editingProducts.title" type="textarea" placeholder="请输入...">
              </Input>
          </Form-item>
          <Form-item label="商品价格" prop="price">
              <Input-number :min="1" v-model="editingProducts.price"></Input-number>
              </Input>元
          </Form-item>
        <Form-item label="商品描述" prop="description">
          <Input v-model="editingProducts.description" type="textarea" :autosize="{minRows: 4,maxRows: 10}" placeholder="请输入...">
          </Input>
        </Form-item>
        <Form-item>
          <Button class="r" type="primary" @click="handleSubmit('editingForm')">提交</Button>
        </Form-item>
      </Form>
      <div slot="footer"></div>
    </Modal>
    <div class="ivu-article">
      <h1>商品列表</h1>
      <div>
        <div class="hr"></div>
        <Form :model="formItem" ref="formInline" :label-width="80" inline>
          <Form-item label="搜索框：">
            <Input v-model="formItem.input" placeholder="id/价格/标题/内容">
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
      <Table height="200" border :columns="columns2" :data="productsList" class="w-100 m-b-15"></Table>
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
        currentUserData: null,
        pageSize: 10,
        count: 0,
        editing: false,
        saving: false,
        thumbnails: [],
        editingProducts: {},
        editingRules: {
          title: { required: true, max: 60, message: '最多60个文字', trigger: 'blur' },
          description: { required: true, max: 1000, message: '最多1000个文字', trigger: 'blur' },
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
            sortable: true,
          },
          {
            title: '标题',
            key: 'title',
            width: 200,
          },
       /*   {
            title: '描述',
            key: 'description',
            width: 300,
          },*/
          {
            title: '价格',
            key: 'price',
            width: 120,
            sortable: true,
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
        productsList: [],
      }
    },
    methods: {
      deleteFile(index) {
        this.thumbnails.splice(index, 1)
      },
      query() {
        const titleQuery = this.queryProducts()
        const descriptionQuery = this.queryProducts()
        const idQuery = this.queryProducts()
        titleQuery.contains('title', this.formItem.input)
        descriptionQuery.contains('description', this.formItem.input)
        idQuery.contains('objectId', this.formItem.input)
        return AV.Query.or(idQuery, titleQuery, descriptionQuery)
      },
      clear() {
        this.formItem.input = ''
      },
      search() {
        this.productsList = []
        const product = this.query()
        product.descending('updatedAt').limit(this.pageSize).find().then((res) => {
          this.productsList = _.map(res, (item) => {
            const obj = item.toJSON()
            console.log(obj)
            if (obj.status === 1) {
              obj.formatStatus = '正常'
            } else {
              obj.formatStatus = '禁用'
            }
            console.log(obj.formatStatus)
            obj.status = _.toNumber(obj.status)
            obj.picNum = obj.pic.length
            obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
            return obj
          })
        })
      .catch((err) => {
        console.log('err', err)
        this.$Message.error('出错啦')
      })
        product.count().then((res) => {
          this.count = res
        }).catch((err) => {
          console.log('err', err)
          this.$Loading.error()
          this.$Message.error('出错啦')
        })
      },
      changePage(page) {
        const products = this.queryProducts()
        products.descending('createdAt').limit(this.pageSize).skip(page * this.pageSize - this.pageSize).find()
          .then((res) => {
            this.productsList = _.map(res, (item) => {
              const obj = item.toJSON()
              console.log(obj)
              if (obj.status === 1) {
                obj.formatStatus = '正常'
              } else {
                obj.formatStatus = '禁用'
              }
              console.log(obj.formatStatus)
              obj.status = _.toNumber(obj.status)
              obj.picNum = obj.pic.length
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
            console.log(this.productsList[index].objectId)
            const dealId = this.productsList[index].objectId
            const todo = AV.Object.createWithoutData('Products', dealId)
            todo.destroy().then((success) => {
              console.log(success)
              this.$Message.info('删除成功！')
              this.productsList.splice(index, 1)
              console.log(this.productsList.toJSON())
            }, (error) => {
              console.log(error)
            })
          },
        })
      },
      add() {
        this.editing = true
        this.thumbnails = []
        this.editingProducts = {
          status: '1',
          title: null,
          description: null,
          price: 0,
        }
      },
      edit(index) {
        this.editing = true
        this.editingProducts = this.productsList[index]
        console.log('this.editingPost', this.editingProducts)
        this.thumbnails = this.productsList[index].pic
      },
      show(index) {
        this.$Modal.info({
          title: '商品详情',
          content: `
            <div><span class="c-g9">商品id：</span>${this.productsList[index].objectId}</div>
            <div><span class="c-g9">商品状态：</span>${this.productsList[index].formatStatus || '空'}</div>
            <div><span class="c-g9">商品标题：</span>${this.productsList[index].title || '空'}</div>
            <div><span class="c-g9">商品价格：</span>${this.productsList[index].price}</div>
            <div><span class="c-g9">商品描述：</span>${this.productsList[index].description}</div>
            <div><span class="c-g9">商品图片：</span><div class="tc m-b-10"><img src="${this.productsList[index].pic[0]}" class="rounded bd-blue img-size"/></div></div>
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
            if (this.editingProducts && this.editingProducts.objectId) {
              this.saving = true
              const modelProducts = this.modelUpdate('Products', this.editingProducts.objectId)
              modelProducts.save({
                pic: this.thumbnails,
                status: this.editingProducts.status,
                description: this.editingProducts.description,
                price: this.editingProducts.price,
                title: this.editingProducts.title,
              }).then((res) => {
                const obj = res.toJSON()
                console.log('修改', obj)
                this.$Message.success('修改成功')
                this.editing = false
                this.saving = false
                obj.picNum = this.thumbnails.length
                obj.formatStatus = this.formatStatus(obj.status)
                obj.formatUpdatedAt = this.dateFormat(new Date(), 'L')
                this.productsList = _.map(this.productsList, (item) => {
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
              const modelProducts = this.modelProducts()
              modelProducts.save({
                pic: this.thumbnails,
                status: _.toNumber(this.editingProducts.status),
                description: this.editingProducts.description,
                price: this.editingProducts.price,
                title: this.editingProducts.title,
              }).then((res) => {
                const obj = res.toJSON()
                console.log('新增', obj)
                this.editing = false
                this.saving = false
                obj.picNum = this.thumbnails.length
                if (obj.status === 1) {
                  obj.formatStatus = '正常'
                } else {
                  obj.formatStatus = '禁用'
                }
                obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
                this.productsList = [obj, ...this.productsList]
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
      const currentUserData = this.currentUser()
      if (currentUserData) {
        this.currentUserData = currentUserData
        const products = this.queryProducts()
        products.count().then((res) => {
          this.count = res
          console.log('this.count', this.count)
        })
        products.descending('createdAt').limit(this.pageSize).find().then((res) => {
          this.productsList = _.map(res, (item) => {
            const obj = item.toJSON()
            console.log(obj)
            if (obj.status === 1) {
              obj.formatStatus = '正常'
            } else {
              obj.formatStatus = '禁用'
            }
            console.log(obj.formatStatus)
            obj.status = _.toNumber(obj.status)
            obj.picNum = obj.pic.length
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
