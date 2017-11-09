/* eslint-env node */
var fs = require('fs');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var _ = require('lodash');
require('dotenv').config({ silent: true });


// base object that will be used to generate individual html pages (with HtmlWebpackPlugin instances)
// as well as webpack entry points
const pages = {
  index: {
    title: 'TRASE'
  },
  tool: {
    title: 'TRASE Tool',
    pageName: 'flows'
  },
  profiles: {
    title: 'TRASE - Profiles',
    pageName: 'profiles'
  },
  'profile-actor': {
    title: 'TRASE - Actor profile',
    pageName: 'profile-actor'
  },
  'profile-place': {
    title: 'TRASE - Place profile',
    pageName: 'profile-place'
  },
  FAQ: {
    title: 'TRASE - FAQ'
  },
  about: {
    title: 'TRASE - About'
  },
  'terms-of-use': {
    title: 'TRASE - Terms of use'
  },
  'data-methods': {
    title: 'TRASE - Data and methods'
  },
  'data': {
    title: 'TRASE - Data'
  }
};

const templates = {};
['head', 'search', 'nav', 'navtool', 'footer', 'scripts', 'autocomplete_countries'].forEach(key => {
  templates[key] = _.template(fs.readFileSync(`./html/includes/_${key}.ejs`, 'utf8'));
});

const getPagePlugin = (id, params) => {
  const title = params.title || 'TRASE';
  const description = params.description || 'Trase brings unprecedented transparency to commodity supply chains revealing new pathways towards achieving a deforestation-free economy.';

  return new HtmlWebpackPlugin({
    inject: false,
    head: templates.head({
      title,
      description,
      dev: process.env.NODE_ENV === 'development',
      GOOGLE_ANALYTICS_KEY: JSON.stringify(process.env.GOOGLE_ANALYTICS_KEY),
      USER_REPORT_KEY: JSON.stringify(process.env.USER_REPORT_KEY),
    }),
    search: templates.search(),
    nav: templates.nav({ page: id }),
    navtool: templates.navtool(),
    footer: templates.footer(),
    scripts: templates.scripts({ bundle: id }),
    autocomplete_countries: templates.autocomplete_countries({ bundle: id }),
    icons: fs.readFileSync('./html/statics/icons.svg', 'utf8'),
    filename: (params.pageName || id)+'.html',
    template: './html/'+id+'.ejs',
    DATA_DOWNLOAD_ENABLED: process.env.DATA_DOWNLOAD_ENABLED === 'true'
  });
};

const pagePlugins = Object.keys(pages).map(id => getPagePlugin(id, pages[id]));
const entry = _.mapValues(pages, (page, id) => {
  return './scripts/pages/' + id + '.page.js';
} );

const config = {
  entry: entry,
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'common' }),
    new webpack.DefinePlugin({
      NODE_ENV_DEV: process.env.NODE_ENV === 'development',
      API_V1_URL: JSON.stringify(process.env.API_V1_URL),
      DATA_DOWNLOAD_ENABLED: process.env.DATA_DOWNLOAD_ENABLED === 'true',
      API_V2_URL: JSON.stringify(process.env.API_V2_URL),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      API_CMS_URL: JSON.stringify(process.env.API_CMS_URL),
      API_STORY_CONTENT: JSON.stringify(process.env.API_STORY_CONTENT),
      API_SOCIAL: JSON.stringify(process.env.API_SOCIAL),
      DATA_FORM_ENDPOINT: JSON.stringify(process.env.DATA_FORM_ENDPOINT),
      DATA_FORM_ENABLED: process.env.DATA_FORM_ENABLED === 'true',
    })
  ].concat(pagePlugins),
  output: {
    path: './dist',
    filename: '[name].bundle.js'
  },
  // this section allows imports with absolute paths (as if using node_modules)
  resolve: {
    root: process.cwd(),
    alias: {
      actions: 'scripts/actions',
      analytics: 'scripts/analytics',
      reducers: 'scripts/reducers',
      templates: 'scripts/templates',
      style: 'styles',
      components: 'scripts/components',
      'react-components': 'scripts/react-components',
      containers: 'scripts/containers',
      utils: 'scripts/utils',
      constants: 'scripts/constants',
      connect: 'scripts/base/connect',
      Container: 'scripts/base/Container'
    },
    extensions: ['', '.js']
  },
  module: {
    loaders: [
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
  },
  postcss: function () {
    return [autoprefixer];
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true
      }
    })
  );
}

module.exports = config;
