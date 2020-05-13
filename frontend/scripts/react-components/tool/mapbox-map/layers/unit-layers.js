import { layer } from './layer-utils';

export default () => {
  const unitLayer = {
    name: 'brazil_municipalities',
    id: 'brazil_municipalities',
    type: 'vector',
    source: {
      type: 'vector',
      promoteId: 'geoid',
      tiles: ['https://sandbox.trase.earth/services/brazil_municipalities/tiles/{z}/{x}/{y}.pbf']
    },
    sourceLayer: 'Brazil',
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

  return [layer(unitLayer)];
};
