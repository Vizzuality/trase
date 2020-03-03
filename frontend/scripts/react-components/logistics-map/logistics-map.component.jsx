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
import Timeline from 'react-components/tool/timeline/timeline.component';
import ListModal from 'react-components/shared/list-modal';

import 'vizzuality-components/dist/map.css';
import 'leaflet/dist/leaflet.css';
import 'scripts/react-components/logistics-map/logistics-map.scss';

function LogisticsMap(props) {
  const {
    bounds,
    border,
    layers,
    tooltips,
    mapPopUp,
    heading,
    hubs,
    selectHub,
    activeHub,
    closeModal,
    selectYears,
    activeModal,
    buildEvents,
    activeLayers,
    setLayerActive,
    getCurrentPopUp,
    inspectionLevels,
    activeInspectionLevel,
    selectInspectionLevel,
    logisticsMapYearProps
  } = props;
  const Tooltip = p => <UnitsTooltip {...p.data} />;

  const onSelectHub = hub => {
    selectHub(hub.value);
    closeModal();
  };

  const onSelectInspectionLevel = hub => {
    selectInspectionLevel(hub.value);
    closeModal();
  };

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
          {activeModal === 'hubs' && (
            <ListModal
              items={hubs}
              onChange={onSelectHub}
              heading="Logistics map"
              selectedItem={activeHub}
              itemValueProp="value"
            />
          )}
          {activeModal === 'inspectionLevels' && (
            <ListModal
              items={inspectionLevels}
              onChange={onSelectInspectionLevel}
              heading="Inspection level"
              selectedItem={activeInspectionLevel}
              itemValueProp="value"
            />
          )}
        </SimpleModal>
      </div>
      <Timeline {...logisticsMapYearProps} selectYears={selectYears} />
    </div>
  );
}

LogisticsMap.propTypes = {
  layers: PropTypes.array,
  tooltips: PropTypes.object,
  closeModal: PropTypes.func,
  selectYears: PropTypes.func,
  buildEvents: PropTypes.func,
  heading: PropTypes.string,
  activeModal: PropTypes.string,
  activeLayers: PropTypes.array,
  bounds: PropTypes.object,
  border: PropTypes.object,
  hubs: PropTypes.array,
  selectHub: PropTypes.func,
  activeHub: PropTypes.object,
  inspectionLevels: PropTypes.array,
  activeInspectionLevel: PropTypes.object,
  selectInspectionLevel: PropTypes.func,
  logisticsMapYearProps: PropTypes.any,
  getCurrentPopUp: PropTypes.func.isRequired,
  setLayerActive: PropTypes.func.isRequired,
  mapPopUp: PropTypes.object
};

export default LogisticsMap;
