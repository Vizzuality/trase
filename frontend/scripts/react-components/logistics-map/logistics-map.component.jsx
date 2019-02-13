import React from 'react';
import PropTypes from 'prop-types';
// leaflet import must be before map and layer-manager
// eslint-disable-next-line
import L from 'leaflet';
import 'leaflet-utfgrid/L.UTFGrid-min';
import MapComponent, { MapControls, ZoomControl, MapPopup } from 'wri-api-components/dist/map';
import WRIIcons from 'wri-api-components/dist/icons';

import { Layer, LayerManager } from 'layer-manager/dist/components';
import { PluginLeaflet } from 'layer-manager';
import { BASEMAPS } from 'constants';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import LogisticsMapLegend from 'react-components/logistics-map/logistics-map-legend/logistics-map-legend.component';
import LogisticsMapPanel from 'react-components/logistics-map/logistics-map-panel/logistics-map-panel.container';
import LogisticsMapBar from 'react-components/logistics-map/logistics-map-bar/logistics-map-bar.container';
import LogisticsMapDownload from 'react-components/logistics-map/logistics-map-download/logistics-map-download.container';
import BRAZIL_COUNTRY from 'react-components/logistics-map/BRAZIL_COUNTRY.json';

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
    openModal,
    closeModal,
    activeModal,
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
            <>
              <MapControls>
                <ZoomControl map={map} />
              </MapControls>
              <LayerManager map={map} plugin={PluginLeaflet}>
                {activeLayers.map(layer => (
                  <Layer key={layer.id} {...layer} events={buildEvents(layer)} />
                ))}
                <Layer {...LogisticsMap.BRAZIL_BORDER} />
              </LayerManager>
              <MapPopup map={map} {...mapPopUp} onReady={getCurrentPopUp}>
                <Tooltip />
              </MapPopup>
            </>
          )}
        </MapComponent>
        <LogisticsMapLegend
          layers={layers}
          heading={heading}
          tooltips={tooltips}
          setLayerActive={setLayerActive}
        />
        <LogisticsMapBar openModal={openModal} />
        <SimpleModal isOpen={activeModal !== null} onRequestClose={closeModal}>
          {activeModal === 'companies' && <LogisticsMapPanel close={closeModal} />}
          {activeModal === 'download' && <LogisticsMapDownload close={closeModal} />}
        </SimpleModal>
      </div>
    </div>
  );
}
LogisticsMap.BRAZIL_BORDER = {
  provider: 'leaflet',
  layerConfig: {
    type: 'geoJSON',
    body: BRAZIL_COUNTRY,
    options: {
      style: {
        weight: 1,
        color: '#34444C',
        opacity: 0.2,
        fill: false
      }
    }
  }
};

LogisticsMap.propTypes = {
  layers: PropTypes.array,
  openModal: PropTypes.func,
  tooltips: PropTypes.object,
  closeModal: PropTypes.func,
  buildEvents: PropTypes.func,
  commodity: PropTypes.string,
  activeModal: PropTypes.string,
  activeLayers: PropTypes.array,
  bounds: PropTypes.object,
  getCurrentPopUp: PropTypes.func.isRequired,
  setLayerActive: PropTypes.func.isRequired,
  mapPopUp: PropTypes.object
};

export default LogisticsMap;
