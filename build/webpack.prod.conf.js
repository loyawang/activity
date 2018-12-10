'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpackProdConf = options => {
  // const DirList = {
  //   reachtest: '/reachtest/test_dev/',
  //   reach_dist: '/reach_dist/activity/',
  //   pre_dist: '/pre_dist/activity/',
  //   pro_dist: '/pro_dist/activity/'
  // }
  // const buildAssetsPublicPath = DirList[options.env] || DirList.pro
  // console.log('buildAssetsPublicPath--------------' + buildAssetsPublicPath)
  return merge(baseWebpackConfig, {
    module: {
      rules: utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true,
        usePostCSS: true
      })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
      // path: path.resolve(__dirname, config.build.assetsRoot, options.env), // 打包输出到dist目录对应的环境下
      path: path.resolve(__dirname, config.build.assetsRoot),
      filename: utils.assetsPath('js/[name].[chunkhash].js'),
      chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
      publicPath: config.build.assetsPublicPath
    },
    plugins: [
      // http://vuejs.github.io/vue-loader/en/workflow/production.html
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(options.env)
        }
      }),
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          }
        },
        sourceMap: config.build.productionSourceMap,
        parallel: true
      }),
      // extract css into its own file
      new ExtractTextPlugin({
        filename: utils.assetsPath('css/[name].[contenthash].css'),
        // Setting the following option to `false` will not extract CSS from codesplit chunks.
        // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
        // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
        // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
        allChunks: true,
      }),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSPlugin({
        cssProcessorOptions: config.build.productionSourceMap ? {
          safe: true,
          map: {
            inline: false
          },
          autoprefixer: false
        } : {
          safe: true,
          autoprefixer: false
        }
      }),
      // generate dist index.html with correct asset hash for caching.
      // you can customize output by editing /index.html
      // see https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        favicon: path.resolve(__dirname, '../src/assets/favicon.ico'),
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
      }),
      // keep module.id stable when vendor modules does not change
      new webpack.HashedModuleIdsPlugin(),
      // enable scope hoisting
      new webpack.optimize.ModuleConcatenationPlugin(),
      // split vendor js into its own file
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks(module) {
          // any required modules inside node_modules are extracted to vendor
          return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(
              path.join(__dirname, '../node_modules')
            ) === 0
          )
        }
      }),
      // extract webpack runtime and module manifest to its own file in order to
      // prevent vendor hash from being updated whenever app bundle is updated
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
      }),
      // This instance extracts shared chunks from code splitted chunks and bundles them
      // in a separate chunk, similar to the vendor chunk
      // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
      new webpack.optimize.CommonsChunkPlugin({
        name: 'app',
        async: 'vendor-async',
        children: true,
        minChunks: 3
      }),
      new webpack.optimize.UglifyJsPlugin({
        parallel: {
          cache: true, //  缓存加速
          workers: 4 // 2条进程加速
        },
        sourceMap: false, // 不生产源
        ie8: false,
        ecma: 5,
        // 删除所有的注释
        comments: false,
        compress: {
          // 在UglifyJs删除没有用到的代码时输出警告
          warnings: false,
          // 删除debugger语句
          drop_debugger: true,
          // 删除执行不到的代码
          dead_code: true,
          // foo["bar"] → foo.bar
          properties: true,
          // 链接连续的var语句
          join_vars: true,
          // 删除所有的 `console` 语句
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true
        }
      })

      // copy custom static assets
      // new CopyWebpackPlugin([{
      //   from: path.resolve(__dirname, '../static'),
      //   to: config.build.assetsSubDirectory,
      //   ignore: ['.*']
      // }])
    ]
  })
}

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackProdConf.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackProdConf
