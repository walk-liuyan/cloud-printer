<template>
    <div>
        <flexbox :gutter="0" style="position: fixed;bottom: 0px;height: 40px;background: white;">
            <flexbox-item>
                <router-link to="/">
                    <div class="flex-demo tc c-black" style="border: none">
                        <i class="fz-14 fa fa-th-list " aria-hidden="true"></i>

                    </div>
                </router-link>
            </flexbox-item>
            <flexbox-item>
                <router-link to="/loader">
                    <div class="flex-demo tc c-black"style="border: none">
                        <i class="fz-26 fa fa-fort-awesome fa-2x" aria-hidden="true"></i>
                    </div>
                </router-link>
            </flexbox-item>
            <flexbox-item>
                <router-link to="/me">
                    <div class="flex-demo tc c-black"style="border: none">
                        <i class="fz-20 fa fa-user fa-lg" aria-hidden="true"></i>
                    </div>
                </router-link>
            </flexbox-item>
        </flexbox>
    </div>
</template>
<script>
  import { Flexbox, FlexboxItem } from 'vux'

  export default {
    components: {
      Flexbox,
      FlexboxItem,
    },
  }
</script>
<style lang="less">
    @import '~vux/src/styles/1px.less';

    .flex-demo {
        background-clip: padding-box;
    }
</style>
