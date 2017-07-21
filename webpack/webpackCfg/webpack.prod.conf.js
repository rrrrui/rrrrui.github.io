var path = require('path')
var webpack = require('webpack')
var config = require('./config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.config')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var env =  config.build.env;
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
console.log(entryArr.length)
var plugins = [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        sourceMap: true
    }),
    new OptimizeCSSPlugin({
        cssProcessorOptions: {
            safe: true
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module, count) {
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
        chunks: ['vendor']
    }),
].concat(entryArr);

var webpackConfig = merge(baseWebpackConfig, {
    output: {
        path: config.build.assetsRoot,
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[id].[chunkhash].js'
    },
    plugins:plugins
})
module.exports = webpackConfig
