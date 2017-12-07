const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');


module.exports = {
  entry: './scripts/index.js',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'common' }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin()
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
        use: ['babel-loader', 'eslint-loader'],
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.scss$/,
        use: [
          'style',
          'css',
          'sass',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer]
            }
          }
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
              limit: 380000
            }
          }
        ]
      },
      {
        test: /\.jpg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/jpg',
              limit: 30000
            }
          }
        ]
      }
    ]
  }
};