<template>
    <div v-loading.body="loading">
        <el-card class="w-100 m-b-15" v-for="item in messageList">
            <h2>{{item.nickName}}</h2>
            <div class="tr">
                <small class="c-g9">{{item.objectId}}</small>
            </div>
            <article>
                {{item.content}}
            </article>
            <div class="tr">
                <small class="c-g9">{{item.createdAt | formatDate('LLL')}}</small>
            </div>
        </el-card>
    </div>
</template>
<script type="text/babel">
  import AV from 'leancloud-storage/dist/av-min'
  import FiltersMixins from '../assets/js/filters-mixins'

  export default{
    data() {
      return {
        messageList: [],
        loading: false,
      }
    },
    created() {
      const messages = new AV.Query('Messages')
      messages.descending('createdAt').find().then((res) => {
        this.messageList = JSON.parse(JSON.stringify(res))
        this.loading = false
      })
    },
    mixins: [FiltersMixins],
  }
</script>
