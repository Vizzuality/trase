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
import { BASEMAPS } from 'constants';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import LogisticsMapLegend from 'react-components/logistics-map/logistics-map-legend/logistics-map-legend.component';
import LogisticsMapPanel from 'react-components/logistics-map/logistics-map-panel/logistics-map-panel.container';

import 'wri-api-components/dist/map.css';
import 'leaflet/dist/leaflet.css';
import 'scripts/react-components/logistics-map/logistics-map.scss';

function LogisticsMap(props) {
  const {
    bounds,
    layers,
    tooltips,
    mapPopUp,
    commodity,
    closeModal,
    isModalOpen,
    buildEvents,
    activeLayers,
    setLayerActive,
    getCurrentPopUp
  } = props;
  const Tooltip = p => <UnitsTooltip {...p.data} />;
  const heading = commodity === 'soy' ? 'soy facilities' : 'slaughterhouses';
  return (
    <div className="l-logistics-map">
      <div className="c-logistics-map">
        <WRIIcons />
        <MapComponent bounds={bounds} basemap={BASEMAPS.default}>
          {map => (
            <React.Fragment>
              <MapControls>
                <ZoomControl map={map} />
              </MapControls>
              <LayerManager map={map} plugin={PluginLeaflet}>
                {activeLayers.map(layer => (
                  <Layer key={layer.id} {...layer} events={buildEvents(layer)} />
                ))}
              </LayerManager>
              <MapPopup map={map} {...mapPopUp} onReady={getCurrentPopUp}>
                <Tooltip />
              </MapPopup>
            </React.Fragment>
          )}
        </MapComponent>
        <LogisticsMapLegend
          layers={layers}
          heading={heading}
          tooltips={tooltips}
          setLayerActive={setLayerActive}
        />
        <SimpleModal isOpen={isModalOpen} onRequestClose={closeModal}>
          <LogisticsMapPanel />
        </SimpleModal>
      </div>
    </div>
  );
}

LogisticsMap.propTypes = {
  layers: PropTypes.array,
  activeLayers: PropTypes.array,
  buildEvents: PropTypes.func,
  commodity: PropTypes.string,
  tooltips: PropTypes.object,
  isModalOpen: PropTypes.bool
};

export default LogisticsMap;
