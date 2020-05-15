// eslint-disable-next-line
const merge = require('webpack-merge');
const webpackConfig = require('../config/webpack.config');
const webpack = require('webpack');

const styleLoaders = [
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader', 'postcss-loader']
  },
  {
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
  }
];
module.exports = async ({ config }) =>
  merge(config, {
    plugins: [
      new webpack.DefinePlugin({
        NODE_ENV_DEV: process.env.NODE_ENV === 'development',
        ENABLE_INTERSECTION_OBSERVER: process.env.ENABLE_INTERSECTION_OBSERVER === 'true',
        DATA_DOWNLOAD_ENABLED: process.env.DATA_DOWNLOAD_ENABLED === 'true',
        SHOW_WORLD_MAP_IN_EXPLORE: process.env.SHOW_WORLD_MAP_IN_EXPLORE === 'true',
        ALWAYS_DISPLAY_DASHBOARD_INFO: process.env.ALWAYS_DISPLAY_DASHBOARD_INFO === 'true',
        ENABLE_DASHBOARDS: process.env.ENABLE_DASHBOARDS === 'true',
        DISABLE_PROFILES: process.env.DISABLE_PROFILES === 'true',
        ENABLE_COOKIE_BANNER: process.env.ENABLE_COOKIE_BANNER === 'true',
        GFW_WIDGETS_BASE_URL: JSON.stringify(process.env.GFW_WIDGETS_BASE_URL),
        ENABLE_LOGISTICS_MAP: process.env.ENABLE_LOGISTICS_MAP === 'true',
        ENABLE_LEGACY_TOOL_SEARCH: process.env.ENABLE_LEGACY_TOOL_SEARCH === 'true',
        NEW_PROFILES_PAGE: process.env.NEW_PROFILES_PAGE === 'true',
        API_V3_URL: JSON.stringify(process.env.API_V3_URL),
        UNIT_LAYERS_API_URL: JSON.stringify(process.env.UNIT_LAYERS_API_URL),
        API_V2_URL: JSON.stringify(process.env.API_V2_URL),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        DATA_FORM_ENDPOINT: JSON.stringify(process.env.DATA_FORM_ENDPOINT),
        DATA_FORM_ENABLED: process.env.DATA_FORM_ENABLED === 'true',
        PDF_DOWNLOAD_URL: JSON.stringify(process.env.PDF_DOWNLOAD_URL),
        PERF_TEST: process.env.PERF_TEST === 'true',
        REDUX_LOGGER_ENABLED: process.env.REDUX_LOGGER_ENABLED === 'true',
        USE_CANVAS_MAP: process.env.USE_CANVAS_MAP === 'true',
        USE_SERVICE_WORKER: process.env.USE_SERVICE_WORKER === 'true',
        TRANSIFEX_API_KEY: JSON.stringify(process.env.TRANSIFEX_API_KEY),
        HOME_VIDEO_ID: JSON.stringify(process.env.HOME_VIDEO_ID),
        NAMED_MAPS_ENV: JSON.stringify(process.env.NAMED_MAPS_ENV),
        CARTO_ACCOUNT: JSON.stringify(process.env.CARTO_ACCOUNT),
        MAPBOX_TOKEN: JSON.stringify(process.env.MAPBOX_TOKEN)
      })
    ],
    resolve: webpackConfig.resolve,
    module: merge(webpackConfig.module, {
      rules: styleLoaders
    })
  });
