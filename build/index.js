'use strict'
require('./check-versions')()
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
// 命令行输入的内容
const argvs = process.argv 
const options = {
  env: argvs[2]
}
const envList = {
  reachtest: "开发分支环境",
  reach_dist: '测试主干环境',
  pre_activity: "预发布环境",
  pro_activity: "正式环境"
}
process.env.NODE_ENV = options.env // 设置用户环境信息的对象，vue-loader.conf会用到
console.log('build-process.env.NODE_ENV--------------' + process.env.NODE_ENV)
 // 需引用在设置process.env.NODE_ENV 值的后面，供utils、vue-loader.conf等用
const webpackProdConf = require('./webpack.prod.conf')

let pack = null;
if (!!options.env) {
  pack = webpackProdConf(options)
}

const spinner = ora('正在打包' + envList[options.env])
spinner.start()

rm(path.join(config.build.assetsRoot), err => {
  if (err) throw err
  webpack(pack, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  打包失败\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: 打包完成\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
