import { createSelector } from 'reselect';

const getSelectedCommodity = state =>
  (state.location.query && state.location.query.commodity) || 'soy';
const getSelectedYear = state => (state.location.query && state.location.query.year) || 2016;
const getSelectedInspection = state =>
  state.location.query && state.location.query.inspection_level;
const getActiveLayersIds = state => (state.location.query && state.location.query.layers) || [];

const MARKERS_URL =
  'https://raw.githubusercontent.com/Vizzuality/trase/feat/logistics-map/frontend/public/images/logistics-map';

const templates = [
  {
    version: '0.0.1',
    name: 'crushing_facilities',
    commodity: 'soy',
    color: '#EA6869',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT to_date(year::varchar, 'yyyy') as year_date, * FROM "${CARTO_ACCOUNT}".brazil_crushing_facilities where year = {{year}}`,
          cartocss: `#layer { marker-width: 7; marker-fill: #EA6869; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-file: url('${MARKERS_URL}/crushing-icon.svg'); marker-width: ramp([capacity], range(15, 26), quantiles(7)); }`,
          cartocss_version: '2.3.0',
          interactivity: ['company', 'municipality', 'capacity']
        }
      }
    ],
    params_config: [{ key: 'year', default: 2016 }]
  },
  {
    version: '0.0.1',
    name: 'refining_facilities',
    commodity: 'soy',
    color: '#7AC1CA',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_refining_facilities where year = {{year}}`,
          cartocss: `#layer { marker-width: 7; marker-fill: #7AC1CA; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-file: url('${MARKERS_URL}/refining-icon.svg'); marker-width: 24; }`,
          cartocss_version: '2.3.0',
          interactivity: ['company', 'municipality', 'capacity']
        }
      }
    ],
    params_config: [{ key: 'year', default: 2016 }]
  },
  {
    version: '0.0.1',
    name: 'storage_facilities',
    commodity: 'soy',
    color: '#F6CF71',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_storage_facilities_sample`,
          cartocss: `#layer { marker-width: 7; marker-fill: #F6CF71; marker-fill-opacity: 0.9; marker-allow-overlap: true;  marker-line-color: #FFFFFF; marker-line-width: 1; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-file: url('${MARKERS_URL}/storage-icon.svg'); marker-width: ramp([capacity], range(15, 26), quantiles(7)); }`,
          cartocss_version: '2.3.0',
          interactivity: ['company', 'municipality', 'capacity']
        }
      }
    ]
  },
  {
    version: '0.0.1',
    name: 'confirmed_slaughterhouse',
    commodity: 'cattle',
    color: '#F39B73',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_slaughterhouses_simple_2018_09_18 where subclass = 'CONFIRMED SLAUGHTERHOUSE' {{and}}`,
          cartocss: `#layer { marker-width: 7; marker-fill: #F39B73; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-file: url('${MARKERS_URL}/slaughterhouse-icon.svg'); marker-width: 24; }`,
          cartocss_version: '2.3.0',
          interactivity: ['company', 'state', 'municipality', 'subclass', 'inspection_level']
        }
      }
    ],
    sql_config: [{ type: 'and', key: 'inspection_level' }]
  },
  {
    version: '0.0.1',
    name: 'unconfirmed_slaughterhouse_multifunctional_facility',
    commodity: 'cattle',
    color: '#7AC1CA',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_slaughterhouses_simple_2018_09_18 where subclass = 'UNCONFIRMED SLAUGHTERHOUSE (MULTIFUNCTIONAL FACILITY)' {{and}}`,
          cartocss: `#layer { marker-width: 7; marker-fill: #7AC1CA; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-file: url('${MARKERS_URL}/slaughterhouse-icon.svg'); marker-width: 24; }`,
          cartocss_version: '2.3.0',
          interactivity: ['company', 'state', 'municipality', 'subclass', 'inspection_level']
        }
      }
    ],
    sql_config: [{ type: 'and', key: 'inspection_level' }]
  },
  {
    version: '0.0.1',
    name: 'probable_slaughterhouse',
    commodity: 'cattle',
    color: '#F6CF71',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_slaughterhouses_simple_2018_09_18 where subclass = 'PROBABLE SLAUGHTERHOUSE' {{and}}`,
          cartocss: `#layer { marker-width: 7; marker-fill: #F6CF71; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-file: url('${MARKERS_URL}/slaughterhouse-icon.svg'); marker-width: 24; }`,
          cartocss_version: '2.3.0',
          interactivity: ['company', 'state', 'municipality', 'subclass', 'inspection_level']
        }
      }
    ],
    sql_config: [{ type: 'and', key: 'inspection_level' }]
  },
  {
    version: '0.0.1',
    name: 'unconfirmed_slaughterhouse',
    commodity: 'cattle',
    color: '#DCB0F2',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_slaughterhouses_simple_2018_09_18 where subclass = 'UNCONFIRMED SLAUGHTERHOUSE' {{and}}`,
          cartocss: `#layer { marker-width: 7; marker-fill: #DCB0F2; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-file: url('${MARKERS_URL}/slaughterhouse-icon.svg'); marker-width: 24; }`,
          cartocss_version: '2.3.0',
          interactivity: ['company', 'state', 'municipality', 'subclass', 'inspection_level']
        }
      }
    ],
    sql_config: [{ type: 'and', key: 'inspection_level' }]
  }
];

export const getActiveParams = createSelector(
  [getSelectedYear, getSelectedCommodity, getSelectedInspection],
  (year, commodity, inspection) => ({ year, commodity, inspection_level: inspection })
);

export const getLogisticsMapLayers = createSelector(
  [getActiveLayersIds, getActiveParams],
  (layersIds, activeParams) =>
    templates
      .filter(template => activeParams.commodity === template.commodity)
      .map(template => ({
        name: template.name,
        opacity: 1,
        id: template.name,
        active: layersIds.includes(template.name),
        type: 'layer',
        provider: 'carto',
        color: template.color,
        layerConfig: {
          account: CARTO_ACCOUNT,
          body: {
            layers: template.layers,
            minzoom: 2,
            maxzoom: 20
          },
          type: 'carto',
          service: 'carto'
        },
        interactivity: template.layers[0].options.interactivity,
        params:
          template.params_config &&
          template.params_config.reduce(
            (acc, next) => ({ ...acc, [next.key]: activeParams[next.key] || next.default }),
            {}
          ),
        sqlParams:
          template.sql_config &&
          template.sql_config.reduce(
            (acc, next) => ({
              ...acc,
              [next.type]: {
                ...acc[next.type],
                [next.key]:
                  (activeParams[next.key] || next.default) &&
                  `'${activeParams[next.key] || next.default}'`
              }
            }),
            {}
          )
      }))
);

export const getActiveLayers = createSelector(
  [getActiveLayersIds, getLogisticsMapLayers],
  (layersIds, layers) => layers.filter(layer => !!layersIds.includes(layer.name))
);
