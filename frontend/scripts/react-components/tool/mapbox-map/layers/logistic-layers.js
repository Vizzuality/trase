import { createSelector } from 'reselect';
import template from 'lodash/template';
import chroma from 'chroma-js';
import { layer } from './layer-utils';

const getSelectedInspectionLevel = state => state.toolLayers.inspectionLevel;
const getSelectedNodes = state => state.toolLinks.selectedNodesIds || null;
const getNodes = state => state.toolLinks.data?.nodes || null;

export const getSelectedExporterNames = createSelector(
  [getSelectedNodes, getNodes],
  (selectedNodesIds, nodes) => {
    if (!selectedNodesIds || !nodes) return null;
    const exporterSelectedNodes = selectedNodesIds
      .map(n => nodes[n])
      .filter(n => n && n.type === 'EXPORTER');
    return exporterSelectedNodes.length ? exporterSelectedNodes.map(n => n.name) : null;
  }
);

const MARKERS_URL = NODE_ENV_DEV
  ? '/images/logistics-map'
  : `https://${window.location.hostname}/images/logistics-map`;

export const logisticLayerTemplates = {
  BRAZIL: [
    {
      commodityName: 'SOY',
      categoryName: 'Brazil facilities',
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
        },
        { key: 'company' }
      ],
      marker: `${MARKERS_URL}/crushing-icon-v2.svg`
    },
    {
      version: '0.0.1',
      categoryName: 'Brazil facilities',
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
        },
        { key: 'company' }
      ],
      marker: `${MARKERS_URL}/refining-icon-v2.svg`
    },
    {
      version: '0.0.1',
      id: 'brazil_storage_facilities',
      categoryName: 'Brazil facilities',
      sqlTable: 'brazil_storage_facilities',
      name: 'storage facilities',
      description: 'storage facilities',
      commodityName: 'SOY',
      color: '#F2B800',
      marker: `${MARKERS_URL}/storage-icon-v2.svg`,
      paramsConfig: [{ key: 'company' }]
    },
    {
      version: '0.0.1',
      id: 'confirmed_slaughterhouse',
      categoryName: 'Brazil slaughterhouses',
      sqlTable: 'slaughterhouses_2018_09_18',
      name: 'confirmed',
      description: 'confirmed',
      commodityName: 'BEEF',
      color: '#803C8D',
      paramsConfig: [
        { key: 'subclass', value: `'CONFIRMED SLAUGHTERHOUSE'` },
        { key: 'company' },
        { key: 'inspection_level' }
      ],
      marker: `${MARKERS_URL}/slaughterhouse-icon-v2.svg`
    },
    {
      version: '0.0.1',
      id: 'probable_slaughterhouse',
      categoryName: 'Brazil slaughterhouses',
      sqlTable: 'slaughterhouses_2018_09_18',
      name: 'probable slaughterhouses',
      description: 'probable',
      commodityName: 'BEEF',
      color: '#13A579',
      paramsConfig: [
        { key: 'subclass', value: `'PROBABLE SLAUGHTERHOUSE'` },
        { key: 'company' },
        { key: 'inspection_level' }
      ],
      marker: `${MARKERS_URL}/slaughterhouse-icon-v2.svg`
    },
    {
      version: '0.0.1',
      id: 'unconfirmed_slaughterhouse',
      categoryName: 'Brazil slaughterhouses',
      sqlTable: 'slaughterhouses_2018_09_18',
      name: 'unconfirmed slaughterhouses',
      description: 'unconfirmed',
      commodityName: 'BEEF',
      color: '#F2B800',
      paramsConfig: [
        { key: 'subclass', value: `'UNCONFIRMED SLAUGHTERHOUSE'` },
        { key: 'company' },
        { key: 'inspection_level' }
      ],
      marker: `${MARKERS_URL}/slaughterhouse-icon-v2.svg`
    },
    {
      version: '0.0.1',
      id: 'unconfirmed_slaughterhouse_multifunctional_facility',
      categoryName: 'Brazil slaughterhouses',
      sqlTable: 'slaughterhouses_2018_09_18',
      name: 'unconfirmed slaughterhouses (multi-functional)',
      description: 'unconfirmed (multi-functional)',
      commodityName: 'BEEF',
      color: '#888',
      paramsConfig: [
        { key: 'subclass', value: `'UNCONFIRMED SLAUGHTERHOUSE'` },
        { key: 'company' },
        { key: 'inspection_level' }
      ],
      marker: `${MARKERS_URL}/slaughterhouse-icon-v2.svg`
    }
  ]
};

export const getLogisticMapLayerTemplates = createSelector(
  [getSelectedExporterNames, getSelectedInspectionLevel],
  (exporterNames, inspectionLevel) =>
    Object.keys(logisticLayerTemplates)
      .map(country =>
        logisticLayerTemplates[country].map(l => {
          const sqlParams = l.paramsConfig
            ?.map(w => {
              switch (w.key) {
                case 'company':
                  return exporterNames && exporterNames.length
                    ? `company IN ('${exporterNames.join("' , '")}') `
                    : null;
                case 'inspection_level':
                  return inspectionLevel ? `inspection_level = '${inspectionLevel}' ` : null;
                default: {
                  const value = w.value || w.default;
                  return `${w.key} = ${value}`;
                }
              }
            })
            .filter(Boolean);
          const sqlParamsString = sqlParams?.length ? `WHERE ${sqlParams.join(' AND ')}` : '';
          const lightColor = l.color
            ? chroma(l.color)
                .alpha(0.5)
                .css()
            : '#000';
          const darkColor = l.color
            ? chroma(l.color)
                .darken(4)
                .alpha(0.5)
                .css()
            : '#000';
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
        })
      )
      .filter(Boolean)
);
