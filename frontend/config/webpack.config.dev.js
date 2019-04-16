const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config');
// const webpackIEConfig = require('./webpack.config.ie');

// eslint-disable-next-line
let devConfig = webpackBaseConfig;

// uncomment for IE version development
// devConfig = webpackIEConfig;

const devRules = [
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader', 'postcss-loader']
  },
  {
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
  }
];

module.exports = merge(devConfig, {
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
  },
  module: {
    rules: devConfig === webpackBaseConfig ? devRules : []
  }
});
