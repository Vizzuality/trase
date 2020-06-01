

import { layer, conditionalRenderLayers } from './layer-utils';

export const getRasterLayerTemplate = (identifier, url) => (
  {
    id: identifier,
    type: 'raster',
    version: '0.0.1',
    source: {
      type: 'raster',
      tiles: [url],
      minzoom: 2,
      maxzoom: 11 // TODO: add this to layer configuration
    }
  }
);

export const getContextualLayersTemplates = () => ({
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
        // symbol layers need metadata position top
        metadata: {
          position: 'top'
        },
        name: 'siglauf3',
        baseLayout: {
          'text-size': 12,
          'text-letter-spacing': 0.3,
          'text-allow-overlap': true
        },
        zooms: [
          {
            minzoom: 3,
            maxzoom: 4,
            layout: {
              'text-field': '{siglauf3}'
            }
          },
          {
            minzoom: 4,
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
        ]
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
        // symbol layers need metadata position top
        metadata: {
          position: 'top'
        },
        name: 'name',
        baseLayout: {
          'text-size': 15,
          'text-field': '{name}',
          'text-letter-spacing': 0.3,
          'text-allow-overlap': true
        },
        zooms: [
          {
            minzoom: 3,
            maxzoom: 4,
            filters: [
              { condition: '!=', value: 'MATA ATLANTICA' },
              {
                condition: '==',
                value: 'MATA ATLANTICA',
                layout: { 'text-offset': [-5, -82] }
              }
            ]
          },
          {
            minzoom: 4,
            filters: [
              { condition: '!=', value: 'MATA ATLANTICA' },
              {
                condition: '==',
                value: 'MATA ATLANTICA',
                layout: { 'text-offset': [8, -82] }
              }
            ],
            layout: {
              'text-size': 12
            }
          }
        ]
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
            minzoom: 2,
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
        ]
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
          }
        },
        {
          type: 'line',
          paint: {
            'line-color': '#ECC35F',
            'line-width': 1,
            'line-opacity': 1
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
          }
        },
        {
          type: 'line',
          paint: {
            'line-color': '#B4D84F',
            'line-width': 1,
            'line-opacity': 1
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
  ],
  paraguay_ecoregions_2018_11_14: [
    layer({
      name: 'paraguay_ecoregions_2018_11_14',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM paraguay_ecoregions_2018_11_14',
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
      name: 'paraguay_ecoregions_2018_11_14-labels',
      id: 'paraguay_ecoregions_2018_11_14',
      type: 'geojson',
      variables: ['simple_name'],
      renderLayers: conditionalRenderLayers({
        type: 'symbol',
        // symbol layers need metadata position top
        metadata: {
          position: 'top'
        },
        name: 'simple_name',
        baseLayout: {
          'text-letter-spacing': 0.3,
          'text-allow-overlap': true,
          'text-field': '{simple_name}'
        },
        zooms: [
          {
            minzoom: 4,
            maxzoom: 5,
            layout: {
              'text-size': 15
            }
          },
          {
            minzoom: 5,
            layout: {
              'text-size': 11
            }
          }
        ]
      })
    })
  ],
  paraguay_protected_areas_2018_11_14: [
    layer({
      name: 'paraguay_protected_areas_2018_11_14',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM paraguay_protected_areas_2018_11_14',
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
  paraguay_indigenous_areas_2018_11_14: [
    layer({
      name: 'paraguay_indigenous_areas_2018_11_14',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM paraguay_indigenous_areas_2018_11_14',
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
  py_deforestation_2013_2017_20190131: [
    layer({
      name: 'py_deforestation_2013_2017_20190131',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM py_deforestation_2013_2017_20190131',
      renderLayers: conditionalRenderLayers({
        type: 'fill',
        paint: {
          'fill-opacity': 1
        },
        name: 'year',
        zooms: [
          {
            minzoom: 2,
            filters: [
              {
                condition: '==',
                name: 'year',
                value: 2013,
                paint: { 'fill-color': '#ecda9a' }
              },
              {
                condition: '==',
                name: 'year',
                value: 2014,
                paint: { 'fill-color': '#f1b973' }
              },
              {
                condition: '==',
                name: 'year',
                value: 2015,
                paint: { 'fill-color': '#f7945d' }
              },
              {
                condition: '==',
                name: 'year',
                value: 2016,
                paint: { 'fill-color': '#f86f56' }
              },
              {
                condition: '==',
                name: 'year',
                value: 2017,
                paint: { 'fill-color': '#ee4d5a' }
              }
            ]
          }
        ]
      }).concat(
        conditionalRenderLayers({
          type: 'line',
          paint: {
            'line-opacity': 1
          },
          name: 'year',
          zooms: [
            {
              minzoom: 2,
              filters: [
                {
                  condition: '==',
                  name: 'year',
                  value: 2013,
                  paint: { 'line-color': '#ecda9a' }
                },
                {
                  condition: '==',
                  name: 'year',
                  value: 2014,
                  paint: { 'line-color': '#f1b973' }
                },
                {
                  condition: '==',
                  name: 'year',
                  value: 2015,
                  paint: { 'line-color': '#f7945d' }
                },
                {
                  condition: '==',
                  name: 'year',
                  value: 2016,
                  paint: { 'line-color': '#f86f56' }
                },
                {
                  condition: '==',
                  name: 'year',
                  value: 2017,
                  paint: { 'line-color': '#ee4d5a' }
                }
              ]
            }
          ]
        })
      )
    })
  ],
  colombia_regional_autonomous_corps: [
    layer({
      name: 'colombia_regional_autonomous_corps',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM colombia_regional_autonomous_corps',
      renderLayers: [
        {
          type: 'line',
          paint: {
            'line-color': '#000000',
            'line-width': 1,
            'line-opacity': 1
          }
        }
      ]
    }),
    layer({
      name: 'colombia_regional_autonomous_corps-labels',
      id: 'colombia_regional_autonomous_corps',
      type: 'geojson',
      variables: ['label'],
      renderLayers: conditionalRenderLayers({
        type: 'symbol',
        // symbol layers need metadata position top
        metadata: {
          position: 'top'
        },
        name: 'label',
        baseLayout: {
          'text-allow-overlap': true
        },
        zooms: [
          {
            minzoom: 6,
            layout: {
              'text-field': '{label}',
              'text-size': 12
            }
          }
        ]
      })
    })
  ],
  colombia_protected_areas: [
    layer({
      name: 'colombia_protected_areas',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM colombia_protected_areas',
      renderLayers: [
        {
          type: 'fill',
          paint: {
            'fill-color': '#B4D84F',
            'fill-opacity': 0.5
          }
        },
        {
          type: 'line',
          paint: {
            'line-color': '#B4D84F',
            'line-width': 1,
            'line-opacity': 1
          }
        }
      ]
    })
  ],
  ar_province_mainland_20191122: [
    layer({
      name: 'ar_province_mainland_20191122',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM ar_province_mainland_20191122',
      renderLayers: [
        {
          type: 'line',
          paint: {
            'line-color': '#000000',
            'line-width': 1,
            'line-opacity': 1
          }
        }
      ]
    }),
    layer({
      name: 'ar_province_mainland_20191122-labels',
      id: 'ar_province_mainland_20191122',
      type: 'geojson',
      variables: ['prov_name'],
      renderLayers: conditionalRenderLayers({
        type: 'symbol',
        // symbol layers need metadata position top
        metadata: {
          position: 'top'
        },
        name: 'prov_name',
        baseLayout: {
          'text-allow-overlap': false
        },
        zooms: [
          {
            minzoom: 3,
            layout: {
              'text-field': '{prov_name}',
              'text-size': 10
            }
          }
        ]
      })
    })
  ],
  ar_biomes_20191113: [
    layer({
      name: 'ar_biomes_20191113',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM ar_biomes_20191113',
      renderLayers: [
        {
          type: 'line',
          paint: {
            'line-color': '#000000',
            'line-width': 0.5,
            'line-opacity': 1
          }
        }
      ]
    }),
    layer({
      name: 'ar_biomes_20191113-labels',
      id: 'ar_biomes_20191113',
      type: 'geojson',
      variables: ['biome_name'],
      renderLayers: conditionalRenderLayers({
        type: 'symbol',
        // symbol layers need metadata position top
        metadata: {
          position: 'top'
        },
        name: 'biome_name',
        baseLayout: {
          'text-letter-spacing': 0.3,
          'text-size': 10
        },
        zooms: [
          {
            minzoom: 3,
            maxzoom: 5,
            filters: [
              {
                condition: '!=',
                value: ['CAMPOS Y MALEZALES', 'CHACO HUMEDO', 'ALTOS ANDES']
              },
              {
                condition: '==',
                value: 'CAMPOS Y MALEZALES',
                layout: { 'text-offset': [0, 2] }
              },
              { condition: '==', value: 'CHACO HUMEDO', layout: { 'text-offset': [0, -2] } },
              { condition: '==', value: 'ALTOS ANDES', layout: { 'text-offset': [0, 2] } }
            ],
            layout: {
              'text-size': 8,
              'text-field': '{biome_name}'
            }
          },
          {
            minzoom: 5,
            layout: {
              'text-size': 10,
              'text-field': '{biome_name}'
            }
          }
        ]
      })
    })
  ],
  // FIX: Permission denied
  argentina_protected_areas_20191117: [
    layer({
      name: 'argentina_protected_areas_20191117',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM argentina_protected_areas_20191117',
      renderLayers: conditionalRenderLayers({
        type: 'fill',
        basePaint: {
          'fill-opacity': 0.5
        },
        name: 'type',
        zooms: [
          {
            minzoom: 2,
            filters: [
              {
                condition: '!=',
                value: [
                  'National Protected Areas',
                  'National Defense Reservers',
                  'Ramsar',
                  'Natural World Heritage Sites',
                  'Provincial Protected Areas',
                  'Biosphere Reserves'
                ],
                paint: { 'fill-color': '#b3de69' }
              },
              {
                condition: '==',
                value: 'National Protected Areas',
                paint: { 'fill-color': '#8dd3c7' }
              },
              {
                condition: '==',
                value: 'National Defense Reservers',
                paint: { 'fill-color': '#ffffb3' }
              },
              { condition: '==', value: 'Ramsar', paint: { 'fill-color': '#bebada' } },
              {
                condition: '==',
                value: 'Natural World Heritage Sites',
                paint: { 'fill-color': '#fb8072' }
              },
              {
                condition: '==',
                value: 'Provincial Protected Areas',
                paint: { 'fill-color': '#80b1d3' }
              },
              {
                condition: '==',
                value: 'Biosphere Reserves',
                paint: { 'fill-color': '#fdb462' }
              }
            ]
          }
        ]
      })
    })
  ],
  argentina_deforestation_2015_2017_20191128: [
    layer({
      name: 'argentina_deforestation_2015_2017_20191128',
      type: 'vector',
      provider: 'carto',
      variables: ['year'],
      sql: 'SELECT * FROM argentina_deforestation_2015_2017_20191128',
      renderLayers: conditionalRenderLayers({
        type: 'fill',
        paint: {
          'fill-opacity': 1
        },
        name: 'year',
        zooms: [
          {
            minzoom: 2,
            filters: [
              {
                condition: '==',
                name: 'year',
                value: 2015,
                paint: { 'fill-color': '#f7945d' }
              },
              {
                condition: '==',
                name: 'year',
                value: 2016,
                paint: { 'fill-color': '#f86f56' }
              },
              {
                condition: '==',
                name: 'year',
                value: 2017,
                paint: { 'fill-color': '#ee4d5a' }
              }
            ]
          }
        ]
      }).concat(
        conditionalRenderLayers({
          type: 'line',
          paint: {
            'line-opacity': 1
          },
          name: 'year',
          zooms: [
            {
              minzoom: 2,
              filters: [
                {
                  condition: '==',
                  name: 'year',
                  value: 2015,
                  paint: { 'line-color': '#f7945d' }
                },
                {
                  condition: '==',
                  name: 'year',
                  value: 2016,
                  paint: { 'line-color': '#f86f56' }
                },
                {
                  condition: '==',
                  name: 'year',
                  value: 2017,
                  paint: { 'line-color': '#ee4d5a' }
                }
              ]
            }
          ]
        })
      )
    })
  ],
  id_provinces: [
    layer({
      name: 'id_provinces',
      type: 'vector',
      provider: 'carto',
      sql: 'SELECT * FROM indonesia_provinces_boundaries_20190614',
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
      name: 'id_provinces-labels',
      id: 'indonesia_provinces_boundaries_20190614',
      type: 'geojson',
      variables: ['prov'],
      renderLayers: conditionalRenderLayers({
        type: 'symbol',
        // symbol layers need metadata position top
        metadata: {
          position: 'top'
        },
        name: 'prov',
        baseLayout: {
          'text-size': 12,
          'text-allow-overlap': true
        },
        zooms: [
          {
            minzoom: 4,
            layout: {
              'text-field': '{prov}'
            },
            filters: [
              {
                condition: '!=',
                value: [
                  'SULAWESI UTARA',
                  'BENGKULU',
                  'SULAWESI TENGGARA',
                  'BANTEN',
                  'JAWA TIMUR',
                  'NUSA TENGGARA BARAT',
                  'NUSA TENGGARA TIMUR'
                ]
              },
              {
                condition: '==',
                value: ['SULAWESI UTARA'],
                layout: { 'text-offset': [0, -2] }
              },
              { condition: '==', value: ['BENGKULU'], layout: { 'text-offset': [0, 2] } },
              {
                condition: '==',
                value: ['SULAWESI UTARA'],
                layout: { 'text-offset': [0, 2] }
              },
              { condition: '==', value: ['BANTEN'], layout: { 'text-offset': [0, 2] } },
              { condition: '==', value: ['JAWA TIMUR'], layout: { 'text-offset': [0, -2] } },
              {
                condition: '==',
                value: ['NUSA TENGGARA BARAT'],
                layout: { 'text-offset': [0, 2] }
              },
              {
                condition: '==',
                value: ['NUSA TENGGARA TIMUR'],
                layout: { 'text-offset': [0, 1] }
              }
            ]
          }
        ]
      })
    })
  ]
});