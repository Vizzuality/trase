const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config');

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
    historyApiFallback: true,
    proxy: {
      '/system': {
        target: 'http://0.0.0.0:3000'
      }
    }
  },
  plugins: [new webpack.NamedModulesPlugin()],
  performance: {
    hints: false
  }
});
