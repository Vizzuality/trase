export const MAP_STYLE = {
  version: 8,
  name: 'Mapbox Streets',
  sprite: 'mapbox://sprites/mapbox/streets-v8',
  glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
  sources: {},
  layers: [
    {
      id: 'bg-map',
      type: 'background',
      paint: {
        'background-color': '#fff0c2'
      }
    },
    {
      id: 'custom-layers',
      type: 'background',
      paint: {
        'background-opacity': 0
      }
    }
  ]
};

export const createLayer = ({ id, version, bounds, center, minzoom, maxzoom, tiles, sourceLayer, geoId }) => ({
  id,
  version,
  type: 'vector',
  source: {
    bounds,
    center,
    minzoom,
    maxzoom,
    type: 'vector',
    promoteId: 'geoid',
    tiles
  },
  render: {
    layers: [
      {
        'source-layer': sourceLayer,
        type: 'fill',
        paint: {
          'fill-color': '#D6CEAA',
          'fill-opacity': 1
        },
      },
      {
        filter: ['all', ['==', ['get', 'geoid'], geoId]],
        'source-layer': sourceLayer,
        type: 'fill',
        paint: {
          'fill-color': '#ea6869',
          'fill-opacity': 1
        },
      },
      {
        'source-layer': sourceLayer,
        type: 'line',
        paint: {
          'line-color': '#fff0c2',
          'line-width': 0.3
        },
      }
    ]
  }
});