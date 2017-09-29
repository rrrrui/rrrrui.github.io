var webpack = require("webpack")
var autoprefixer = require("autoprefixer");
var path = require('path')
var config = require('./config');
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
function assetsPath(_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}
module.exports = {
  entry: config.entry,
  target: 'web',
  output: {
    path: config.build.assetsRoot,//打包后的文件存放的地方
    filename: "[name].js",//打包后输出文件的文件名
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
    chunkFilename: 'async[id].js',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.jsx'],
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|vue)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: ["syntax-dynamic-import"]
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('./img/[name].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('./media/[name].[ext]')
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        options: {
          name: assetsPath('./json/[name].json')
        }
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('./fonts/[name].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      axios: 'axios',
      api: path.join(__dirname, '../static/zhangrui5/js/liveApi.js')
    }),
  ]
}