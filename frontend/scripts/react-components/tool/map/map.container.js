/* eslint-disable no-shadow */
import { selectNodeFromGeoId, highlightNodeFromGeoId } from 'react-components/tool/tool.actions';
import { toolLayersActions } from 'react-components/tool-layers/tool-layers.register';
import {
  getHighlightedNodesData,
  getSelectedColumnsIds,
  getHasExtraColumn
} from 'react-components/tool/tool.selectors';
import {
  getVisibleNodes,
  getSelectedColumnFilterNode,
  getSelectedResizeBy
} from 'react-components/tool-links/tool-links.selectors';
import {
  getMapView,
  getBasemap,
  getSelectedNodesGeoIds,
  getHighlightedNodesGeoIds,
  getChoroplethOptions,
  getSelectedMapContextualLayersData,
  getShouldFitBoundsSelectedPolygons,
  getMapDimensionsWarnings,
  getSelectedMapDimensionsData
} from 'react-components/tool-layers/tool-layers.selectors';
import { getSelectedContext } from 'app/app.selectors';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import { connect } from 'react-redux';
import Map from 'legacy/map.component';

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
    nodeHeights: state.toolLinks.data.nodeHeights,
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
    selectedResizeBy: getSelectedResizeBy(state),
    selectedMapDimensions: getSelectedMapDimensionsData(state),
    highlightedNodesData: getHighlightedNodesData(state),
    coordinates: state.toolLayers.highlightedNodeCoordinates,
    nodeAttributes: state.toolLinks.data.nodeAttributes,
    columns: state.toolLinks.data.columns,
    extraColumn: (getHasExtraColumn(state) && state.toolLinks.extraColumn) || null
  };
};

const methodProps = [
  {
    name: 'setMapView',
    compared: ['mapView', 'selectedNodesIdsLength', 'defaultMapView'],
    returned: ['mapView', 'selectedNodesIdsLength', 'defaultMapView']
  },
  {
    name: 'showLoadedMap',
    compared: ['mapVectorData'],
    returned: ['mapVectorData']
  },
  {
    name: 'selectPolygonType',
    compared: ['selectedColumnsIds', 'mapVectorData', 'columns', 'extraColumn'],
    returned: ['selectedColumnsIds', 'columns', 'extraColumn']
  },
  {
    name: 'selectPolygons',
    compared: ['selectedNodesGeoIds'],
    returned: ['selectedNodesGeoIds', 'highlightedGeoIds']
  },
  {
    name: 'highlightPolygon',
    compared: ['highlightedGeoIds'],
    returned: ['selectedNodesGeoIds', 'highlightedGeoIds']
  },
  {
    name: 'setChoropleth',
    compared: [
      'choropleth',
      'selectedBiomeFilter',
      'linkedGeoIds',
      'defaultMapView',
      'mapVectorData'
    ],
    returned: ['choropleth', 'selectedBiomeFilter', 'linkedGeoIds', 'defaultMapView']
  },
  {
    name: 'loadContextLayers',
    compared: ['selectedMapContextualLayersData'],
    returned: ['selectedMapContextualLayersData']
  },
  {
    name: 'showLinkedGeoIds',
    compared: ['linkedGeoIds', 'selectedNodesGeoIds'],
    returned: ['linkedGeoIds', 'selectedNodesGeoIds']
  },
  {
    name: 'invalidate',
    compared: ['toolLayout'],
    returned: ['toolLayout']
  },
  {
    name: 'setBasemap',
    compared: ['basemapId'],
    returned: ['basemapId']
  },
  {
    name: 'updatePointShadowLayer',
    compared: ['visibleNodes', 'mapVectorData'],
    returned: ['visibleNodes', 'mapVectorData', 'nodeHeights']
  },
  {
    name: 'fitBoundsSelectedGeoPolygons',
    compared: ['selectedNodesGeoIds', 'shouldFitBoundsSelectedPolygons'],
    returned: ['selectedNodesGeoIds', 'shouldFitBoundsSelectedPolygons']
  },
  {
    name: 'showMapWarnings',
    compared: ['selectedMapDimensionsWarnings'],
    returned: ['selectedMapDimensionsWarnings']
  },
  {
    name: 'highlightNode',
    compared: ['highlightedNodesData'],
    returned: [
      'nodeHeights',
      'selectedResizeBy',
      'selectedMapDimensions',
      'highlightedNodesData',
      'coordinates',
      'nodeAttributes'
    ]
  }
];

const mapDispatchToProps = {
  onPolygonClicked: geoId => selectNodeFromGeoId(geoId),
  onPolygonHighlighted: (geoId, coordinates) => highlightNodeFromGeoId(geoId, coordinates),
  onMoveEnd: (latlng, zoom) => toolLayersActions.saveMapView(latlng, zoom)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(Map, methodProps, Object.keys(mapDispatchToProps)));
