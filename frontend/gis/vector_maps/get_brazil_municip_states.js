#!/usr/bin/env node

var CartoDB = require('cartodb');
var exec = require('child_process').exec;
var fs = require('fs');

var sql = new CartoDB.SQL({user: 'p2cs-sei'})

sql.execute('SELECT geoid FROM BRAZIL_states')
  .done(function(data) {
    data.rows.forEach(function(row) {
      var stateSQL = `SELECT the_geom, geoid FROM BRAZIL_municipalities_1 WHERE state_geoid = '${row.geoid}'`;
      console.log(stateSQL);
      sql.execute(stateSQL, {format: 'geojson'})
        .done(function(data) {
          fs.writeFileSync(`./tmp/BRAZIL_${row.geoid}.json`, data, 'utf8');
          exec(`./node_modules/.bin/topojson -p --simplify 0.0000001 -o public/vector_layers/municip_states/brazil/${row.geoid}.topo.json -- ./tmp/BRAZIL_${row.geoid}.json`)
        })
        .error(function(err) {
          console.log(err)
        })
    })
  });
