const fs = require('fs');
const template = require('lodash/template');

module.exports = {
  icons: fs.readFileSync('./html/statics/icons.svg', 'utf8'),
  head: template(fs.readFileSync('./html/includes/_head.ejs', 'utf8'))({
    title: 'TRASE',
    description:
      'Trase brings unprecedented transparency to commodity supply chains revealing new pathways towards achieving a deforestation-free economy.',
    dev: process.env.NODE_ENV === 'development',
    GOOGLE_ANALYTICS_KEY: JSON.stringify(process.env.GOOGLE_ANALYTICS_KEY)
  })
};
