let webpack = require('webpack');
let config = require('./config.js');
let webpackConfig = require("./webpack.dev.conf.js");
let opn = require('opn')
let express = require('express');
let app = express()
let uri = 'http://localhost:'+config.dev.port;
let html = webpackConfig.output.publicPath+'index.html';

process.env.NODE_ENV = 'development';
// 编译
let compiler = webpack(webpackConfig);
let devMiddleware = require('webpack-dev-middleware')(compiler, {
    hot: true,
    filename: 'bundle.js',
    stats: {
        colors: true,
    },
    historyApiFallback: true,
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})
let hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
})
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})
app.use(devMiddleware)
app.use(hotMiddleware)
//app.use('/',express.static('./dist'))

// 初始化一个webpack-dev-server
console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n')
    opn(uri);
})
let server = app.listen(config.dev.port,function (err) {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
})