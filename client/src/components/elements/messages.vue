<template>
    <div>
        <Divider>我的建议列表</Divider>
        <group>
            <cell  v-for="item in msgList" :title="item.updatedAt | dateFormat('L')" class="fz-12 c-g9">{{item.content || '无'}}</cell>
        </group>
        <div class="m-b-15"></div>
        <Divider>请留下您宝贵的建议</Divider>
        <group>
            <x-textarea v-model="editingMsg.content" placeholder="请填写您的建议" :show-counter="false"
                        :rows="3"></x-textarea>
        </group>
        <group>
        </group>
        <x-button type="primary" @click.native="handleSubmit()" is-link class="h30 rounded-4x m-b-10 m-t-10"
                  style="width: 50%">发送
        </x-button>

    </div>
</template>
<script type="text/babel">
  import { XButton, Group, XTextarea, XInput, Cell, Divider } from 'vux'
  import FnMixins from '../../assets/js/fn-mixins'
  import FiltersMixins from '../../assets/js/filters-mixins'
  import ModelMixins from '../../assets/js/model-mixins'

  export default {
    components: {
      XButton, Group, XTextarea, XInput, Cell, Divider,
    },
    data() {
      return {
        editingMsg: {
          content: null,
        },
        msgList: [],
        currentUserData: null,
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
        }, 4000)
      },
      handleSubmit() {
        /* 点击提交触发的方法，定义messagesObject常量，用户后期添加留言的固定用法*/
        const messagesObject = this.modelMsg()
        /* 定义user为常量，数据为当前用户信息*/
        /* 将新编辑的数据保存进入数据库*/
        messagesObject.save({
          content: this.editingMsg.content,
          createdBy: this.currentUserData,
          createdById: this.currentUserData.objectId,
        }).then((res) => {
          this.showPluginAuto('发布留言成功')
          /* 将新的数据显示在当前页面*/
          this.msgList = [res.toJSON(), ...this.msgList]
          this.editingMsg.content = null
          console.log('发布留言成功', res.toJSON())
        }).catch((err) => {
          console.log('err', err)
          this.showPluginAuto('出错啦')
        })
      },
    },
    created() {
      /* 定义当前用户，如果没有当前用户，将跳转至index*/
      const currentUser = this.currentUser()
      this.currentUserData = currentUser
      console.log('currentUserMessage', currentUser.objectId)
      /* 获取到当前用户的id，将此id进入数据库的messages表进行查找，过滤出该用户所有的留言信息*/
      const messages = this.queryMessages()
      messages.equalTo('createdById', currentUser.objectId)
      messages.find().then((messagesRes) => {
        /* 遍历后将信息给本地数据mgsList*/
        this.msgList = _.map(messagesRes, (item) => {
          return item.toJSON()
        })
      }).catch((err) => {
        console.log('err', err)
        this.showPluginAuto('出错啦')
      })
    },
    mixins: [FnMixins, ModelMixins, FiltersMixins],
  }
</script>
