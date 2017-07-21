var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require("autoprefixer");
var path = require('path')
var config = require('./config');
module.exports = {
    entry:config.entry ,
    target: 'web',
    output: {
        path: config.build.assetsRoot,//打包后的文件存放的地方
        filename: "[name].js",//打包后输出文件的文件名
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/i,
                loader:'vue-loader'
            },
            {
                test: /\.js$/,
                include:[path.resolve(__dirname,'src')],
                loader: 'babel-loader',
                query: {
                    compact: false,
                    presets: ['es2015']
                }
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=img/[hash:8].[name].[ext]'
            },
            {
                test: /\.(css|scss)$/i,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader','sass-loader','postcss-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename:  (getPath) => {
                return getPath('css/[name][hash].css');
            },
            allChunks: true
        })
    ]
}