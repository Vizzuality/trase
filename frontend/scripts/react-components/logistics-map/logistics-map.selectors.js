import { createSelector } from 'reselect';

const getSelectedYear = state => state.logisticsMap.selectedYear;
const getLayersStatus = state => state.logisticsMap.layersStatus;

const templates = [
  {
    version: '0.0.1',
    name: 'crushing_facilities',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql:
            'SELECT to_date(year::varchar, \'yyyy\') as year_date, * FROM "p2cs-sei".brazil_crushing_facilities where year = {{year}}',
          cartocss:
            "#layer { marker-width: ramp([capacity], range(15, 26), quantiles(7)); marker-fill: #e1833b; marker-fill-opacity: 1; marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/industrial-18.svg'); marker-allow-overlap: true; marker-line-width: 0.5; marker-line-color: #000000; marker-line-opacity: 1; marker-comp-op: overlay; } #layer::labels { text-name: [company]; text-face-name: 'DejaVu Sans Book'; text-size: 12; text-fill: #a40000; text-label-position-tolerance: 0; text-halo-radius: 3; text-halo-fill: #fcfcfc; text-dy: 13; text-allow-overlap: false; text-placement: point; text-placement-type: dummy; }",
          cartocss_version: '2.3.0',
          interactivity: ['company', 'municipality', 'capacity']
        }
      }
    ],
    params_config: [{ key: 'year', default: 2016 }]
  },
  {
    version: '0.0.1',
    name: 'brazil_refining_facilities',
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: 'SELECT * FROM "p2cs-sei".brazil_refining_facilities where year = {{year}}',
          cartocss:
            '#layer { marker-width: 7; marker-fill: #EE4D5A; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; }',
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
    layers: [
      {
        type: 'cartodb',
        options: {
          sql: 'SELECT * FROM "p2cs-sei".brazil_storage_facilities_sample',
          cartocss:
            "#layer['mapnik::geometry_type'=1] { marker-width: 7; marker-fill: #EE4D5A; marker-fill-opacity: 0.9; marker-line-color: #FFFFFF; marker-line-width: 1; marker-line-opacity: 1; marker-type: ellipse; marker-allow-overlap: true; } #layer['mapnik::geometry_type'=2] { line-color: #4CC8A3; line-width: 1.5; line-opacity: 1; } #layer['mapnik::geometry_type'=3] { polygon-fill: #826DBA; polygon-opacity: 0.9; ::outline { line-color: #FFFFFF; line-width: 1; line-opacity: 0.5; } }",
          cartocss_version: '2.3.0',
          interactivity: ['company', 'municipality', 'capacity']
        }
      }
    ]
  }
];

const getActiveParams = createSelector(
  getSelectedYear,
  year => ({ year })
);

export const getLogisticsMapLayers = createSelector(
  [getLayersStatus, getActiveParams],
  (status, activeParams) =>
    templates.map(template => ({
      name: template.name,
      opacity: 1,
      id: template.name,
      active: !!status[template.name],
      type: 'layer',
      provider: 'carto',
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
