import React from 'react';
import PropTypes from 'prop-types';
// leaflet import must be before map and layer-manager
// eslint-disable-next-line
import L from 'leaflet';
import 'leaflet-utfgrid/L.UTFGrid-min';
import MapComponent, { MapControls, ZoomControl, MapPopup } from 'vizzuality-components/dist/map';
import WRIIcons from 'vizzuality-components/dist/icons';

import { Layer, LayerManager } from 'layer-manager/dist/components';
import { PluginLeaflet } from 'layer-manager';
import { BASEMAPS } from 'constants';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import LogisticsMapLegend from 'react-components/logistics-map/logistics-map-legend/logistics-map-legend.component';
import LogisticsMapPanel from 'react-components/logistics-map/logistics-map-panel/logistics-map-panel.container';
import LogisticsMapDownload from 'react-components/logistics-map/logistics-map-download/logistics-map-download.container';
import ToolBar from 'react-components/shared/tool-bar';

import 'vizzuality-components/dist/map.css';
import 'leaflet/dist/leaflet.css';
import 'scripts/react-components/logistics-map/logistics-map.scss';
import Timeline from 'react-components/tool/timeline/timeline.component';

function LogisticsMap(props) {
  const {
    bounds,
    border,
    layers,
    tooltips,
    mapPopUp,
    heading,
    closeModal,
    selectYears,
    activeModal,
    buildEvents,
    activeLayers,
    setLayerActive,
    getCurrentPopUp,
    logisticsMapYearProps
  } = props;
  const Tooltip = p => <UnitsTooltip {...p.data} />;
  return (
    <div className="l-logistics-map">
      <div className="c-logistics-map">
        <ToolBar className="-no-margin" />
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
                <Layer {...border} />
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
        <SimpleModal isOpen={activeModal !== null} onRequestClose={closeModal}>
          {activeModal === 'companies' && <LogisticsMapPanel close={closeModal} />}
          {activeModal === 'download' && <LogisticsMapDownload close={closeModal} />}
        </SimpleModal>
      </div>
      <Timeline {...logisticsMapYearProps} selectYears={selectYears} />
    </div>
  );
}

LogisticsMap.propTypes = {
  layers: PropTypes.array,
  openModal: PropTypes.func,
  tooltips: PropTypes.object,
  closeModal: PropTypes.func,
  selectYears: PropTypes.func,
  buildEvents: PropTypes.func,
  heading: PropTypes.string,
  activeModal: PropTypes.string,
  activeLayers: PropTypes.array,
  bounds: PropTypes.object,
  border: PropTypes.object,
  logisticsMapYearProps: PropTypes.any,
  getCurrentPopUp: PropTypes.func.isRequired,
  setLayerActive: PropTypes.func.isRequired,
  mapPopUp: PropTypes.object
};

export default LogisticsMap;
