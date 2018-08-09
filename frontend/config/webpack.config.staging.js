const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
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
  devServer: {
    contentBase: path.join(__dirname, '..', 'public'),
    port: 8081,
    host: '0.0.0.0',
    historyApiFallback: true,
    proxy: [
      {
        context: ['/content', '/system'],
        target: `http:${process.env.API_V3_URL}`
      }
    ]
  }
});
