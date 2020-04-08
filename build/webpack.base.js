const path = require('path')
// 引入html插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// VueLoader插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const webpack = require('webpack')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 插件作用: 每次打包 删除dist目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  optimization: {
    /*
  	 SplitChunksPlugin配置参数 该节点下有很多webpack的默认配置
		 https://www.webpackjs.com/plugins/split-chunks-plugin/
   	*/
    splitChunks: {
      chunks: 'all', // 只对异步加载的模块进行拆分，可选值还有all | initial
      minSize: 30000, // 模块最少大于30KB才拆分
      maxSize: 0, // 模块大小无上限，只要大于30KB都拆分
      minChunks: 1, // 模块最少引用一次才会被拆分
      maxAsyncRequests: 5, // 按需加载时并行请求的最大数量。最大不能超过5,超过5的部分不拆分
      maxInitialRequests: 3, // 入口点的最大并行请求数。页面初始化时同时发送的请求数量最大不能超过3,超过3的部分不拆分
      automaticNameDelimiter: '~', // 默认的连接符
      name: true, // 拆分的chunk名,设为true表示根据模块名和CacheGroup的key来自动生成,使用上面连接符连接
      cacheGroups: {
        // 缓存组配置,上面配置读取完成后进行拆分,如果需要把多个模块拆分到一个文件,就需要缓存,所以命名为缓存组
        vendors: {
          // 自定义缓存组名
          test: /[\\/]node_modules[\\/]/, // 检查node_modules目录,只要模块在该目录下就使用上面配置拆分到这个组
          priority: -10 // 权重-10,决定了哪个组优先匹配,例如node_modules下有个模块要拆分,同时满足vendors和default组,此时就会分到vendors组,因为-10 > -20
        },
        default: {
          // 默认缓存组名
          minChunks: 2, // 最少引用两次才会被拆分
          priority: -20, // 权重-20
          reuseExistingChunk: true // 如果主入口中引入了两个模块,其中一个正好也引用了后一个,就会直接复用,无需引用两次
        }
      }
    }
  },
  // // webpack不只是可以打包单页面应用  entry配置多入口可以打包多页面应用的(如果我们使用的vue框架这种方式不常用的 使用动态导入实现代码分离)
  // entry: {
  //   main: './src/main.js',
  //   other: './src/other.js'
  // },
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '..', './dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  module: {
    noParse: /jquery|bootstrap/,
    rules: [
      // webpack只理解JavaScript文件
      {
        test: /\.css$/, // webpack在读取loader时 从右到左以管道的方式链式调用
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] // css-loader解析css文件 style-loader: 动态创建style标签放到dom节点中,使其生效
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          'postcss-loader'
        ]
        // 通过less-loader转化为css文件 ---> css-loader再处理less-loader转化为的css文件 --> 然后style-loader将解析后的结果 放到html中
      },
      {
        // 处理图片 url路径形式引入的图片 *** url-loader封装了file-loader 具有比file-loader更高级的功能 ***
        test: /\.(png|jgp|gif)$/,
        use: [
          {
            loader: 'url-loader', // 允许你有条件地将文件转换为内联的 base-64 URL (当文件小于给定的阈值)，这会减少小文件的 HTTP 请求数。
            options: {
              limit: 2 * 1024, // 建议5kb为边界
              // 执行 npm run build默认打包出来的资源文件缺点: 1、打包在了项目根目录中 2、文件名字是哈希值
              outputPath: 'img', // 解决打包目录: 参考vue-cli打包出来的目录
              name: '[name]-[hash:5].[ext]' // 解决打包之后的文件名全部是hash值
            }
          }
        ]
      },
      {
        // 处理字体图标
        test: /\.(woff|woff2|ttf|svg|eot)$/,
        use: [
          {
            loader: 'file-loader', // 可以指定要复制和放置资源文件的位置，以及如何使用版本哈希命名以获得更好的缓存。
            options: {
              outputPath: 'fonts',
              name: '[name]-[hash:5].[ext]'
            }
          }
        ]
      }, // 处理单文件组件
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: /(node_modules|bower_components)/
      },
      {
        // 处理html，支持直接在html中使用img标签加载图片
        test: /\.(htm|html)$/,
        loader: 'html-withimg-loader'
      }
    ]
  },
  plugins: [
    // 这个插件默认生成一个全新html文件(在内存中存在 或者执行npm run build  就是打包之后的index.html文件)，public/index/html文件是一个会被html-webpack-plugin 处理的模板(Vue-cli内容)
    // https://www.webpackjs.com/guides/output-management/#%E8%AE%BE%E5%AE%9A-htmlwebpackplugin webpack该插件详细解释
    new HtmlWebpackPlugin({
      // 现在用户打开浏览器默认访问的就是这个html文件,而且自动的引入了打包好的js文件
      title: 'webpack',
      filename: 'index.html',
      template: './public/index.html'
    }),
    new VueLoaderPlugin(), // 将库自动加载到每个模块
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jQuerytest: 'jquery'
    }), // mini-css-extract-plugin是用于将CSS提取为独立的文件的插件，对每个包含css的js文件都会创建一个CSS文件，支持按需加载css
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CleanWebpackPlugin(),
    // moment ./locale
    new webpack.IgnorePlugin(/\.\/locale/, /moment/)
  ]
}
