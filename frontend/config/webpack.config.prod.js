const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(webpackBaseConfig, {
  devtool: 'source-map',
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new UglifyJSPlugin({
      compress: {
        screw_ie8: true
      }
    })
  ]
});
