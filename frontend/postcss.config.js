const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  plugins: [
    require('autoprefixer'), // eslint-disable-line
    ...(isDev ? [require('cssnano')] : []) // eslint-disable-line
  ]
};
