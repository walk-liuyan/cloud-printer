<template>
    <div class="tc">
        <label class="qiniu-upload tc">
            <div class="spin-auto auto p-t-20" v-if="ing">
                <i class="fa fa-spin fa-spinner"></i>
            </div>
            <div v-else>
                <div class="p-10">
                    <div class="p-t-5"></div>
                    <i class="fa fa-plus-circle fa-3x c-blue"></i>
                </div>
                <em>选择图片</em>
                <input type="file" :accept="accepts" @change="upload" :multiple="multiple">
                <slot></slot>
            </div>
        </label>
    </div>
</template>
<script>
  import ModelMixins from '../../assets/js/model-mixins'

  export default {
    props: {
      accepts: {
        type: String,
        default: 'image/jpeg,image/jpg,image/png,image/gif',
      },
      multiple: [Boolean],
      maxSize: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        file: null,
        ing: false,
        token: null,
      }
    },
    methods: {
      upload(event) {
        const file = event.target.files
        if (file) {
          if (this.maxSize) {
            // todo filter file
          }
          this.ing = true
          this.genToken().then((token) => {
            this.token = token
            _(file).forEach((item) => {
              const formData = new FormData()
              formData.append('file', item)
              formData.append('token', this.token)
              axios.post('http://up-z2.qiniu.com/', formData).then((response) => {
                const result = response.data
                if (result.hash && result.key) {
                  this.ing = false
                  this.$emit('complete', 200, result)
                } else {
                  this.ing = false
                  this.$emit('complete', 500, result)
                  this.$Message.error('出错了!')
                }
              })
            })
          }).catch((nothing, err) => {
            console.log('err', err)
            this.ing = false
            this.$emit('complete', 500)
            this.$Message.error('出错了!')
          })
        }
      },
    },
    mixins: [ModelMixins],
  }
</script>
