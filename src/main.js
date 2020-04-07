// import $ from 'jquery'
// $(function() {
//   $('<div></div>')
//     .html('我是main.js')
//     .appendTo('body')
// })

// 测试js优化 动态导入
// 效果: 页面一加载不会导入jquery库,点击按钮时导入。 动态导入自动会代码分割 运行 npm run build 查看打包结果
window.onload = function() {
  document.getElementById('btn').onclick = function() {
    getComponent().then(component => {
      component.appendTo('body')
    })
  }
}
// 动态导入最大的好处是实现了懒加载，用到哪个模块才会加载哪个模块，
// 可以提高SPA应用程序的首屏加载速度，Vue、React、Angular框架的路由懒加载原理一样
function getComponent() {
  return import('jquery').then(({ default: $ }) => {
    return $('<div></div>').html('我是文本')
  })
}
