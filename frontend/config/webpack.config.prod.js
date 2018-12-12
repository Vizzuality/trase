const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const webpackBaseConfig = require('./webpack.config');

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new SWPrecacheWebpackPlugin({
      cacheId: 'trase.earth',
      filename: 'service-worker.js',
      minify: true,
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
    })
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
