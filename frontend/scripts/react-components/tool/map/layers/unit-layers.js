import { CHOROPLETH_COLORS } from 'constants';
import { layer } from './layer-utils';

const featureStateConditional = (featureStateVariable, defaultValue) => [
  'case',
  ['any', ['to-boolean', ['feature-state', featureStateVariable]]],
  ['feature-state', featureStateVariable],
  defaultValue
];

export default (unitLayer, sourceLayer, darkBasemap, geoId='geoid') => {
  const { id, tiles, version, bounds, center, maxzoom, minzoom } = unitLayer;
  const styledUnitLayer = {
    name: id,
    id,
    version,
    bounds,
    center,
    maxzoom,
    minzoom,
    type: 'vector',
    source: {
      type: 'vector',
      promoteId: geoId,
      tiles
    },
    sourceLayer,
    variables: geoId,
    unitLayer: true,
    renderLayers: [
      {
        type: 'fill',
        paint: {
          'fill-color': featureStateConditional('color', CHOROPLETH_COLORS.fill_not_linked),
          'fill-opacity': featureStateConditional('fillOpacity', darkBasemap ? 0 : 1)
        },
        filter: ['!=', '$type', 'Point']
      },
      {
        type: 'line',
        paint: {
          'line-color': [
            'case',
            [
              'any',
              ['to-boolean', ['feature-state', 'selected']],
              ['to-boolean', ['feature-state', 'hover']]
            ],
            '#fff',
            '#ccc'
          ],
          'line-width': [
            'case',
            [
              'any',
              ['to-boolean', ['feature-state', 'selected']],
              ['to-boolean', ['feature-state', 'hover']]
            ],
            3,
            featureStateConditional('lineWidth', 0.5)
          ]
        },
        filter: ['!=', '$type', 'Point']
      },
      {
        type: 'circle',
        paint: {
          'circle-color': '#34444c',
          'circle-radius': [
            'case',
            [
              'any',
              ['to-boolean', ['feature-state', 'hover']],
              ['to-boolean', ['feature-state', 'selected']]
            ],
            4,
            3
          ],
          'circle-stroke-color': '#fff',
          'circle-stroke-width': [
            'case',
            [
              'any',
              ['to-boolean', ['feature-state', 'hover']],
              ['to-boolean', ['feature-state', 'selected']]
            ],
            3,
            featureStateConditional('lineWidth', 1)
          ]
        },
        filter: ['==', '$type', 'Point'],
        metadata: {
          position: 'top'
        }
      }
    ]
  };
  return [layer(styledUnitLayer)];
};
