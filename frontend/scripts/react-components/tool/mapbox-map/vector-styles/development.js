

import { layer, conditionalRenderLayers } from './layer-utils';

const getDevelopmentLayers = () => ({
  brazil_biomes: [
    layer({
      name: 'brazil_biomes',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM brazil_biomes',
      renderLayers: [
        {
          type: 'line',
          paint: {
            'line-color': '#000',
            'line-width': 1,
            'line-opacity': 1
          }
        }
      ]
    }),
    layer({
      name: 'brazil_biomes-labels',
      id: 'brazil_biomes',
      type: 'geojson',
      renderLayers: conditionalRenderLayers({
        type: 'symbol',
        name: 'name',
        baseLayout: {
          'text-size': 12,
          'text-field': '{name}',
          'text-letter-spacing': 0.3,
          'text-allow-overlap': true
        },
        options: [
          { condition: '!=', value: 'MATA ATLANTICA' },
          { condition: '==', value: 'MATA ATLANTICA', layout: { 'text-offset': [-5, -82] } }
        ],
        metadata: {
          position: 'top'
        }
      })
    })
  ],
  brazil_water_scarcity: [
    layer({
      name: 'brazil_water_scarcity',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM brazil_water_scarcity',
      renderLayers: conditionalRenderLayers({
        type: 'fill',
        basePaint: {
          'fill-color': '#4575b4',
          'fill-opacity': 0.8
        },
        name: 'cat',
        options: [
          { condition: '<=', value: 7, paint: { 'fill-color': '#d73027' } },
          { condition: '<=', value: 6.5, paint: { 'fill-color': '#fc8d59' } },
          { condition: '<=', value: 5.5, paint: { 'fill-color': '#fee090' } },
          { condition: '<=', value: 4.5, paint: { 'fill-color': '#ffffbf' } },
          { condition: '<=', value: 3.5, paint: { 'fill-color': '#e0f3f8' } },
          { condition: '<=', value: 2.5, paint: { 'fill-color': '#91bfdb' } },
          { condition: '<=', value: 1, paint: { 'fill-color': '#4575b4' } }
        ],
        metadata: {
          position: 'top'
        }
      })
    })
  ]
});

export default getDevelopmentLayers;
