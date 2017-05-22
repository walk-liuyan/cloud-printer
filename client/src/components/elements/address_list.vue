<template>
    <div>
        <group>
            <div>
                <x-input title="姓名" v-model="nickName" placeholder="请输入昵称"></x-input>
                <x-input title="电话" v-model="mobilePhoneNumber" placeholder="请输入电话"></x-input>
                <x-input title="地址" v-model="address" placeholder="请输入地址"></x-input>
            </div>
        </group>
        <flexbox>
            <flexbox-item>
                <x-button @click.native="handleSubmit()" type="primary" class="h30 rounded-4x m-b-10 m-t-10"
                          style="width:80% ;">保存
                </x-button>
            </flexbox-item>
            <flexbox-item>
                <x-button type="warn" @click.native="deleteText" class="h30 rounded-4x m-b-10 m-t-10"
                          style="width:80% ;">删除
                </x-button>
            </flexbox-item>
        </flexbox>
    </div>
</template>
<script type="text/babel">
  import { XButton, Group, Flexbox, FlexboxItem, Panel, XInput } from 'vux'
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'

  export default {
    components: {
      XButton, Group, Flexbox, FlexboxItem, Panel, XInput,
    },
    data() {
      return {
        mobilePhoneNumber: null,
        nickName: null,
        address: null,
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
      handleSubmit() {
        const user = AV.User.current().toJSON()
        console.log('this.currentUser', user.objectId)
        const modelUser = this.modelUpdate('_User', user.objectId)
        modelUser.save({
          mobilePhoneNumber: this.mobilePhoneNumber,
          nickName: this.nickName,
          address: this.address,
        })
        this.showPluginAuto('保存!')
        console.log('this.currentUser', user)
      },
      deleteText() {
        this.mobilePhoneNumber = null
        this.nickName = null
        this.address = null
        const user = AV.User.current().toJSON()
        console.log('this.currentUser', user.objectId)
        const modelUser = this.modelUpdate('_User', user.objectId)
        modelUser.save({
          mobilePhoneNumber: this.mobilePhoneNumber,
          nickName: this.nickName,
          address: this.address,
        })
        this.showPluginAuto('删除成功!')
        console.log('this.currentUser', user)
      },
    },
    created() {
      const currentUser = AV.User.current().toJSON()
      console.log('currentUserMessage', currentUser.objectId)
      const query = AV.Object.createWithoutData('_User', currentUser.objectId)
      query.fetch().then((res) => {
        const resItem = res.toJSON()
        console.log('resItem', resItem)
        this.mobilePhoneNumber = resItem.mobilePhoneNumber
        this.nickName = resItem.nickName
        this.address = resItem.address
      })
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
