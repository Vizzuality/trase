const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base');

module.exports = merge(webpackBaseConfig, {
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  devtool: '#eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, '..', 'public'),
    port: 8081,
    host: '0.0.0.0',
    hot: true, // enable true when app rendering is setup,
    historyApiFallback: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  performance: {
    hints: 'warning'
  }
});