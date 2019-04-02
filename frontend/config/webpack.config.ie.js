require('dotenv').config({ silent: true });

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const srcPath = path.join(__dirname, '..', 'scripts');

module.exports = {
  entry: {
    ie: [path.join(srcPath, 'index.ie')]
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.ie.html',
      template: path.resolve(srcPath, 'index.ie.ejs'),
      inject: 'body',
      GOOGLE_ANALYTICS_KEY: JSON.stringify(process.env.GOOGLE_ANALYTICS_KEY)
    }),
    new MiniCssExtractPlugin()
  ],
  resolve: {
    alias: {
      styles: path.resolve(__dirname, '..', 'styles')
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { minimize: !isDev }
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
            options: { minimize: !isDev }
          },
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  }
};
