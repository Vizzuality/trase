import { layer } from './layer-utils';

export default (unitLayer) => {
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
      promoteId: 'geoid',
      tiles
    },
    sourceLayer: `Brazil_${id}`,
    variables: ['geoid'],
    unitLayer: true,
    renderLayers: [
      {
        type: 'fill',
        paint: {
          'fill-color': '#fff',
          'fill-opacity': 1
        }
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
            '#000',
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
            0.2
          ]
        }
      }
    ]
  };

  return [layer(styledUnitLayer)];
};
