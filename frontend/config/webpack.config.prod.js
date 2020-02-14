require('dotenv').config({ silent: true });
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackBaseConfig = require('./webpack.config');

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css'
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new SWPrecacheWebpackPlugin({
      cacheId: 'trase.earth',
      filename: 'service-worker.js',
      minify: true,
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/, /\.html$/],
      dontCacheBustUrlsMatching: [/./]
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'hashed',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          // create a splitChunk for each node vendor
          name(module) {
            const npmPackage = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            const packageName = npmPackage && npmPackage[1];
            if (packageName) {
              return `npm.${packageName.replace('@', '')}`;
            }
            return false;
          }
        }
      }
    }
  }
});
