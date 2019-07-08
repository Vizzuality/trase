require('dotenv').config({ silent: true });
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackBaseConfig = require('./webpack.config');
const webpackIEConfig = require('./webpack.config.ie');

const main = merge(webpackBaseConfig, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin(),
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
  }
});

module.exports = [main, webpackIEConfig];
