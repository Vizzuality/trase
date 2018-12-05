import React from 'react';
import PropTypes from 'prop-types';
// leaflet import must be before map and layer-manager
// eslint-disable-next-line
import L from 'leaflet';
import MapComponent, { MapControls, ZoomControl } from 'wri-api-components/dist/map';
import WRIIcons from 'wri-api-components/dist/icons';
import { Layer, LayerManager } from 'layer-manager/lib/react';
import { PluginLeaflet } from 'layer-manager/lib';
import 'wri-api-components/dist/map.css';
import 'leaflet/dist/leaflet.css';
import 'styles/components/logistics-map/logistics-map.scss';

function LogisticsMap(props) {
  const { layers } = props;

  return (
    <div className="l-logistics-map">
      <div className="c-logistics-map">
        <WRIIcons />
        <MapComponent>
          {map => (
            <React.Fragment>
              <MapControls>
                <ZoomControl map={map} />
              </MapControls>
              <LayerManager map={map} plugin={PluginLeaflet}>
                {layers.map(layer => (
                  <Layer key={layer.id} {...layer} />
                ))}
              </LayerManager>
            </React.Fragment>
          )}
        </MapComponent>
      </div>
    </div>
  );
}

LogisticsMap.propTypes = {
  layers: PropTypes.array
};

export default LogisticsMap;
