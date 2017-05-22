<template>
    <div>
        <group>
            <card>
                <img slot="header" :src="files" class="db w-100 h300">
                <div slot="content" class="card-padding">
                    <span style="width: 70%" class="b l tl fz-14 h30">{{title}}</span>
                    <span class="c-red r fz-14 h30">价格：￥{{price}}</span>
                </div>
            </card>

            <router-link :to="`/shop/1/${objectId}`">
                <x-button type="primary" class="h30 rounded-4x m-b-20 m-t-20" style="width: 50%">购买</x-button>
            </router-link>
            <divider class="m-t-20 fz-14">商品详情</divider>
            <p class="fz-14 c-g9 m-b-10 m-t-10 p-l-10 p-r-10">{{description}}</p>
            <div class="tc m-b-20" v-for="src in pic" >
                <span class="fz-20"><i class="fa fa-spin fa-spinner"></i></span>
                <x-img :src="src" :webp-src="`${src}?type=webp`" @on-success="success" @on-error="error"
                       class="ximg-demo" error-class="ximg-error" :offset="-100"
                       container="#vux_view_box_body"></x-img>
            </div>

        </group>
    </div>
</template>


<script>
  import { Divider, XImg, XButton, Group, Card } from 'vux'

  export default {
    components: {
      Divider, XButton, Group, XImg, Card,
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
        objectId: null,
        files: null,
        title: null,
        price: null,
        pic: null,
        description: null,
      }
    },
    created() {
      const productsId = this.$route.params.objectId
      console.log('productsId', productsId)
      const query = AV.Object.createWithoutData('Products', productsId)
      query.fetch().then((res) => {
        console.log(res.toJSON())
        this.objectId = res.toJSON().objectId
        this.title = res.toJSON().title
        this.price = res.toJSON().price
        this.description = res.toJSON().description
        this.pic = res.toJSON().pic
        this.files = res.toJSON().pic[0]
        console.log('files', this.pic)
      })
    },
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
