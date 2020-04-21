import { layer, getFilter } from './layer-utils';

export default (hoveredGeoId = '', selectedNodesGeoIds) => {
  const unitLayer = {
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
          'line-width': 0.5
        }
      }
    ]
  };

  if (hoveredGeoId) {
    unitLayer.renderLayers = unitLayer.renderLayers.concat({
      type: 'line',
      filter: getFilter('==', 'geoid', hoveredGeoId),
      paint: {
        'line-color': '#fff',
        'line-width': 3
      }
    });
  }

  if (selectedNodesGeoIds?.length) {
    unitLayer.renderLayers = unitLayer.renderLayers.concat(
      {
        type: 'line',
        filter: getFilter('==', 'geoid', selectedNodesGeoIds, 'any'),
        paint: {
          'line-color': '#000',
          'line-width': 3
        }
      }
    );
  }

  return [layer(unitLayer)];
};
