var path = require('path')
module.exports = {
    build: {
        env: {
            NODE_ENV:'"production"'
        },
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: '',
        assetsPublicPath: './',
        productionGzipExtensions: ['js', 'css']
    },
    dev: {
        env: {
            NODE_ENV:'"development"'
        },
        port: 8008,
        assetsSubDirectory: '',
        assetsPublicPath: '/',
        proxyTable: {},
        cssSourceMap: false
    },
    entry:{
        app: path.resolve(__dirname, "../public/main.js"),
        app2:path.resolve(__dirname, "../public2/main.js")
    },
    templatePath:{
        app:path.resolve(__dirname, "../index.html"),
        app2:path.resolve(__dirname, "../index.html")
    },
    fileName :{
        app : "index1.html",
        app2 : "index2.html",
    }
}
