let webpack = require('webpack');
let config = require('./config');
let merge = require('webpack-merge');
let baseWebpackConfig = require('./webpack.config');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let path = require('path');
//"border","border-bottom","border-top","border-left","border-right","font-size","border-radius"
const px2rem = {
  rootValue: 75,
  unitPrecision: 5,
  propWhiteList: [],
  propBlackList: [],
  selectorBlackList: [],
  ignoreIdentifier: false,
  replace: true,
  mediaQuery: false,
  minPixelValue: 0
}
//多入口时热部署
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['babel-polyfill', './webpackCfg/dev-client.js'].concat(baseWebpackConfig.entry[name])
})
var entryArr = [];
Object.keys(config.entry).forEach(function (name) {
  entryArr.push(
    new HtmlWebpackPlugin({
      title: config.htmlFile[name]["title"],
      filename: config.htmlFile[name]["name"],
      inject: true,
      chunks: [name]
    })
  )
})
var plugins = [
  new webpack.DefinePlugin({
    'process.env': config.dev.env
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
].concat(entryArr)
module.exports = merge(baseWebpackConfig, {
  module: {
    rules: [
      {
        test: /\.vue$/i,
        loader: 'vue-loader',
        options: {
          transformToRequire: {
            video: 'src',
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          },
          postcss: {
            plugins: [
              require('autoprefixer')({
                browsers: ['last 8 versions']
              }),
              require('postcss-plugin-px2rem')(px2rem)
            ],
            options: {}
          },
        }
      },
      {
        test: /\.(css|scss)$/i,
        use: ['style-loader', 'css-loader', 'sass-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: [
              require('autoprefixer')({
                browsers: ['last 8 versions']
              }),
              require('postcss-plugin-px2rem')(px2rem)
            ]
          }
        }]
      }
    ]
  },

  plugins: plugins
})
