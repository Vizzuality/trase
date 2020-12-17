const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const HtmlWebpackPreconnectPlugin = require('html-webpack-preconnect-plugin');

/**
 * BundleAnalyzerPlugin allows profiling the webpack generated js, to help identify improvement points
 * If you want to enable it, uncomment the line bellow and ´new BundleAnalyzerPlugin()´ further down.
 */
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV !== 'production';
const srcPath = path.join(__dirname, '..', 'scripts');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');

const templates = require('./static.templates');

module.exports = {
  entry: {
    main: path.join(srcPath, 'index')
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/'
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(srcPath, 'index.ejs'),
      inject: 'body',
      DATA_DOWNLOAD_ENABLED: process.env.DATA_DOWNLOAD_ENABLED === 'true',
      icons: templates.icons,
      head: templates.head,
      preconnect: [
        `https:${process.env.API_V3_URL}`,
        `http:${process.env.API_V3_URL}`,
        `https://${process.env.CARTO_ACCOUNT}.carto.com`,
        'https://sample-api-v2.crazyegg.com',
        'https://live-detector.svc.transifex.net',
        'https://audex.userreport.com',
        'https://dmp.adform.net'
      ]
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: ['tool', 'explore']
    }),
    new HtmlWebpackPreconnectPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV_DEV: process.env.NODE_ENV === 'development',
      CONSOLIDATE_INSIGHTS: process.env.CONSOLIDATE_INSIGHTS === 'true',
      ENABLE_COUNTRY_PROFILES: process.env.ENABLE_COUNTRY_PROFILES === 'true',
      ENABLE_LOGISTIC_LAYERS_TAB: process.env.ENABLE_LOGISTIC_LAYERS_TAB === 'true',
      ENABLE_INTERSECTION_OBSERVER: process.env.ENABLE_INTERSECTION_OBSERVER === 'true',
      ENABLE_VERSIONING: process.env.ENABLE_VERSIONING === 'true',
      ENABLE_TOOL_PANEL: process.env.ENABLE_TOOL_PANEL === 'true',
      DATA_DOWNLOAD_ENABLED: process.env.DATA_DOWNLOAD_ENABLED === 'true',
      SHOW_WORLD_MAP_IN_EXPLORE: process.env.SHOW_WORLD_MAP_IN_EXPLORE === 'true',
      ALWAYS_DISPLAY_DASHBOARD_INFO: process.env.ALWAYS_DISPLAY_DASHBOARD_INFO === 'true',
      ENABLE_DASHBOARDS: process.env.ENABLE_DASHBOARDS === 'true',
      DISABLE_PROFILES: process.env.DISABLE_PROFILES === 'true',
      GFW_WIDGETS_BASE_URL: JSON.stringify(process.env.GFW_WIDGETS_BASE_URL),
      ENABLE_LEGACY_TOOL_SEARCH: process.env.ENABLE_LEGACY_TOOL_SEARCH === 'true',
      UNIT_LAYERS_API_URL: JSON.stringify(process.env.UNIT_LAYERS_API_URL),
      UNIT_LAYERS_DATA_ENV: JSON.stringify(process.env.UNIT_LAYERS_DATA_ENV),
      API_V3_URL: JSON.stringify(process.env.API_V3_URL),
      API_V2_URL: JSON.stringify(process.env.API_V2_URL),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      DATA_FORM_ENDPOINT: JSON.stringify(process.env.DATA_FORM_ENDPOINT),
      DATA_FORM_ENABLED: process.env.DATA_FORM_ENABLED === 'true',
      PDF_DOWNLOAD_URL: JSON.stringify(process.env.PDF_DOWNLOAD_URL),
      REDUX_LOGGER_ENABLED: process.env.REDUX_LOGGER_ENABLED === 'true',
      USE_CANVAS_MAP: process.env.USE_CANVAS_MAP === 'true',
      USE_SERVICE_WORKER: process.env.USE_SERVICE_WORKER === 'true',
      TRANSIFEX_API_KEY: JSON.stringify(process.env.TRANSIFEX_API_KEY),
      HOME_VIDEO_ID: JSON.stringify(process.env.HOME_VIDEO_ID),
      NAMED_MAPS_ENV: JSON.stringify(process.env.NAMED_MAPS_ENV),
      CARTO_ACCOUNT: JSON.stringify(process.env.CARTO_ACCOUNT),
      MAPBOX_TOKEN: JSON.stringify(process.env.MAPBOX_TOKEN),
      ENABLE_TOP_NAV_REDESIGN: JSON.stringify(process.env.ENABLE_TOP_NAV_REDESIGN === 'true')
    }),
    new webpack.LoaderOptionsPlugin({ options: {} })
  ],
  resolve: {
    alias: {
      scripts: path.resolve(srcPath),
      html: path.resolve(__dirname, '..', 'html'),
      actions: path.resolve(srcPath, 'actions'),
      analytics: path.resolve(srcPath, 'analytics'),
      app: path.resolve(srcPath, 'app'),
      legacy: path.resolve(srcPath, 'legacy'),
      styles: path.resolve(__dirname, '..', 'styles'),
      'react-components': path.resolve(srcPath, 'react-components'),
      'named-maps': path.resolve(srcPath, 'named-maps'),
      utils: path.resolve(srcPath, 'utils'),
      constants: path.resolve(srcPath, 'constants'),
      store: path.resolve(srcPath, 'store'),
      router: path.resolve(srcPath, 'router'),
      selectors: path.resolve(srcPath, 'selectors'),
      'lodash-es': 'lodash',
      'reducer-registry': path.resolve(srcPath, 'reducer-registry'),
      'saga-registry': path.resolve(srcPath, 'saga-registry')
    },
    plugins: [
      new DirectoryNamedWebpackPlugin({
        exclude: /node_modules/
      })
    ],
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
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: isDev
            }
          },
          'eslint-loader'
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
