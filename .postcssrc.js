// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  // "plugins": {
  //   "postcss-import": {},
  //   "postcss-url": {},
  //   // to edit target browsers: use "browserslist" field in package.json
  //   "autoprefixer": {}
  // }
  "plugins": [
    require('autoprefixer')({
      browsers: ['last 20 versions', 'Android >= 2.0']
    })
  ]
}
