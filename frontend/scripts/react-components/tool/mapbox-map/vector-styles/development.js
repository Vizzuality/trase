

import { layer, conditionalRenderLayers } from './layer-utils';

const getDevelopmentLayers = () => ({
  brazil_states: [
    layer({
      name: 'brazil_states',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM brazil_states',
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
      name: 'brazil_states-labels',
      id: 'brazil_states',
      type: 'geojson',
      variables: ['name', 'siglauf3'],
      renderLayers: conditionalRenderLayers({
        type: 'symbol',
        name: 'siglauf3',
        baseLayout: {
          'text-size': 12,
          'text-letter-spacing': 0.3,
          'text-allow-overlap': true
        },
        zooms: [
          {
            minZoom: 3,
            maxZoom: 4,
            layout: {
              'text-field': '{siglauf3}'
            }
          },
          {
            minZoom: 4,
            filters: [
              { condition: '!=', name: 'name', value: ['DISTRITO FEDERAL'] },
              {
                condition: '==',
                name: 'name',
                value: 'DISTRITO FEDERAL',
                layout: { 'text-offset': [0, -1] }
              }
            ],
            layout: {
              'text-field': '{name}'
            }
          }
        ],
        metadata: {
          position: 'top'
        }
      })
    })
  ],
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
          'text-size': 15,
          'text-field': '{name}',
          'text-letter-spacing': 0.3,
          'text-allow-overlap': true
        },
        zooms: [
          {
            minZoom: 3,
            maxZoom: 4,
            filters: [
              { condition: '!=', value: 'MATA ATLANTICA' },
              { condition: '==', value: 'MATA ATLANTICA', layout: { 'text-offset': [-5, -82] } }
            ]
          },
          {
            minZoom: 4,
            filters: [
              { condition: '!=', value: 'MATA ATLANTICA' },
              { condition: '==', value: 'MATA ATLANTICA', layout: { 'text-offset': [8, -82] } }
            ],
            layout: {
              'text-size': 12
            }
          }
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
        zooms: [
          {
            minZoom: 2,
            filters: [
              { condition: '<=', value: 7, paint: { 'fill-color': '#d73027' } },
              { condition: '<=', value: 6.5, paint: { 'fill-color': '#fc8d59' } },
              { condition: '<=', value: 5.5, paint: { 'fill-color': '#fee090' } },
              { condition: '<=', value: 4.5, paint: { 'fill-color': '#ffffbf' } },
              { condition: '<=', value: 3.5, paint: { 'fill-color': '#e0f3f8' } },
              { condition: '<=', value: 2.5, paint: { 'fill-color': '#91bfdb' } },
              { condition: '<=', value: 1, paint: { 'fill-color': '#4575b4' } }
            ]
          }
        ],
        metadata: {
          position: 'top'
        }
      })
    })
  ],
  brazil_indigenous_areas: [
    layer({
      name: 'brazil_indigenous_areas',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM brazil_indigenous_areas',
      renderLayers: [
        {
          type: 'fill',
          paint: {
            'fill-color': '#ECC35F',
            'fill-opacity': 0.5
          },
          metadata: {
            position: 'top'
          }
        },
        {
          type: 'line',
          paint: {
            'line-color': '#ECC35F',
            'line-width': 1,
            'line-opacity': 1
          },
          metadata: {
            position: 'top'
          }
        }
      ]
    })
  ],
  brazil_protected: [
    layer({
      name: 'brazil_protected_areas',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM brazil_protected_areas',
      renderLayers: [
        {
          type: 'fill',
          paint: {
            'fill-color': '#B4D84F',
            'fill-opacity': 0.5
          },
          metadata: {
            position: 'top'
          }
        },
        {
          type: 'line',
          paint: {
            'line-color': '#B4D84F',
            'line-width': 1,
            'line-opacity': 1
          },
          metadata: {
            position: 'top'
          }
        }
      ]
    })
  ],
  brazil_defor_alerts: [
    layer({
      name: 'brazil_defor_alerts',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM brazil_deforestation_2017_20181001',
      renderLayers: [
        {
          type: 'fill',
          paint: {
            'fill-color': '#B40903',
            'fill-opacity': 1
          },
          metadata: {
            position: 'top'
          }
        },
        {
          type: 'line',
          paint: {
            'line-color': '#B40903',
            'line-width': 0.2,
            'line-opacity': 1
          },
          metadata: {
            position: 'top'
          }
        }
      ]
    })
  ]
});

export default getDevelopmentLayers;
