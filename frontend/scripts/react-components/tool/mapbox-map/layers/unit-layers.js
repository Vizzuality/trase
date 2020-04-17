import { layer, getFilter } from './layer-utils';

export default (hoveredGeoId='') => [
  layer({
    name: 'brazil_municipalities',
    id: 'brazil_municipalities',
    type: 'geojson',
    variables: ['name', 'geoid'],
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
          'line-color': '#222',
          'line-width': 1
        }
      },
      {
        type: 'line',
        filter: getFilter('==',  'geoid', hoveredGeoId),
        paint: {
          'line-color': '#fff',
          'line-width': 3
        }
      }
    ]
  })
];