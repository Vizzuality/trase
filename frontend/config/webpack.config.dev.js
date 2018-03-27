const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config');

module.exports = merge(webpackBaseConfig, {
  mode: 'development',
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
    proxy: [
      {
        context: ['/content', '/system'],
        target: `http:${process.env.API_V3_URL}`
      }
    ]
  },
  plugins: [new webpack.NamedModulesPlugin()],
  performance: {
    hints: false
  }
});
