const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    module: ['vue', 'vue-router', 'jquery', 'moment']
  },
  output: {
    filename: '[name]_dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]_dll' // 向外暴露一个全局变量
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_dll',
      path: path.resolve(__dirname, '../dll/manifest.json')
    })
  ]
}
