import React from 'react';
import PropTypes from 'prop-types';
// leaflet import must be before map and layer-manager
// eslint-disable-next-line
import L from 'leaflet';
import 'leaflet-utfgrid/L.UTFGrid-min';
import MapComponent, { MapControls, ZoomControl, MapPopup } from 'wri-api-components/dist/map';
import WRIIcons from 'wri-api-components/dist/icons';

import { Layer, LayerManager } from 'layer-manager/lib/react';
import { PluginLeaflet } from 'layer-manager/lib';
import UnitsTooltip from 'react-components/shared/units-tooltip.component';
import LogisticsMapLegend from 'react-components/logistics-map/logistics-map-legend.component';
import 'wri-api-components/dist/map.css';
import 'leaflet/dist/leaflet.css';
import 'styles/components/logistics-map/logistics-map.scss';

function LogisticsMap(props) {
  const { layers, buildEvents, mapPopUp, getCurrentPopUp, bounds } = props;
  const Tooltip = p => <UnitsTooltip {...p.data} />;
  return (
    <div className="l-logistics-map">
      <div className="c-logistics-map">
        <WRIIcons />
        <MapComponent bounds={bounds}>
          {map => (
            <React.Fragment>
              <MapControls>
                <ZoomControl map={map} />
              </MapControls>
              <LayerManager map={map} plugin={PluginLeaflet}>
                {layers.map(layer => (
                  <Layer key={layer.id} {...layer} events={buildEvents(layer)} />
                ))}
              </LayerManager>
              <MapPopup map={map} {...mapPopUp} onReady={getCurrentPopUp}>
                <Tooltip />
              </MapPopup>
            </React.Fragment>
          )}
        </MapComponent>
        <LogisticsMapLegend />
      </div>
    </div>
  );
}

LogisticsMap.propTypes = {
  layers: PropTypes.array,
  buildEvents: PropTypes.func
};

export default LogisticsMap;
