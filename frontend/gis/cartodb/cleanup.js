#!/usr/bin/env node

const CartoDB = require('cartodb');
const config = require('./cartodb-config.json');

const namedMaps = new CartoDB.Maps.Named({
  user: config.user,
  api_key: config.api_key
});

namedMaps.list().on('done', res => {
  const templates = res.template_ids;

  templates.forEach(template => {
    namedMaps
      .delete({
        template_id: template
      })
      // eslint-disable-next-line camelcase
      .on('done', template_id => {
        console.info('deleted', template_id);
      });
  });
});
