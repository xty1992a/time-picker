/*
config from development packages
* */
const path = require('path');
const webpack = require('webpack');
const base = require('./webpack.base');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const root = p => path.join(__dirname, '..', p);

const setProxy = () => {
	const list = ['UPay']
	
	const proxy = list.reduce((p, k) => {
	p[`/${k}/*`] = {
	  target: 'https://qyf1card1.m.yunhuiyuan.cn',
	  changeOrigin: true,
	  secure: false,
	}
	return p
	}, {});

	['api', 'Business'].forEach(key => {
		proxy[`/${key}/*`] = {
			target: 'https://qyf1card1.h5.yunhuiyuan.cn/',
			changeOrigin: true,
			secure: false,
		}
	});
	

	return proxy
}

module.exports = merge(base, {
  mode: 'development',
  entry: {
	app: root('src/demo.js'),
  },
  module: {
	rules: [
	  {
		test: /(\.less)$/,
		use: [
		  {loader: 'style-loader'},
		  {loader: 'css-loader'},
		  {loader: 'less-loader'},
		],
	  },
	],
  },
  devServer: {
	contentBase: path.resolve(__dirname, '..'),
	compress: true,
	hot: true,
	port: 7780,
	host: 'localhost',
	publicPath: '/',
	disableHostCheck: true,
	proxy: setProxy(),
  },
  plugins: [
	new webpack.HotModuleReplacementPlugin(),
	new HtmlWebpackPlugin({
	  filename: 'index.html',
	  template: 'index.html',
	  inject: true,
	  hash: true,
	}),
  ],
});
