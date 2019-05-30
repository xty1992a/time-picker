/*
	config for build umd module to use
* */
const path = require('path');
const base = require('./webpack.base');
const merge = require('webpack-merge');
const root = p => path.join(__dirname, '..', p);
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (args) => {
  const plugins = [
	new MiniCssExtractPlugin({
	  filename: 'time-picker.css',
	}),
  ]

  if (args === 'report') {
	plugins.push(
		new BundleAnalyzerPlugin(),
	)
  }

  return merge(base, {
	mode: 'production',
	entry: root('src/package/main.ts'),
	output: {
	  path: path.resolve(__dirname, '../lib'),
	  filename: 'time-picker.js',
	  publicPath: '/',
	  library: 'pickTime',
	  libraryTarget: 'umd',
	  libraryExport: 'default', // 需要暴露的模块
	  umdNamedDefine: true,
	},
	module: {
	  rules: [
		{
		  test: /(\.less)$/,
		  use: [
			MiniCssExtractPlugin.loader,
			{loader: 'css-loader'},
			{loader: 'less-loader'},
		  ],
		},
	  ],
	},
	performance: false,
	optimization: {
	  minimize: true,
	},
	plugins,
  })
};
