const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(webpackBaseConfig, {
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new UglifyJSPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        // This will apply the loader before the other ones
        enforce: 'pre'
      }
    ]
  }
});
