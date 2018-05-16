require('dotenv').config({ silent: true });

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
/**
 * BundleAnalyzerPlugin allows profiling the webpack generated js, to help identify improvement points
 * If you want to enable it, uncomment the line bellow and ´new BundleAnalyzerPlugin()´ further down.
 */
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const srcPath = path.join(__dirname, '..', 'scripts');

const templates = require('./static.templates');

module.exports = {
  entry: {
    fetch: 'whatwg-fetch',
    main: ['babel-polyfill', path.join(srcPath, 'index')]
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/'
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(srcPath, 'index.ejs'),
      inject: 'body',
      DATA_DOWNLOAD_ENABLED: process.env.DATA_DOWNLOAD_ENABLED === 'true',
      icons: templates.icons,
      head: templates.head
    }),
    new SWPrecacheWebpackPlugin({
      cacheId: 'trase.earth',
      filename: 'service-worker.js',
      minify: true,
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
    }),
    new webpack.DefinePlugin({
      NODE_ENV_DEV: process.env.NODE_ENV === 'development',
      DATA_DOWNLOAD_ENABLED: process.env.DATA_DOWNLOAD_ENABLED === 'true',
      API_V3_URL: JSON.stringify(process.env.API_V3_URL),
      API_V2_URL: JSON.stringify(process.env.API_V2_URL),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      DATA_FORM_ENDPOINT: JSON.stringify(process.env.DATA_FORM_ENDPOINT),
      DATA_FORM_ENABLED: process.env.DATA_FORM_ENABLED === 'true',
      PDF_DOWNLOAD_URL: JSON.stringify(process.env.PDF_DOWNLOAD_URL),
      PERF_TEST: process.env.PERF_TEST === 'true',
      REDUX_LOGGER_ENABLED: process.env.REDUX_LOGGER_ENABLED === 'true',
      USE_CANVAS_MAP: process.env.USE_CANVAS_MAP === 'true',
      USE_PLAIN_URL_STATE: process.env.USE_PLAIN_URL_STATE === 'true',
      USE_SERVICE_WORKER: process.env.USE_SERVICE_WORKER === 'true',
      TRANSIFEX_API_KEY: JSON.stringify(process.env.TRANSIFEX_API_KEY),
      HOME_VIDEO_ID: JSON.stringify(process.env.HOME_VIDEO_ID)
    }),
    new webpack.LoaderOptionsPlugin({ options: {} })
  ],
  resolve: {
    alias: {
      scripts: path.resolve(srcPath),
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
      Container: path.resolve(srcPath, 'base', 'Container'),
      store: path.resolve(srcPath, 'store'),
      router: path.resolve(srcPath, 'router')
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
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { minimize: process.env.NODE_ENV === 'production' }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { minimize: process.env.NODE_ENV === 'production' }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024 // inline files smaller than (10240 bytes)
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        options: {
          limit: 10 * 1024,
          noquotes: true
        }
      }
    ]
  }
};
