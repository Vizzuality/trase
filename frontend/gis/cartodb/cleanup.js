#!/usr/bin/env node

var CartoDB = require('cartodb');
var config = require('./cartodb-config.json');

var namedMaps = new CartoDB.Maps.Named({
  user: config.user,
  api_key: config.api_key
});


namedMaps.list()
  .on('done', function(res) {
    var templates = res.template_ids;

    templates.forEach(function(template) {
      namedMaps.delete({
        template_id: template
      })
      .on('done', function(template_id) {
        console.log('deleted', template_id);
      })
    })

  });
