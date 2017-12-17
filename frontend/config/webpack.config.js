require('dotenv').config({ silent: true });

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const srcPath = path.join(__dirname, '..', 'scripts');

const templates = require('./static.templates');

module.exports = {
  entry: path.join(srcPath, 'index'),
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'common' }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(srcPath, 'index.ejs'),
      inject: 'body',
      DATA_DOWNLOAD_ENABLED: process.env.DATA_DOWNLOAD_ENABLED === 'true',
      icons: templates.icons,
      head: templates.head
    }),
    new webpack.DefinePlugin({
      NODE_ENV_DEV: process.env.NODE_ENV === 'development',
      API_V1_URL: JSON.stringify(process.env.API_V1_URL),
      DATA_DOWNLOAD_ENABLED: process.env.DATA_DOWNLOAD_ENABLED === 'true',
      API_V2_URL: JSON.stringify(process.env.API_V2_URL),
      API_V3_URL: JSON.stringify(process.env.API_V3_URL),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      DATA_FORM_ENDPOINT: JSON.stringify(process.env.DATA_FORM_ENDPOINT),
      DATA_FORM_ENABLED: process.env.DATA_FORM_ENABLED === 'true',
      PDF_DOWNLOAD_URL: JSON.stringify(process.env.PDF_DOWNLOAD_URL)
    })
  ],
  resolve: {
    alias: {
      html: path.resolve(__dirname, '..', 'html'),
      actions: path.resolve(srcPath, 'actions'),
      analytics: path.resolve(srcPath, 'analytics'),
      reducers: path.resolve(srcPath, 'reducers'),
      templates: path.resolve(srcPath, 'templates'),
      styles: path.resolve(__dirname, '..', 'styles'),
      components: path.resolve(srcPath, 'components'),
      'react-components': path.resolve(srcPath, 'react-components'),
      containers: path.resolve(srcPath, 'containers'),
      utils: path.resolve(srcPath, 'utils'),
      constants: path.resolve(srcPath, 'constants'),
      connect: path.resolve(srcPath, 'base', 'connect'),
      Container: path.resolve(srcPath, 'base', 'Container')
    },
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        exclude: /node_modules/,
        use: ['ejs-loader']
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
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
