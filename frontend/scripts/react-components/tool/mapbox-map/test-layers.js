export default [
  {
    id: "test",
    name: "Test",
    source: {
      data:
        "https://p2cs-sei.carto.com/api/v2/sql?q=SELECT%20cartodb_id,%20the_geom,%20the_geom_webmercator,%20name,%20geoid%20FROM%20brazil_municipalities&format=geojson",
      type: "geojson"
    },
    type: "geojson",
    render: {
      layers: [
        {
          type: "fill",
          paint: {
            "fill-color": "#fff",
            'fill-opacity': 1
          }
        },
        {
          type: "line",
          paint: {
            "line-color": "#222",
            "line-width": 1
          }
        }
      ]
    }
  }
];