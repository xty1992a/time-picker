/**
 * Created by TY-xie on 2018/3/26.
 */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const baseConfig = {
  resolve: {
	extensions: ['.js', '.ts', '.tsx'],
	alias: {
	  '@': path.resolve(__dirname, '../src'),
	},
  },
  output: {
	path: path.resolve(__dirname, '../lib'),
	filename: '[name]/index.js',
	publicPath: './',
  },
  module: {
	rules: [
	  {
		test: /\.tsx?$/,
		use: ['babel-loader', 'ts-loader'],
		exclude: /node_modules/,
	  },
	  {
		test: /(\.jsx|\.js)$/,
		use: {
		  loader: 'babel-loader',
		},
		exclude: /(node_modules)/,
	  },
	  {
		test: /(\.png)$/,
		use: {
		  loader: 'file-loader',
		},
	  },
	  {
		test: /\.svg$/,
		loader: 'svg-sprite-loader',
		options: {
		  symbolId: 'icon-[name]',
		},
	  },
	],
  },
  plugins: [],
};

module.exports = baseConfig;

// 将路径起点指向../src/pages
function pages(p) {
  return path.join(__dirname, '../src/vue-pages', p)
}

function root(p) {
  return path.join(__dirname, '..', p)
}
