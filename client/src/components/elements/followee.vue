<template>
    <div>
        <group v-for="item in followEe" >
            <router-link :to="`/user/${item.objectId}`">
                <cell :title="item.username" style="color: #0D0D0D">
                    <img slot="icon" class=" rounded-x db m-r-5" width="50" height="50" :src="item.avatar">
                    <x-button type="primary" class=" rounded-4x m-b-10 m-t-10 h25 fz-12 tc" style="width: 100%">已关注
                    </x-button>
                </cell>
            </router-link>
        </group>
    </div>
</template>
<script type="text/babel">
  import { Cell, Group, XButton } from 'vux'
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'

  export default {
    components: {
      Group,
      Cell,
      XButton,
    },
    data() {
      return {
        followEe: null,
      }
    },
    methods: {

    },
    created() {
      if (this.currentUser()) {
        const queryFollowEe = this.queryFollowEe()
        queryFollowEe.include('followee')
        queryFollowEe.find().then((followees) => {
          console.log(followees.length)
          this.followEe = _.map(followees, (item) => {
            console.log(item.toJSON())
            return item.toJSON()
          })
        })
      }
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
