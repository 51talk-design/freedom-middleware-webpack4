var webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// var path = require("path");
var autoprefixer = require('autoprefixer');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //css压缩，webpack -p可以压缩css，但是没有使用该命令进行打包处理
//var baseDir = process.cwd(); //当前项目目录
// 解决webstorm编辑器下webstorm无法显示进度条的问题
if (!process.stdout.isTTY) {
	process.stdout.isTTY = true;
	process.stdout.columns = 80;
	process.stdout.cursorTo = () => {
		process.stdout.write('\r')
	};
	process.stdout.clearLine = () => { };
}
module.exports = function (entries, entryMap, isMultiDevice = false, baseDir = process.cwd(), buildDir = "", bundleAnalyzerReport, bundleAnalyzerReportPort) {
	// bundleAnalyzerReport,bundleAnalyzerReportPort
	// console.log("是否开启bundleAnalyzerReport：",bundleAnalyzerReport)
	//提取css的loader配置常量
	const MiniCssLoadersConf = {
		css: [
			MiniCssExtractPlugin.loader,
			{
				loader: "css-loader",
				// options: {
				// 	importLoaders: 1
				// }
			},
			{
				loader: "postcss-loader"
			}
		],
		less: [
			MiniCssExtractPlugin.loader,
			{
				loader: "css-loader",
				// options: {
				// 	importLoaders: 2
				// }
			},
			{
				loader: 'postcss-loader'
			},
			{
				loader: "less-loader"
			}
		],
		scss: [
			MiniCssExtractPlugin.loader,
			{
				loader: "css-loader",
				// options: {
				// 	importLoaders: 3
				// }
			},
			{
				loader: "resolve-url-loader"
			},
			{
				loader: 'postcss-loader'
			},
			{
				loader: "sass-loader?sourceMap"
			}
		],
	};
	let webpackConfig = {
		mode: 'production',
		module: {
			rules: [{
				test: /\.vue$/,
				exclude: /(node_modules|bower_components)/,
				use: [{
					loader: 'vue-loader',
					options: {
						loaders: MiniCssLoadersConf
					}
				}]
			},
			{
				test: /\.css$/,
				use: MiniCssLoadersConf.css
			},
			{
				test: /(\.sass|\.scss)$/,
				use: MiniCssLoadersConf.scss
			},
			{
				test: /\.less$/,
				use: MiniCssLoadersConf.less
			},
			{
				test: /\.html$/,
				use: {
					loader: "html-loader",
					options: {
						minimize: false
					}
				}
			}
			]
		},
		plugins: [
			new CleanWebpackPlugin(["build"], {
				root: baseDir, // 不同版本定义的不同，需要注意
				// root: buildDir ? buildDir.replace(/build/gi, "") : baseDir,
				verbose: true, //开启在控制台输出信息
				dry: false //启用删除文件
			}),
			new webpack.HashedModuleIdsPlugin(),
			new ProgressBarPlugin({
				format: 'build [:bar] :percent (:elapsed seconds)',
				clear: false,
				width: 60,
				stream: process.stdout
			})
		],
		optimization: {
			minimizer: [
				new TerserPlugin({
					cache: true,
					parallel: true // 使用多进程并行运行和文件缓存来提高构建速度
				}),
				new OptimizeCssAssetsPlugin({
					cssProcessorOptions: {
						// map: {
						// 	inline: false // https://blog.csdn.net/nesxiaogu/article/details/89314483
						// }
					}
				})
				// new UglifyJsPlugin({
				// 	parallel: true, // 使用多进程并行运行和文件缓存来提高构建速度
				// 	uglifyOptions: {
				// 		compress: {
				// 			warnings: false,
				// 			drop_console: true
				// 		}
				// 	}
				// })
			]
		}
	};
	webpackConfig.plugins.push(
		new MiniCssExtractPlugin({
			filename: 'css/[name].css',
		})
	);
	if (bundleAnalyzerReport) {
		const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
		webpackConfig.plugins.push(new BundleAnalyzerPlugin({
			analyzerPort: typeof (bundleAnalyzerReportPort) === 'undefined' ? 8787 : bundleAnalyzerReportPort,
			defaultSizes: 'gzip',
		}))
	}
	if (isMultiDevice) {
		if (entryMap.h5) {
			let chunks = Object.keys(entryMap.h5);
			if (chunks && chunks.length > 0) {
				webpackConfig.plugins.push(
					new webpack.optimize.SplitChunksPlugin({ //提取公用的代码打包到独立文件
						cacheGroups: {
							commons: {
								chunks: "all", // initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
								name: 'h5/common-h5',
								priority: 1,
								maxAsyncRequests: 5,
								maxInitialRequests: 3, // 最大的初始化加载次数，默认为1；
								minSize: 5, // 在压缩前的最小模块大小
								minChunks: chunks.length
							}
						}
					})
				);
			}
		}
		if (entryMap.pc) {
			let chunks = Object.keys(entryMap.pc);
			if (chunks && chunks.length > 0) {
				webpackConfig.plugins.push(
					new webpack.optimize.SplitChunksPlugin({ //提取公用的代码打包到独立文件
						cacheGroups: {
							commons: {
								chunks: "all", // initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
								name: 'pc/common-pc',
								priority: 1,
								maxAsyncRequests: 5,
								maxInitialRequests: 3, // 最大的初始化加载次数，默认为1；
								minSize: 5, // 在压缩前的最小模块大小
								minChunks: chunks.length
							}
						}
					})
				);
			}
		}
	} else {
		let chunks = Object.keys(entries);
		webpackConfig.plugins.push(
			new webpack.optimize.SplitChunksPlugin({ //提取公用的代码打包到独立文件
				cacheGroups: {
					commons: {
						chunks: "all", // initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
						name: 'common',
						priority: 1,
						maxAsyncRequests: 5,
						maxInitialRequests: 3, // 最大的初始化加载次数，默认为1；
						minSize: 5, // 在压缩前的最小模块大小
						minChunks: chunks.length
					}
				}
			})
		);
	}
	webpackConfig.plugins.push(
		new webpack.optimize.RuntimeChunkPlugin({
			name: "manifest" // 分离 “webpack运行时”打包
		}),
		new webpack.HotModuleReplacementPlugin(),
		new VueLoaderPlugin()
	);

	return webpackConfig;
};