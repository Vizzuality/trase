import template from 'lodash/template';
import chroma from 'chroma-js';
import { layer } from './layer-utils';

const MARKERS_URL = NODE_ENV_DEV
  ? '/images/logistics-map'
  : `https://${window.location.hostname}/images/logistics-map`;

export const logisticLayerTemplates = {
  BRAZIL: [
    {
      commodityName: 'SOY',
      version: '0.0.1',
      id: 'brazil_crushing_facilities',
      sqlTable: `brazil_crushing_facilities`,
      name: 'crushing facilities',
      description: 'crushing facilities',
      color: '#803C8D',
      paramsConfig: [
        {
          key: 'year',
          default: 2016,
          template: template(`to_date(<%= year %>::varchar, 'yyyy') as year_date`)
        }
      ],
      marker: `${MARKERS_URL}/crushing-icon-v2.svg`,
      sql_config: [{ type: 'and', key: 'company', name: 'companies' }]
    },
    {
      version: '0.0.1',
      id: 'brazil_refining_facilities',
      sqlTable: 'brazil_refining_facilities',
      name: 'refining facilities',
      description: 'refining facilities',
      commodityName: 'SOY',
      color: '#13A579',
      paramsConfig: [
        {
          key: 'year',
          default: 2016,
          template: template(`to_date({<%= year %>::varchar, 'yyyy') as year_date,`)
        }
      ],
      marker: `${MARKERS_URL}/refining-icon-v2.svg`,
      sql_config: [{ type: 'and', key: 'company', name: 'companies' }]
    },
    {
      version: '0.0.1',
      id: 'brazil_storage_facilities',
      sqlTable: 'brazil_storage_facilities',
      name: 'storage facilities',
      description: 'storage facilities',
      commodityName: 'SOY',
      color: '#F2B800',
      marker: `${MARKERS_URL}/storage-icon-v2.svg`,
      sql_config: [{ type: 'where', key: 'company', name: 'companies' }]
    },
    {
      version: '0.0.1',
      id: 'confirmed_slaughterhouse',
      sqlTable: 'slaughterhouses_2018_09_18',
      name: 'confirmed',
      description: 'confirmed',
      commodityName: 'BEEF',
      color: '#803C8D',
      paramsConfig: [{ key: 'subclass', value: `'CONFIRMED SLAUGHTERHOUSE'` }],
      marker: `${MARKERS_URL}/slaughterhouse-icon-v2.svg`,
      sql_config: [
        { type: 'and', key: 'inspection_level', name: 'inspection' },
        { type: 'and2', key: 'company', name: 'companies' }
      ]
    },
    {
      version: '0.0.1',
      id: 'probable_slaughterhouse',
      sqlTable: 'slaughterhouses_2018_09_18',
      name: 'probable',
      description: 'probable',
      commodityName: 'BEEF',
      color: '#13A579',
      paramsConfig: [{ key: 'subclass', value: `'PROBABLE SLAUGHTERHOUSE'` }],
      marker: `${MARKERS_URL}/slaughterhouse-icon-v2.svg`,
      sql_config: [
        { type: 'and', key: 'inspection_level', name: 'inspection' },
        { type: 'and2', key: 'company', name: 'companies' }
      ]
    },
    {
      version: '0.0.1',
      id: 'unconfirmed_slaughterhouse',
      sqlTable: 'slaughterhouses_2018_09_18',
      name: 'unconfirmed',
      description: 'unconfirmed',
      commodityName: 'BEEF',
      color: '#F2B800',
      paramsConfig: [{ key: 'subclass', value: `'UNCONFIRMED SLAUGHTERHOUSE'` }],
      marker: `${MARKERS_URL}/slaughterhouse-icon-v2.svg`,
      sql_config: [
        { type: 'and', key: 'inspection_level', name: 'inspection' },
        { type: 'and2', key: 'company', name: 'companies' }
      ]
    },
    {
      version: '0.0.1',
      id: 'unconfirmed_slaughterhouse_multifunctional_facility',
      sqlTable: 'slaughterhouses_2018_09_18',
      name: 'unconfirmed (multi-functional)',
      description: 'unconfirmed (multi-functional)',
      commodityName: 'BEEF',
      color: '#888',
      paramsConfig: [{ key: 'subclass', value: `'UNCONFIRMED SLAUGHTERHOUSE'` }],
      marker: `${MARKERS_URL}/slaughterhouse-icon-v2.svg`,
      sql_config: [
        { type: 'and', key: 'inspection_level', name: 'inspection' },
        { type: 'and2', key: 'company', name: 'companies' }
      ]
    }
  ]
};

export const getLogisticMapLayerTemplates = () => Object.keys(logisticLayerTemplates).map(country =>
  logisticLayerTemplates[country].map(l => {
    const sqlParams = l.paramsConfig?.map(w => {
      const value = w.value || w.default;
      return `${w.key} = ${value}`;
    });
    const sqlParamsString = sqlParams?.length ? `WHERE ${sqlParams.join(' AND ')}` : '';
    const lightColor = l.color ? chroma(l.color).alpha(0.5).css() : '#000';
    const darkColor = l.color ? chroma(l.color).darken(4).alpha(0.5).css() : '#000';
    return layer({
      name: l.id,
      type: 'vector',
      provider: 'carto',
      images: [
        {
          id: l.marker,
          src: l.marker,
          options: {
            sdf: true
          }
        }
      ],
      sql: `SELECT * FROM ${l.sqlTable} ${sqlParamsString}`,
      renderLayers: [
        {
          type: 'heatmap',
          maxzoom: 9,
          paint: {
            // Increase the heatmap weight based on frequency and property magnitude
            // 'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(0,0,0,0)',
              0.1,
              darkColor,
              1,
              lightColor
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
            // Transition from heatmap to symbol layer by zoom level
            'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
          }
        },
        {
          type: 'symbol',
          minzoom: 6,
          paint: {
            'icon-color': lightColor,
            'icon-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1]
          },
          layout: {
            'icon-image': l.marker,
            'icon-allow-overlap': true
          },
          metadata: {
            position: 'top'
          }
        }
      ]
    });
  }
)).filter(Boolean);
