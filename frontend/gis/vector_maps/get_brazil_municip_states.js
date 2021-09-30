#!/usr/bin/env node

const CartoDB = require('cartodb');
const exec = require('child_process').exec;
const fs = require('fs');

const sql = new CartoDB.SQL({ user: 'p2cs-sei' });

sql.execute('SELECT geoid FROM BRAZIL_states').done(data => {
  data.rows.forEach(row => {
    const stateSQL = `SELECT the_geom, geoid FROM BRAZIL_municipalities_1 WHERE state_geoid = '${row.geoid}'`;
    // eslint-disable-next-line no-console
    console.info(stateSQL);
    sql
      .execute(stateSQL, { format: 'geojson' })
      .done(d => {
        fs.writeFileSync(`./tmp/BRAZIL_${row.geoid}.json`, d, 'utf8');
        exec(
          `./node_modules/.bin/topojson -p --simplify 0.0000001 -o public/vector_layers/municip_states/brazil/${row.geoid}.topo.json -- ./tmp/BRAZIL_${row.geoid}.json`
        );
      })
      .error(err => {
        // eslint-disable-next-line no-console
        console.info(err);
      });
  });
});
