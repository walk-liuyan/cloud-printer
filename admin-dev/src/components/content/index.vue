<template>
  <Row>
    <Col span="4">
      <Menu active-name="1" width="auto" style="height: 100vh;">
        <Menu-group title="内容">
          <Menu-item name="1" @click.native="goToLink('/content/articles')">
            <Icon type="document-text"></Icon>
            文章管理
          </Menu-item>
          <Menu-item name="2" @click.native="goToLink('/content/comments')">
            <Icon type="chatbubbles"></Icon>
            评论管理
          </Menu-item>
        </Menu-group>
        <Menu-group title="商城">
          <Menu-item name="3" @click.native="goToLink('/content/products')">
            <Icon type="heart"></Icon>
            商品管理
          </Menu-item>
        </Menu-group>
      </Menu>
    </Col>
    <Col span="20">
      <div class="p-20">
        <transition name="fade-fast">
          <router-view></router-view>
        </transition>
      </div>
    </Col>
  </Row>
</template>
<script type="text/babel">
  import FnMixins from '../../assets/js/fn-mixins'

  export default{
    mixins: [FnMixins],
  }
</script>
