import React, { useState, useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import {
  selectNodeFromGeoId,
  highlightNodeFromGeoId,
  loadMapChoropleth as loadMapChoroplethAction
} from 'react-components/tool/tool.actions';
import { toolLayersActions } from 'react-components/tool-layers/tool-layers.register';

import {
  getHighlightedNodesData,
  getSelectedColumnsIds,
  getHasExtraColumn
} from 'react-components/tool/tool.selectors';
import {
  getVisibleNodes,
  getSelectedColumnFilterNode
} from 'react-components/tool-links/tool-links.selectors';
import {
  getTooltipValues,
  getCountryName,
  getContextualLayers,
  getLogisticLayers
} from 'react-components/tool/map/map.selectors';
import {
  getMapView,
  getBasemap,
  getSelectedGeoNodes,
  getHighlightedGeoNodes,
  getChoroplethOptions,
  getSelectedMapContextualLayersData,
  getShouldFitBoundsSelectedPolygons,
  getMapDimensionsWarnings,
  getSelectedMapDimensionsUids,
  getSelectedUnitLayers
} from 'react-components/tool-layers/tool-layers.selectors';
import { getSelectedContext } from 'app/app.selectors';
import MapComponent from 'react-components/tool/map/map.component';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const mapStateToProps = state => {
  const { choropleth } = getChoroplethOptions(state);
  const selectedContext = getSelectedContext(state);
  return {
    choropleth,
    mapView: getMapView(state),
    shouldFitBoundsSelectedPolygons: getShouldFitBoundsSelectedPolygons(state),
    mapVectorData: state.toolLayers.data.mapVectorData,
    selectedGeoNodes: getSelectedGeoNodes(state),
    recolorByNodeIds: state.toolLinks.recolorByNodeIds,
    linkedGeoIds: state.toolLayers.linkedGeoIds,
    highlightedGeoNodes: getHighlightedGeoNodes(state)[0],
    defaultMapView: selectedContext ? selectedContext.map : null,
    selectedNodesIdsLength: state.toolLinks.selectedNodesIds.length,
    selectedColumnsIds: getSelectedColumnsIds(state),
    selectedMapContextualLayersData: getSelectedMapContextualLayersData(state),
    toolLayout: state.toolLayers.toolLayout,
    visibleNodes: getVisibleNodes(state),
    selectedBiomeFilter: getSelectedColumnFilterNode(state),
    basemapId: getBasemap(state),
    selectedMapDimensionsWarnings: getMapDimensionsWarnings(state),
    highlightedNodesData: getHighlightedNodesData(state),
    columns: state.toolLinks.data.columns,
    extraColumn: (getHasExtraColumn(state) && state.toolLinks.extraColumn) || null,
    tooltipValues: getTooltipValues(state),
    unitLayers: getSelectedUnitLayers(state),
    countryName: getCountryName(state),
    contextualLayers: getContextualLayers(state),
    logisticLayers: getLogisticLayers(state),
    selectedMapDimensions: getSelectedMapDimensionsUids(state)
  };
};

const mapDispatchToProps = {
  onPolygonClicked: geoId => selectNodeFromGeoId(geoId),
  onPolygonHighlighted: (geoId, coordinates) => highlightNodeFromGeoId(geoId, coordinates),
  onMoveEnd: (latlng, zoom) => toolLayersActions.saveMapView(latlng, zoom),
  loadMapChoropleth: loadMapChoroplethAction
};

const MapContainer = props => {
  const [map, setMap] = useState(null);
  const { selectedMapDimensions, loadMapChoropleth } = props;
  const previousSelectedMapDimensions = usePrevious(selectedMapDimensions);

  // Make sure we load the choropleth when the dimensions update. This fixes a race condition
  useEffect(() => {
    if (
      !isEqual(selectedMapDimensions, previousSelectedMapDimensions) &&
      selectedMapDimensions.filter(Boolean).length > 0
    ) {
      loadMapChoropleth();
    }
  }, [selectedMapDimensions, loadMapChoropleth, previousSelectedMapDimensions]);

  return React.createElement(MapComponent, { ...props, map, setMap });
};

MapContainer.propTypes = {
  loadMapChoropleth: PropTypes.func.isRequired,
  selectedMapDimensions: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
