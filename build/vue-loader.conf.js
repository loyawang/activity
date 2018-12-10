'use strict'
const utils = require('./utils')
const config = require('../config')
let isProduction = false
if (process.env.NODE_ENV && (process.env.NODE_ENV !== 'development')) {
  isProduction = true
}
console.log('vue-loader.config,process.env.NODE_ENV------------' + process.env.NODE_ENV)
console.log('isProduction--------------------------------------' + isProduction)
const sourceMapEnabled = isProduction ?
  config.build.productionSourceMap :
  config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
