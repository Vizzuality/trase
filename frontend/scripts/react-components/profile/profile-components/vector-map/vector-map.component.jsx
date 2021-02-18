import React, { useState, useRef, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';
import ReactMapGL from 'react-map-gl';
import 'react-components/tool/map/map.scss';
import capitalize from 'lodash/capitalize';
import geoViewport  from '@mapbox/geo-viewport';
import { createLayer, MAP_STYLE } from './vector-map-config';

const fitToBounds = ({ setViewport, viewport, bounds }) => {
  const WIDTH = 250;
  const HEIGHT = 250;
  const updatedViewport = geoViewport.viewport(bounds, [WIDTH, HEIGHT]);
  const [longitude, latitude] = updatedViewport.center;
  setViewport({ ...viewport, latitude, longitude, zoom: updatedViewport.zoom - 0.3 });
};

const VectorMap = ({ vectorLayer, geoId }) => {
  const [longitude, latitude] = vectorLayer.center;
  const initialViewport = { latitude, longitude, zoom: 4 }
  const [viewport, setViewport] = useState(initialViewport);
  const [map, setMap] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const mapRef = useRef();

  const sourceLayer = capitalize(vectorLayer.id.split('_')[0]);

  // Set map when loaded
  useEffect(() => {
    if (loaded && mapRef.current) {
      setMap(mapRef.current.getMap());
    }
    return undefined;
  }, [mapRef, loaded, setMap]);

  useEffect(() => {
    if (map) {
      const { bounds } =  vectorLayer;
      fitToBounds({ setViewport, viewport, bounds });
    }
    return undefined;
  }, [map]);

  const layer = createLayer({ ...vectorLayer, sourceLayer, geoId });
  return (
    <ReactMapGL
      ref={mapRef}
      {...viewport}
      onLoad={() => setLoaded(true)}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      width="100%"
      height="100%"
      mapStyle={MAP_STYLE}
      getCursor={() => 'default'}
    >
      {loaded && map && (
        <LayerManager map={map} plugin={PluginMapboxGl}>
          <Layer key={layer.id} {...layer} />
        </LayerManager>
      )}
    </ReactMapGL>
  );
}

VectorMap.propTypes = {
  vectorLayer: PropTypes.object
}

export default VectorMap;