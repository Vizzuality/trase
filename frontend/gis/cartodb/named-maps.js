require('dotenv').config({ silent: true });
/* eslint-disable no-console */
const fetch = require('node-fetch');
const path = require('path');
const writeFileSync = require('fs').writeFileSync;
const ora = require('ora');

const DEFAULT_TYPE = 'tool';

const getCartoUrl = endpoint =>
  `https://${process.env.CARTO_ACCOUNT}.carto.com/${endpoint}?api_key=${process.env.CARTO_TOKEN}`;

const spinner = ora();

function classifyTemplates(templates) {
  spinner.start('Fetching existing templates');
  const getTemplates = (existingTemplates = []) => {
    const result = templates.reduce(
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
    spinner.succeed();
    return result;
  };

  return fetch(getCartoUrl('api/v1/map/named'))
    .then(res => res.json())
    .then(data => getTemplates(data.template_ids))
    .catch(e => console.error(e));
}

function readEnv() {
  const envFlag = process.argv[2];
  if (!envFlag || !envFlag.includes('--env=')) {
    throw new Error('You need to define --env');
  }
  const env = envFlag.split('--env=')[1];
  const typeFlag = process.argv[3];
  const type = (typeFlag && typeFlag.split('--type=')[1]) || DEFAULT_TYPE;
  return { env, type };
}

function getTemplatesByEnvironment() {
  const { env, type } = readEnv();
  spinner.start(`Reading templates from file system env: ${env} type: ${type}`);
  const templatesPath = path.join(__dirname, type, `templates.${env}.json`);
  // eslint-disable-next-line
  const templates = require(templatesPath);
  spinner.succeed();
  return templates.map(template => ({
    ...template,
    name: `${template.name}__${env}`,
    id: template.name
  }));
}

function update(templates) {
  spinner.start('Updating existing templates');
  const updates = templates.map(template =>
    fetch(getCartoUrl(`api/v1/map/named/${template.name}`), {
      method: 'PUT',
      body: JSON.stringify(template),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  );
  return Promise.all(updates).then(res => spinner.succeed() && res);
}

function create(templates) {
  spinner.start('Creating new templates');
  const updates = templates.map(template =>
    fetch(getCartoUrl('api/v1/map/named'), {
      method: 'POST',
      body: JSON.stringify(template),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  );
  return Promise.all(updates).then(res => spinner.succeed() && res);
}

function instanciate(templates) {
  spinner.start('Instanciating templates');
  const updates = templates.map(template =>
    fetch(getCartoUrl(`api/v1/map/named/${template.name}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .catch(console.error)
  );
  return Promise.all(updates).then(res => spinner.succeed() && res);
}

function saveTemplates(templates, namedMaps) {
  spinner.start('Saving templates to file system');
  const { env, type } = readEnv();
  const file = path.join(
    __dirname,
    '..',
    '..',
    'scripts',
    'named-maps',
    `${type}_context_layers_carto.js`
  );

  let existingLayers = {};
  try {
    // eslint-disable-next-line
    existingLayers = require(file);
  } catch (e) {
    spinner.info(`${file} not found. Creating one from scratch.`);
  }
  const layers = namedMaps.reduce(
    (acc, next, i) => ({
      ...acc,
      [templates[i].id]: { uid: templates[i].name, layergroupid: next.layergroupid }
    }),
    {}
  );
  const newLayers = {
    ...existingLayers,
    [env]: layers
  };
  const content = `// this file is generated by ${__dirname}/named-maps.js
  module.exports = ${JSON.stringify(newLayers, null, '  ')};
`;
  writeFileSync(file, content);
  spinner.succeed();
}

function applyTemplates(classified) {
  const { toUpdate, toCreate } = classified;
  const updated = toUpdate.length > 0 ? update(toUpdate) : [];
  const created = toCreate.length > 0 ? create(toCreate) : [];
  Promise.all([updated, created])
    .then(() => instanciate([...toUpdate, ...toCreate]))
    .then(namedMaps => saveTemplates([...toUpdate, ...toCreate], namedMaps))
    .catch(console.error);
}

const allTemplates = getTemplatesByEnvironment();
classifyTemplates(allTemplates).then(applyTemplates);
