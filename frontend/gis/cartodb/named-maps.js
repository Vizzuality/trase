require('dotenv').config({ silent: true });

const flatMap = require('lodash').flatMap;
const fetch = require('node-fetch');
const templatesSchema = require('./templates.json');

const getCartoUrl = endpoint =>
  `https://${process.env.CARTO_ACCOUNT}.carto.com/${endpoint}?api_key=${process.env.CARTO_TOKEN}`;

function classifyTemplates(templates) {
  const getTemplates = existingTemplates =>
    templates.reduce(
      (acc, next) => {
        const exists = existingTemplates.find(t => next.name === t);
        return {
          ...acc,
          toUpdate: exists ? [...acc.toUpdate, next] : acc.toUpdate,
          toCreate: !exists ? [...acc.toCreate, next] : acc.toCreate
        };
      },
      { toUpdate: [], toCreate: [] }
    );

  return fetch(getCartoUrl('api/v1/map/named'))
    .then(res => res.json())
    .then(data => getTemplates(data.template_ids))
    .catch(e => console.error(e));
}

function getTemplatesByEnvironment(templates) {
  const ENVS = ['PRODUCTION', 'STAGING', 'SANDBOX'];
  return flatMap(templates, template =>
    ENVS.map(env => ({ ...template, name: `${template.name}__${env}`, id: template.name }))
  );
}

function update(templates) {
  const updates = templates.map(template =>
    fetch(getCartoUrl(`api/v1/map/named/${template.name}`), {
      method: 'PUT',
      body: JSON.stringify(template),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  );
  return Promise.all(updates);
}

function create(templates) {
  const updates = templates.map(template =>
    fetch(getCartoUrl('api/v1/map/named'), {
      method: 'POST',
      body: JSON.stringify(template),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  );
  return Promise.all(updates);
}

function instanciate(templates) {
  const updates = templates.map(template =>
    fetch(getCartoUrl(`api/v1/map/named/${template.name}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  );
  return Promise.all(updates);
}

function saveTemplates(templates, namedMaps) {
  const layers = namedMaps.reduce(
    (acc, next, i) => ({
      ...acc,
      [templates[i].id]: { uid: templates[i].name, layergroupid: next.layergroupid }
    }),
    {}
  );
  console.log(layers);
}

function applyTemplates(classified) {
  const { toUpdate, toCreate } = classified;
  const updated = update(toUpdate);
  const created = create(toCreate);
  Promise.all([updated, created])
    .then(() => instanciate([...toUpdate, ...toCreate]))
    .then(namedMaps => saveTemplates([...toUpdate, ...toCreate], namedMaps))
    .catch(e => console.error(e));
}

const allTemplates = getTemplatesByEnvironment(templatesSchema);
classifyTemplates(allTemplates).then(applyTemplates);
