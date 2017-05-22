<template>
  <label class="mo-upload tc">
    <figure class="p-t-10 p-b-10" v-if="thumbnail">
      <img :src="thumbnail"/>
    </figure>
    <div v-else>
      <div class="spin-auto auto p-t-20" v-if="ing">

      </div>
      <div v-else>
        <div class="p-10">
          <div class="p-t-10"></div>
          <i class="fa fa-plus-circle fa-4x c-blue"></i>
        </div>
        <em>选择头像图片</em>
        <input type="file" :accept="accepts" @change="upload">
        <slot></slot>
      </div>
    </div>
  </label>
</template>
<script>
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'

  export default {
    name: 'MoUpload',
    props: {
      accepts: {
        type: String,
        default: 'image/jpeg,image/jpg,image/png,image/gif',
      },
      flag: [String, Number],
      maxSize: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        file: null,
        thumbnail: null,
        ing: false,
      }
    },
    methods: {
      handleEvent(event) {
        this.file = event.target.files[0]
      },
      upload() {
        const file = event.target.files[0]
        const self = this
        const flag = this.flag
        if (file) {
          if (this.maxSize) {
            // todo filter file
          }
          const formData = new FormData()
          formData.append('file', file)
          this.ing = true
          this.genToken().then((token) => {
            formData.append('token', token)
            axios.post('http://up-z2.qiniu.com/', formData).then((response) => {
              const result = response.data
              if (result.hash && result.key) {
                this.ing = false
                self.$emit('complete', 200, result, flag)
                this.thumbnail = `http://oo6bhdayj.bkt.clouddn.com/${result.key}?imageView2/1/w/100/h/100/interlace/0/q/100`
              } else {
                this.$Loading.error()
                this.ing = false
                self.$emit('complete', 500, result, flag)
              }
            })
          })
        }
      },
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
