// eslint-disable-next-line
import merge from 'webpack-merge';
import webpackConfig from './config/webpack.config';

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
      module: merge(webpackConfig.module, { rules: styleLoaders })
    }),
  indexHtml: './docs/template.html',
  plugins: [],
  codeSandbox: false
};
