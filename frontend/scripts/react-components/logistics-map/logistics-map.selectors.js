import { createSelector } from 'reselect';

const getSelectedContext = state => state.app.selectedContext;
const getSelectedYear = state => state.logisticsMap.selectedYear;
const getLayersStatus = state => state.logisticsMap.layersStatus;

const MARKERS_URL =
  'https://raw.githubusercontent.com/Vizzuality/trase/feat/logistics-map/frontend/public/images/logistics-map';

const templates = [
  {
    version: '0.0.1',
    name: 'crushing_facilities',
    commodityName: 'SOY',
    color: '#F89C74',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT to_date(year::varchar, 'yyyy') as year_date, * FROM "${CARTO_ACCOUNT}".brazil_crushing_facilities where year = {{year}}`,
          cartocss: `#layer { marker-width: 7; marker-fill: #F89C74; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-file: url('${MARKERS_URL}/crushing-icon.svg'); marker-width: ramp([capacity], range(15, 26), quantiles(7)); }`,
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
    commodityName: 'SOY',
    color: '#66C5CC',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_refining_facilities where year = {{year}}`,
          cartocss: `#layer { marker-width: 7; marker-fill: #66C5CC; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-file: url('${MARKERS_URL}/refining-icon.svg'); marker-width: 20; }`,
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
    commodityName: 'SOY',
    color: '#F6CF71',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_storage_facilities_sample`,
          cartocss: `#layer { marker-width: 7; marker-fill: #F6CF71; marker-fill-opacity: 0.9; marker-allow-overlap: true;  marker-line-color: #FFFFFF; marker-line-width: 1; marker-line-opacity: 1; } #layer[zoom>4] { marker-file: url('${MARKERS_URL}/storage-icon.svg'); marker-width: ramp([capacity], range(15, 26), quantiles(7)); }`,
          cartocss_version: '2.3.0',
          interactivity: ['company', 'municipality', 'capacity']
        }
      }
    ]
  },
  {
    version: '0.0.1',
    name: 'confirmed_slaughterhouse',
    commodityName: 'BEEF',
    color: '#F89C74',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_slaughterhouses_simple_2018_09_18 where subclass = 'CONFIRMED SLAUGHTERHOUSE'`,
          cartocss: `#layer { marker-width: 7; marker-fill: #F89C74; marker-fill-opacity: 1; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-file: url('${MARKERS_URL}/slaughterhouse-icon.svg'); marker-width: 20; }`,
          cartocss_version: '2.3.0',
          interactivity: ['company', 'state', 'municipality', 'subclass', 'inspection_level']
        }
      }
    ]
  },
  {
    version: '0.0.1',
    name: 'unconfirmed_slaughterhouse_multifunctional_facility',
    commodityName: 'BEEF',
    color: '#66C5CC',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_slaughterhouses_simple_2018_09_18 where subclass = 'UNCONFIRMED SLAUGHTERHOUSE (MULTIFUNCTIONAL FACILITY)'`,
          cartocss: `#layer { marker-width: 7; marker-fill: #66C5CC; marker-fill-opacity: 1; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-file: url('${MARKERS_URL}/slaughterhouse-icon.svg'); marker-width: 20; }`,
          cartocss_version: '2.3.0',
          interactivity: ['company', 'state', 'municipality', 'subclass', 'inspection_level']
        }
      }
    ]
  },
  {
    version: '0.0.1',
    name: 'probable_slaughterhouse',
    commodityName: 'BEEF',
    color: '#F6CF71',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_slaughterhouses_simple_2018_09_18 where subclass = 'PROBABLE SLAUGHTERHOUSE'`,
          cartocss: `#layer { marker-width: 7; marker-fill: #F6CF71; marker-fill-opacity: 1; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-file: url('${MARKERS_URL}/slaughterhouse-icon.svg'); marker-width: 20; }`,
          cartocss_version: '2.3.0',
          interactivity: ['company', 'state', 'municipality', 'subclass', 'inspection_level']
        }
      }
    ]
  },
  {
    version: '0.0.1',
    name: 'unconfirmed_slaughterhouse',
    commodityName: 'BEEF',
    color: '#DCB0F2',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_slaughterhouses_simple_2018_09_18 where subclass = 'UNCONFIRMED SLAUGHTERHOUSE'`,
          cartocss: `#layer { marker-width: 7; marker-fill: #DCB0F2; marker-fill-opacity: 1; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-file: url('${MARKERS_URL}/slaughterhouse-icon.svg'); marker-width: 20; }`,
          cartocss_version: '2.3.0',
          interactivity: ['company', 'state', 'municipality', 'subclass', 'inspection_level']
        }
      }
    ]
  }
];

const getActiveParams = createSelector(
  [getSelectedYear, getSelectedContext],
  (year, context) => ({ year, context })
);

export const getLogisticsMapLayers = createSelector(
  [getLayersStatus, getActiveParams],
  (status, activeParams) =>
    templates
      .filter(
        template =>
          activeParams.context && activeParams.context.commodityName === template.commodityName
      )
      .map(template => ({
        name: template.name,
        opacity: 1,
        id: template.name,
        active: !!status[template.name],
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
          )
      }))
);

export const getActiveLayers = createSelector(
  [getLayersStatus, getLogisticsMapLayers],
  (status, layers) => layers.filter(layer => !!status[layer.name])
);
