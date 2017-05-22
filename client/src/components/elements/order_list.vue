<template>
    <div>
        <group class="c-black" v-for="item in currentOrderList">
            <router-link :to="`/order_detail/${item.objectId}`">
                <cell title="订单ID" class="fz-12 c-black"><span class="c-black">{{item.objectId}}</span></cell>
                <cell :title="item.formatUpdatedAt" class="fz-12 c-g9">{{item.formatState }}</cell>
            </router-link>
        </group>
    </div>
</template>
<script>
  import { Panel, Group, Radio, Cell, Divider, Card } from 'vux'
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'
  import FiltersMixins from '../../assets/js/filters-mixins'

  export default {
    components: {
      Panel,
      Group,
      Radio,
      Cell,
      Divider,
      Card,
    },
    data() {
      return {
        currentOrderList: [],
      }
    },
    created() {
      const currentUser = AV.User.current().toJSON()
      console.log('currentUserId', currentUser.objectId)
      const orderList = this.queryOrderList()
      console.log('orderList', orderList)
      orderList.equalTo('createdById', currentUser.objectId)
      orderList.find().then((orderListRes) => {
        this.currentOrderList = _.map(orderListRes, (item) => {
          const obj = item.toJSON()
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
    mixins: [FnMixins, ModelMixins, FiltersMixins],
  }
</script>
