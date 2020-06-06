#!/usr/bin/env node

var path = require("path");
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware');
var express = require("express");
var app = express();
var proxyMiddleware = require('http-proxy-middleware');
var baseConfigFn = require("./config/webpack.config.base.js");
var baseDir = process.cwd(); //当前项目目录
// var srcDir = path.resolve(baseDir, 'src'); //源码目录

/**
 * webpack构建的基本配置
 * @param {object} params
 * {
 *  root: 根目录，不写默认为process.cwd()
 *  isMultiDevice:false,判断是否兼容多端，pc跟h5,兼容多端会默认多出一级目录，比如:pc/index、h5/index，默认为false
 *  env:"dev",//环境变量
 *  publicPath:"",//替换的路径
 *  build:"",//编译后保存的目录 相对于根目录
 *  srcDir: // 源码目录，默认源码目录为：process.cwd()
 *  entryDir:"",//webpack编译入口目录，为srcDir源码目录中的相对目录，跟srcDir一起构成完成的编译目录
 * }
 */
module.exports = async function (params) {
	var env = params.env || (process.env.NODE_ENV || "dev");
	process.env.NODE_ENV = env;
	baseConf = await baseConfigFn(params);
	if (env == "dev") {
		var port = params.port || 3333;
		for (var key in baseConf.entry) {
			baseConf.entry[key].unshift(`webpack-hot-middleware/client?reload=true`);
		}
		baseConf.profile = true;
		var compiler = webpack(baseConf);
		var proxy = params.proxy.context || [];
		var proxyOpts = params.proxy.options || {}
		var proxy1 = proxyMiddleware(proxy, proxyOpts);
		var devMiddleware = webpackDevMiddleware(compiler, {
			publicPath: baseConf.output.publicPath,
			//debug: true,
			hot: true,
			lazy: false,
			historyApiFallback: true,
			//poll: true,
			//index: "index.html",
			/* watchOptions: {
					aggregateTimeout: 300,
					ignored: /node_modules/
					//poll: true
			}, */
			// 输出信息 https://www.webpackjs.com/configuration/stats/
			// stats: {
			// 	chunks: false,
			// 	colors: true,
			// }
			stats: "minimal"
		});
		var hotMiddleware = webpackHotMiddleware(compiler);

		app.use(proxy1);
		app.use(devMiddleware);
		app.use(hotMiddleware);

		let listenStr = `listen at http://localhost:${port},......`;
		console.log(listenStr.bold.green);
		app.listen(port);
	} else {
		var compiler = await webpackCompile(baseConf);
	}
};

function webpackCompile(baseConf) {
	return new Promise(function (resolve, reject) {
		webpack(baseConf, function (err, stats) {
			if (err || stats.hasErrors()) {
				if (err) {
					console.error(err.stack || err);
					if (err.details) {
						console.error(err.details);
					}
					process.exit();
				}
				if (stats.hasErrors()) {
					console.log(stats.compilation.errors);
				}
				console.log(('编译出错,请仔细检查！！！').bold.red);
				process.exit();
			}
			return true;
		});
	});
}