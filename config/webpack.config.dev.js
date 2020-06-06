var webpack = require("webpack");
// var path = require("path");
//var baseDir = process.cwd(); //当前项目目录
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const importOnce = require('node-sass-import-once'); // sass 导入去重
module.exports = function (entries, entryMap, isMultiDevice = false, baseDir = process.cwd(), buildDir = "") {
  let webpackConfig = {
    mode: 'development',
    cache: true,
    profile: true,
    module: {
      rules: [{
          test: /\.vue$/,
          exclude: /(node_modules|bower_components)/,
          use: [{
            loader: 'vue-loader',
            options: {
              loaders: {
                css: ['vue-style-loader', 'css-loader'],
                less: ["vue-style-loader", "css-loader", "less-loader"],
                scss: ["vue-style-loader", "css-loader", "sass-loader"]
              }
            }
          }]
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.less$/,
          use: ["vue-style-loader", "css-loader", "less-loader"]
        },
        {
          test: /(\.scss|\.sass)$/,
          use: ["vue-style-loader", "css-loader", {
            loader: 'sass-loader',
            options: {
              importer: importOnce,
              importOnce: {
                index: false,
                css: false,
                bower: false
              }
            }
          }]
        },
        {
          test: /\.html$/,
          use: ["html-loader"]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin()
    ],
  };
  if (isMultiDevice) {
    if (entryMap.h5) {
      let chunks = Object.keys(entryMap.h5);
      webpackConfig.plugins.push(
        new webpack.optimize.SplitChunksPlugin({ //提取公用的代码打包到独立文件
          chunks: "all", //  必须三选一： "initial" | "all"(默认) | "async"
          name: 'h5/common-h5',
          minChunks: chunks.length // 提取所有chunks共同依赖的模块
        })
      );
    }
    if (entryMap.pc) {
      let chunks = Object.keys(entryMap.pc);
      webpackConfig.plugins.push(
        new webpack.optimize.SplitChunksPlugin({ //提取公用的代码打包到独立文件
          chunks: "all", //  必须三选一： "initial" | "all"(默认) | "async"
          name: 'pc/common-pc',
          minChunks: chunks.length // 提取所有chunks共同依赖的模块
        })
      );
    }
  } else {
    let chunks = Object.keys(entries);
    webpackConfig.plugins.push(
      new webpack.optimize.SplitChunksPlugin({ //提取公用的代码打包到独立文件
        chunks: "all", //  必须三选一： "initial" | "all"(默认) | "async"
        name: 'common',
        minChunks: chunks.length // 提取所有chunks共同依赖的模块
      })
    );
  }
  webpackConfig.plugins.push(
    new webpack.optimize.RuntimeChunkPlugin({
      name: "manifest" // 分离 “webpack运行时”打包
    }),
    new webpack.HotModuleReplacementPlugin()
  );
  webpackConfig.devtool = "cheap-source-map"; //"cheap-module-source-map";//"cheap-source-map";

  return webpackConfig;
};