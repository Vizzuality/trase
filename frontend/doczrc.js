// eslint-disable-next-line
import merge from 'webpack-merge';
import webpackConfig from './config/webpack.config';

export default {
  files: '**/*.{md,markdown,mdx}',
  dest: './docs/dist',
  title: 'Trase',
  public: './public/docs',
  themeConfig: {
    colors: {
      primary: '#34444C',
      sidebarBg: '#fff0c2'
    }
  },
  modifyBundlerConfig: config =>
    merge(config, {
      resolve: webpackConfig.resolve,
      module: webpackConfig.module
    }),
  indexHtml: './docs/template.html',
  plugins: [],
  codeSandbox: false
};
