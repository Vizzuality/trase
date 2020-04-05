import React, { useState, useRef } from 'react';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';
import ReactMapGL from 'react-map-gl';

const activeLayers = [
  {
    params: {
      color: '#222'
    },
    id: 'brazil_municipalities',
    name: 'brazil_municipalities',
    type: 'vector',
    source: {
      type: 'vector',
      promoteId: 'cartodb_id',
      provider: {
        type: 'carto',
        account: 'p2cs-sei',
        layers: [
          {
            options: {
              cartocss: '#layer {  polygon-opacity: 1.0; polygon-fill: #704489 }',
              cartocss_version: '2.3.0',
              sql: 'SELECT cartodb_id, the_geom_webmercator, name, geoid FROM brazil_municipalities'
            },
            type: 'mapnik'
          }
        ]
      },
    },
    render: {
      layers: [
        {
          type: 'fill',
          'source-layer': 'layer0',
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
          'source-layer': 'layer0',
          paint: {
            'line-color': '#000000',
            'line-opacity': 0.1
          }
        }
      ]
    }
  }
];

function MapBoxMap() {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%'
  });
  const [loaded, setLoaded] = useState(false);
    const mapRef = useRef();
    if (!PluginMapboxGl) return null;

    const handleLoad = () => {
      // const { bounds } = this.props;
      setLoaded(true)

      // if (!isEmpty(bounds) && !!bounds.bbox) {
      //   fitBounds();
      // }
    };
    return (
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        onViewportChange={setViewport}
        onLoad={handleLoad}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        {loaded &&
          mapRef.current && (
            <LayerManager map={mapRef.current.getMap()} plugin={PluginMapboxGl}>
              {activeLayers.map(l => console.log('l', l) || (
                <Layer key={l.id} {...l} />
              ))}
            </LayerManager>
          )}
      </ReactMapGL>
    );
};

export default MapBoxMap;
