require('dotenv').config({ silent: true });

const fetch = require('node-fetch');
const templates = require('./templates.json');

const getCartoUrl = endpoint =>
  `https://${process.env.CARTO_ACCOUNT}.carto.com/${endpoint}?api_key=${process.env.CARTO_TOKEN}`;

function checkLayers() {
  console.log(
    templates.map(template => ({ ...template, name: `${template.name}___${process.env.APP_ENV}` }))
  );
  fetch(getCartoUrl('api/v1/map/named'))
    .then(res => res.json())
    .then(data => data.template_ids.length)
    .catch(e => console.error(e));
}

checkLayers();
