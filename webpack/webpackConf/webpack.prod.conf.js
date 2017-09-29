let path = require('path');
let webpack = require('webpack');
let config = require('./config');
let merge = require('webpack-merge');
let baseWebpackConfig = require('./webpack.config');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let env = config.build.env;
let entryArr = [];
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
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['babel-polyfill'].concat(baseWebpackConfig.entry[name])
})
Object.keys(config.entry).forEach(function (name) {
  entryArr.push(
    new HtmlWebpackPlugin({
      title: config.htmlFile[name]["title"],
      filename: config.htmlFile[name]["name"],
      inject: true,
      chunks: [name, 'vendor', 'manifest','bigoLive'],
      hash: true
    })
  )
})
var plugins = [
  //参数
  new webpack.DefinePlugin({
    'process.env': env
  }),
  //压缩js
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    sourceMap: true
  }),
  //拆分css
  new ExtractTextPlugin({
    filename: (getPath) => {
      return getPath('css/[name].css');
    },
    allChunks: true
  }),
  //压缩css
  new OptimizeCSSPlugin({
    cssProcessorOptions: {
      safe: true
    }
  }),
  //我的公共资源文件。
  new webpack.optimize.CommonsChunkPlugin({
    name: 'bigoLive',
    minChunks: function (module, count) {
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(
          path.join(__dirname, '../static')
        ) === 0
      )
    }
  }),
  //第三方node_modules拆分公共内容
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
  //webpack所需代码
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    chunks: ['vendor']
  }),
].concat(entryArr);

var webpackConfig = merge(baseWebpackConfig, {
  output: {
    path: config.build.assetsRoot,
    filename: 'js/[name].js',
    chunkFilename: 'js/async[id].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: {
            plugins: [
              require('autoprefixer')({
                browsers: ['last 8 versions']
              }),
              require('postcss-plugin-px2rem')(px2rem)
            ],
            options: {

            }
          },
          loaders: {
            scss: ExtractTextPlugin.extract({
              use: ['css-loader', 'sass-loader', 'postcss-loader'],
              fallback: 'vue-style-loader'
            }),
            css: ExtractTextPlugin.extract({
              use: ['css-loader', 'sass-loader', 'postcss-loader'],
              fallback: 'vue-style-loader'
            })
          },
          transformToRequire: {
            video: 'src',
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      {
        test: /\.(css|scss|sass)$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'vue-style-loader',
          use: ['css-loader', 'sass-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')({
                    browsers: ['last 8 versions']
                  }),
                  require('postcss-plugin-px2rem')(px2rem)
                ]
              }
            }
          ]
        })
      },
    ]
  },
  plugins: plugins
})
module.exports = webpackConfig
