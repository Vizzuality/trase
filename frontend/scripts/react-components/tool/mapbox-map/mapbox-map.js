import React, { useState } from 'react';
import { connect } from 'react-redux';
import { selectNodeFromGeoId, highlightNodeFromGeoId } from 'react-components/tool/tool.actions';
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
  getCountryName
} from 'react-components/tool/mapbox-map/mapbox-map.selectors';
import {
  getMapView,
  getBasemap,
  getSelectedNodesGeoIds,
  getHighlightedNodesGeoIds,
  getChoroplethOptions,
  getSelectedMapContextualLayersData,
  getShouldFitBoundsSelectedPolygons,
  getMapDimensionsWarnings,
  getSelectedUnitLayers
} from 'react-components/tool-layers/tool-layers.selectors';
import { getSelectedContext } from 'app/app.selectors';
import MapComponent from 'react-components/tool/mapbox-map/mapbox-map.component';

const mapStateToProps = state => {
  const { choropleth } = getChoroplethOptions(state);
  const selectedContext = getSelectedContext(state);
  return {
    choropleth,
    mapView: getMapView(state),
    shouldFitBoundsSelectedPolygons: getShouldFitBoundsSelectedPolygons(state),
    mapVectorData: state.toolLayers.data.mapVectorData,
    selectedNodesGeoIds: getSelectedNodesGeoIds(state),
    recolorByNodeIds: state.toolLinks.recolorByNodeIds,
    linkedGeoIds: state.toolLayers.linkedGeoIds,
    highlightedGeoIds: getHighlightedNodesGeoIds(state)[0],
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
    countryName: getCountryName(state)
  };
};

const mapDispatchToProps = {
  onPolygonClicked: geoId => selectNodeFromGeoId(geoId),
  onPolygonHighlighted: (geoId, coordinates) => highlightNodeFromGeoId(geoId, coordinates),
  onMoveEnd: (latlng, zoom) => toolLayersActions.saveMapView(latlng, zoom)
};

const MapContainer = (props) => {
  const [map, setMap] = useState(null);
  return React.createElement(
    MapComponent,
    {...props,
      map,
      setMap
    },
    )
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
