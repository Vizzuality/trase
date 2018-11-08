const webpack = require('webpack');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const webpackBaseConfig = require('./webpack.config');

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [new webpack.optimize.ModuleConcatenationPlugin(), new webpack.HashedModuleIdsPlugin()],
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        // This will apply the loader before the other ones
        enforce: 'pre'
      }
    ]
  },
  optimization: {
    minimizer: [new TerserPlugin()]
  }
});
