/* eslint-env node */

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base');

module.exports = merge(webpackBaseConfig, {
  devtool: '#eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, '..', 'public'),
    port: 8081,
    host: '0.0.0.0',
    hot: false // enable true when app rendering is setup
  },
  plugins: [
    // new webpack.NamedModulesPlugin(),
    // new webpack.HotModuleReplacementPlugin()
  ]
});