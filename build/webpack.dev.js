const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const webpack = require('webpack')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

// 生产环境配置
module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    hot: true, // 开启 模块热替换
    port: 3000, //指定端口号
    open: true,
    compress: true // 开启zip压缩服务
  },
  devtool: 'inline-source-map',
  plugins: [
    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env'),
      testenv: '"我是开发环境"'
    }),
    new HardSourceWebpackPlugin({
      cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
      configHash: function(webpackConfig) {
        return require('node-object-hash')({ sort: false }).hash(webpackConfig)
      },
      environmentHash: {
        root: process.cwd(),
        directories: [],
        files: ['package-lock.json', 'yarn.lock']
      },
      info: {
        mode: 'development',
        level: 'debug'
      }
    })
  ]
})
