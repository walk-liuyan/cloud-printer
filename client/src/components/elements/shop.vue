<template>
    <div>
        <card class="p-b-20" v-if="products">
            <img slot="header" :src="products.pic[0]" class="w-100 db h300 m-b-20">
            <div slot="content" class="card-padding">
                <span style="width: 70%" class="b l tl fz-14 h30">{{products.title}}</span>
                <span class="c-red r fz-14 h30">价格：￥{{products.price}}</span>
            </div>
        </card>

        <div class="p-b-20" v-if="photos">
            <div v-for="item in files" class="m-b-20">
                <img slot="header" :src="item" class="w-100 db h300">
            </div>
            <div slot="content" class="card-padding">
                <span style="width: 70%" class="b l tl fz-14 h30">照片打印</span>
                <span class="c-red r fz-14 h30">张数：{{picNum}}</span>
            </div>
        </div>
        <group title="">
            <X-input class="h30 fz-12" title="寄出地址" v-model="address" placeholder="请输入邮寄地址"></X-input>
            <!-- <cell title="地址">{{address}}</cell>-->
        </group>
        <div class="m-b-20"></div>
        <x-button @click.native="handleSubmit()" type="primary" class="h30 rounded-4x m-b-10 m-t-10"
                  style="width: 50%">提交
        </x-button>
    </div>
</template>
<script>
  import { Divider, Card, XButton, Group, Cell, XInput } from 'vux'
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'

  export default {
    components: {
      Divider, Card, XButton, Group, Cell, XInput,
    },
    data() {
      return {
        products: null,
        photos: null,
        files: null,
        picNum: null,
        address: null,
        type: null,
        objectId: null,
        currentUserData: null,
      }
    },
    methods: {
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
      handleSubmit() {
          /* 点击下单的时候，会判断当前是否有地址信息存在*/
        if (this.address) {
            /* 定义ordersObject等于新增订单方法返回的内容*/
          const ordersObject = this.modelOrders()
            /* 进行判断，传过来的类型是1还是2，1为打印机，2为照片打印，当类型是1是，保存的内容是商品id，以及购买者信息*/
          if (this.type === 1) {
            ordersObject.save({
              createdById: this.currentUserData.objectId,
              createdBy: this.currentUserData,
              goods: this.objectId,
              address: this.address,
            }).then((res) => {
              this.showPluginAuto('下单成功')
              console.log('下单成功', res)
              this.$router.push('/order_list')
            }).catch((err) => {
              console.log('err', err)
              this.showPluginAuto('出错啦')
            })
          } else {
              /* 这里是照片打印页面的存储数据*/
            ordersObject.save({
              createdById: this.currentUserData.objectId,
              createdBy: this.currentUserData,
              photos: this.files,
              address: this.address,
            }).then((res) => {
              this.showPluginAuto('下单成功')
              console.log('下单成功', res)
              this.$router.push('/order_list')
            }).catch((err) => {
              console.log('err', err)
              this.showPluginAuto('出错啦')
            })
          }
        } else {
          this.showPluginAuto('缺少地址！请去填写地址')
        }
      },
    },
    created() {
      const user = this.currentUser()
      if (user) {
        this.currentUserData = user
          /* 创建user为当前用户信息，将当前用户默认地址赋给本地数据address*/
        this.address = user.address
          /* 获取跳转过来的id和type，用做方法的判断*/
        const productId = this.$route.params.objectId
        this.objectId = productId
        const type = this.$route.params.type
        console.log(productId)
          /* 将类型进行转换，因为传过来的type是字符串类型，需要进行转换成数字类型*/
        this.type = _.toNumber(type)
          /* 当type=1时，去数据库products表中获取相关信息*/
        if (this.type === 1) {
          console.log('productId', productId)
          const productQuery = AV.Object.createWithoutData('Products', productId)
          productQuery.fetch().then((res) => {
            this.products = res.toJSON()
            console.log('products', this.products)
          })
        } else {
            /* 当type=2时，去数据库Posts表中获取相关信息*/
          const postsQuery = AV.Object.createWithoutData('Posts', productId)
          postsQuery.fetch().then((item) => {
            this.photos = item.toJSON()
            this.files = item.toJSON().files
            this.picNum = item.toJSON().files.length
            console.log(this.picNum)
            console.log('posts', this.files)
          })
        }
      } else {
        this.showPluginAuto('宝宝，你需要去登录才能下单哦！')
      }
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>

<style>
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

    .card-padding {
        padding: 15px;
    }
</style>
