const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const webpack = require('webpack')

// 开启css的压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

// 开发环境配置
module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/prod.env'),
      testenv: '"我是生产环境"'
    }),
    new OptimizeCSSAssetsPlugin({})
  ]
})
