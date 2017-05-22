<template>
    <div>
        <group v-for="item in productsList">
            <router-link :to="`/goods_detail/${item.objectId}`">
                <card>
                    <img slot="header" :src="item.pic" style="width:100%;display:block;height:300px">
                    <div slot="content" class="card-padding">
                        <p style="font-size:14px;line-height:1.5;" class="b c-black">{{item.title}}</p>
                        <p style="font-size:14px;line-height:2;" class="c-red">价格：￥{{item.price}}</p>
                        <p style="color:#999;font-size:12px;height: 16px;display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{item.description}}</p>
                    </div>
                </card>

            </router-link>
        </group>
    </div>
</template>

<script>
  import { Divider, Card, Group } from 'vux'
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'

  export default {
    components: {
      Divider, Card, Group,
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
    },
    data() {
      return {
        productsList: [],
        list: [
          'https://o5omsejde.qnssl.com/demo/test1.jpg',
        ],
      }
    },
    created() {
      const products = this.queryProducts()
      console.log('productsList', products)
      products.descending('createdAt').find().then((productsRes) => {
        this.productsList = _.map(productsRes, (item) => {
          const obj = item.toJSON()
          obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
          console.log('currentOrderList photos data:', obj.pic[0].toString())
          obj.pic = obj.pic[0].toString()
          console.log('obj.pic', obj.pic)
          console.log('objList', obj)
          return obj
        })
      }).catch((err) => {
        console.log('err', err)
        this.showPluginAuto('出错啦')
      })
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
