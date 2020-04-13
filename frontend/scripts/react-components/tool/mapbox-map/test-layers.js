export default [
  {
    params: {
      color: '#222'
    },
    id: 'brazil_municipalities',
    name: 'brazil_municipalities',
    type: 'geojson',
    source: {
      type: 'geojson',
      data: "https://p2cs-sei.carto.com/api/v2/sql?q=SELECT%20cartodb_id,%20the_geom,%20the_geom_webmercator,%20name,%20geoid%20FROM%20brazil_municipalities&format=geojson",
      promoteId: 'cartodb_id',
      provider: {
        type: 'carto',
        account: 'p2cs-sei'
      }
    },
    render: {
      layers: [
        {
          type: 'fill',
          featureState: {},
          paint: {
            'fill-color': '#5ca2d1',
            'fill-color-transition': {
              duration: 300,
              delay: 0
            },
            'fill-opacity': 1
          }
        },
        {
          type: 'line',
          paint: {
            'line-color': '#000000',
            'line-opacity': 0.1
          }
        }
      ]
    }
  }
];