<template>
    <div>
        <group v-for="item in follow">
            <router-link :to="`/user/${item.objectId}`">
                <cell :title="item.username" is-link style="color:black">
                    <img slot="icon" class="rounded-x db m-r-5" width="50" height="50" :src="item.avatar">
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
        follow: null,
      }
    },
    methods: {

    },
    created() {
      if (this.currentUser()) {
        const queryFollower = this.queryFollower()
        queryFollower.include('follower')
        queryFollower.find().then((followers) => {
          this.follow = _.map(followers, (item) => {
            console.log('item.toJSON()', item.toJSON())
            return item.toJSON()
          })
        })
      }
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
