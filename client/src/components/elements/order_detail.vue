<template>
    <div>
        <group>
            <card>
                <div slot="content" class="c-black card-padding" v-for="item in currentOrderItem">
                    <p class="h30 fz-14">下单日期：{{item.formatUpdatedAt}}</p>
                    <p class="h30 fz-14">订单：{{item.objectId}}</p>
                    <p class="h30 fz-14">商品状态：{{item.formatState}}</p>
                    <p class="h30 fz-14" >单号：{{item.deliveryCode}}</p>
                    <p class="h30 fz-14">手机号码：{{item.createdBy.mobilePhoneNumber}}</p>
                    <p class="h30 fz-14">地址：{{item.address}}</p>
                </div>
            </card>
        </group>
        <x-button v-if="btnOpen" type="primary" class="h30 rounded-4x m-b-10 m-t-10" style="width: 50%"
                  @click.native="receiptGoods">确认收货
        </x-button>
    </div>
</template>
<script>
  import { Card, XButton, Group } from 'vux'
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'

  export default {
    components: {
      Card, XButton, Group,
    },
    data() {
      return {
        btnOpen: null,
        currentOrderItem: null,
        objectId: null,
      }
    },
    methods: {
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
      receiptGoods() {
        const modelOrder = this.modelUpdate('Orders', this.objectId)
        modelOrder.save({
          status: 3,
        })
        this.showPluginAuto('宝宝，收到货啦！')
        this.btnOpen = null
        console.log(this.currentOrderItem[0].formatState)
        this.currentOrderItem[0].formatState = '交易成功'
      },
    },
    created() {
      const orderID = this.$route.params.objectId
      console.log('orderID', orderID)
      this.objectId = orderID
      const orderList = this.queryOrderList()
      console.log('orderList', orderList)
      orderList.equalTo('objectId', orderID)
      orderList.find().then((orderListRes) => {
        this.currentOrderItem = _.map(orderListRes, (item) => {
          const obj = item.toJSON()
          if (obj.deliveryCode) {
            if (obj.status === 3) {
              this.btnOpen = null
            } else {
              this.btnOpen = obj.deliveryCode
            }
          } else {
            this.btnOpen = null
          }
          obj.formatState = this.formatState(obj.status)
          obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
          console.log('obj.data', obj)
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

<style scoped lang="less">
    @import '~vux/src/styles/1px.less';

    .card-padding {
        padding: 15px;
    }

</style>
