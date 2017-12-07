/* eslint-env node */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './scripts/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Management'
    })
  ],
  resolve: {
    alias: {
      actions: path.resolve(__dirname, '..', 'scripts', 'actions'),
      analytics: path.resolve(__dirname, '..', 'scripts', 'analytics'),
      reducers: path.resolve(__dirname, '..', 'scripts', 'reducers'),
      templates: path.resolve(__dirname, '..', 'scripts', 'reducers'),
      style: path.resolve(__dirname, 'styles'),
      components: path.resolve(__dirname, '..', 'scripts', 'components'),
      'react-components': path.resolve(__dirname, '..', 'scripts', 'react-components'),
      containers: path.resolve(__dirname, '..', 'scripts', 'containers'),
      utils: path.resolve(__dirname, '..', 'scripts', 'utils'),
      constants: path.resolve(__dirname, '..', 'scripts', 'constants'),
      connect: path.resolve(__dirname, '..', 'scripts', 'connect'),
      Container: path.resolve(__dirname, '..', 'scripts', 'Container'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader', 'eslint-loader'],
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass'] },
      {
        test: /\.png$/,
        loader: 'url-loader',
        query: {
          mimetype: 'image/png',
          limit: 380000
        }
      },
      {
        test: /\.jpg$/,
        loader: 'url-loader',
        query: {
          mimetype: 'image/jpg',
          limit: 30000
        }
      }
    ]
  }
};