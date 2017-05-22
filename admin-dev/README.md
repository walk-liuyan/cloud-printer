# crp-startkit

> 一个针对pc管理端的脚手架

## 特点
1. 使用airbnb的eslint代码规范检查, 如有提示语法错误,请参考 [http://eslint.org/](http://eslint.org/)
2. package.json中可以定义参数,让webpack载入不同的全局参数,以区分开发和部署的环境,加载的配置文件是[arguments.config.js](arguments.config.js)
3. 使用axios作为ajax请求插件,使用方法没有什么特别的。。。
5. vue-router和vuex已经集成在内
6. 使用了iview作为ui框架,内置大量常用功能,请好好利用! [https://www.iviewui.com](https://www.iviewui.com)
7. 在api-mixins.js中使用了async await , 并且做了错误处理
9. router的组件定义,全部使用异步加载组件
10. 在filters-mixins.js中,已经预先定义了一些常用的方法
13. 使用了图表插件 [echarts](https://github.com/xlsdg/vue-echarts-v3)
11. 使用了ui的less定制主题配色，请参考 [https://www.iviewui.com/docs/guide/theme](https://www.iviewui.com/docs/guide/theme)
12. 自定义样式使用scss，并使用了postcss-loader，使用了插件 [autoprefixer](https://github.com/postcss/autoprefixer)

## 开始开发
1. 根目录下执行 yarn install
2. 根据package.json执行开发环境启动,如 run-script "dev dev"

## 开发遇到了问题
1. 先在各开源组件文档中搜索相关的解决方法，切不可重复造轮子
2. 实在不行就跟我商讨解决办法
3. 切勿在不经过我同意的情况下改动脚手架的功能和编程方式