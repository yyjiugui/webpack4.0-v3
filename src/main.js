import $ from 'jquery'
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
/*
一、测试代码分离: 多入口打包, jquery都会被打包各自的bundle中,增加打包体积。
二、问题: 把jquery分别打包到 main.bundle.js和 other.bundle.js。
*/

$(function() {
  $('<div></div>')
    .html('我是main.js')
    .appendTo('body')
})

/*
一、动态导入最大的好处是实现了懒加载，用到哪个模块才会加载哪个模块，
二、可以提高SPA应用程序的首屏加载速度，Vue、React、Angular框架的路由懒加载原理一样
*/
// function getComponent() {
//   return import('jquery').then(({ default: $ }) => {
//     return $('<div></div>').html('我是文本')
//   })
// }

/*
采用动态导入,使用SplitChunksPlugin的默认配置 chunks: async 只对异步加载的模块进行拆分，可选值还有all | initial
效果: 页面一加载不会导入jquery库,点击按钮时导入。 动态导入自动会代码分割 运行 npm run build 查看打包结果
*/

// window.onload = function() {
//   document.getElementById('btn').onclick = function() {
//     getComponent().then(component => {
//       component.appendTo('body')
//     })
//   }
// }

import moment from 'moment'
// 因为忽略了插件的语言包 new webpack.IgnorePlugin(/\.\/locale/, /moment/) 手动引入一下语言包
import 'moment/locale/zh-cn'
// 设置汉语语言包
moment.locale('zh-CN')
const calendar = moment()
  .subtract(6, 'days')
  .calendar()

// 构建时间减少 1000ms
console.log(calendar)
