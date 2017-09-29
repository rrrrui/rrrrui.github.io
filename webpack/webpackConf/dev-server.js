let webpack = require('webpack');
let config = require('./config.js');
let webpackConfig = require("./webpack.dev.conf.js");
let proxyMiddleware = require('http-proxy-middleware')
let opn = require('opn')
let express = require('express');
let path = require('path')
let compression = require('compression')
let app = express()
app.use(compression());
let winston = require('winston');
process.env.NODE_ENV = 'development';
let compiler = webpack(webpackConfig);
let indexFileName = Object.values(config.htmlFile)[0].name;
let uri = `http://172.27.39.1:${config.dev.port}/${indexFileName}`;
let devMiddleware = require('webpack-dev-middleware')(compiler, {
  hot: true,
  filename: 'app.js',
  stats: {
    colors: true,
  },
  historyApiFallback: false,
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})
let hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {
  },
  heartbeat: 10 * 1000,
})
// proxy api requests
let proxyTable = config.dev.proxyTable;
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
})
app.use(devMiddleware)
app.use(hotMiddleware)
let staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

app.use(express.static(path.join(__dirname, '../')));



// 初始化一个webpack-dev-server
console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  opn(uri);
})
let server = app.listen(config.dev.port);