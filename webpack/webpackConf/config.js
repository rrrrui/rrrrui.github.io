let path = require('path');
let pathCfg = require('../live/act/S7EventsQuizzes/config.js'); //S7j竞猜

module.exports = {
  build: {
    env: {
      NODE_ENV: '"production"'
    },
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: pathCfg.output.path,
    assetsSubDirectory: '',
    assetsPublicPath: pathCfg.staticPath,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: {
      NODE_ENV: '"development"'
    },
    port: 8888,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: pathCfg.proxyTable,
    cssSourceMap: false
  },
  entry: pathCfg.entry,
  htmlFile: pathCfg.htmlFile,
  excel2json:pathCfg.excel2json
};
