let webpack = require('webpack')
let config = require('./config')
let merge = require('webpack-merge')
let baseWebpackConfig = require('./webpack.config')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let path =require('path')
//多入口时热部署
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'].concat(baseWebpackConfig.entry[name])
})
var entryArr = [];
Object.keys(config.entry).forEach(function (name) {
    entryArr.push(
        new HtmlWebpackPlugin({
            title:"test",
            filename: config.fileName[name],
            template: config.templatePath[name],
            inject: true,
            chunks:[name,'vendor','manifest']
        })
    )
})

Object.keys(config.entry).forEach(function (name) {
    entryArr.push(
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: config.templatePath[name],
            inject: true,
            chunks:[name,'vendor','manifest']
        })
    )
})
var plugins = [
    new webpack.DefinePlugin({
        'process.env': config.dev.env
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
].concat(entryArr)
module.exports = merge(baseWebpackConfig, {
    plugins: plugins
})
