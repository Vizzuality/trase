import React, { useState, useRef, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';
import ReactMapGL from 'react-map-gl';
import 'react-components/tool/map/map.scss';

const VectorMap = ({ vectorLayer }) => {
  const [map, setMap] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const mapRef = useRef();

  // Set map when loaded
  useEffect(() => {
    if (loaded && mapRef.current) {
      setMap(mapRef.current.getMap());
    }
    return undefined;
  }, [mapRef, loaded, setMap]);

  return (
    <ReactMapGL
      ref={mapRef}
      onLoad={() => setLoaded(true)}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      width="100%"
      height="100%"
      minZoom={2}
      maxBounds={vectorLayer.bounds}
    >
      {loaded && map && (
        <LayerManager map={map} plugin={PluginMapboxGl}>
          {/* {vectorLayer && vectorLayer.map(l => <Layer key={l.id} {...l} />)} */}
        </LayerManager>
      )}
    </ReactMapGL>
  );
}

VectorMap.propTypes = {
  vectorLayer: PropTypes.object
}

export default VectorMap;