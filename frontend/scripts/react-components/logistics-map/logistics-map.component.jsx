import React from 'react';
// leaflet import must be before map and layer-manager
import L from 'leaflet'; // eslint-disable-line
import WRIIcons from 'wri-api-components/icons';
import MapComponent, { MapControls, ZoomControl } from 'wri-api-components/dist/map';
import { LayerManager, Layer } from 'layer-manager/lib/react';
import { PluginLeaflet } from 'layer-manager';
import 'wri-api-components/dist/map.css';
import 'leaflet/dist/leaflet.css';
import 'styles/components/logistics-map/logistics-map.scss';

class LogisticsMap extends React.PureComponent {
  state = {
    layers: []
  };

  render() {
    const { layers } = this.state;
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
}

export default LogisticsMap;
