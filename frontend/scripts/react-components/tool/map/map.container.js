/* eslint-disable no-shadow */
// see sankey.container for details on how to use those containers
import { toggleMap, toggleMapLayerMenu } from 'actions/app.actions';
import { selectNodeFromGeoId, highlightNodeFromGeoId, saveMapView } from 'actions/tool.actions';
import {
  getVisibleNodes,
  getSelectedBiomeFilter,
  getSelectedNodesGeoIds,
  getHighlightedNodesGeoIds
} from 'react-components/tool/tool.selectors';
import { getChoroplethOptions } from 'react-components/tool-layers/tool-layer.selectors';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import { connect } from 'react-redux';
import Map from 'react-components/tool/map/map.component';
import getBasemap from 'utils/getBasemap';

const mapStateToProps = state => {
  const { choropleth } = getChoroplethOptions(state);
  return {
    choropleth,
    mapView: state.toolLayers.mapView,
    mapVectorData: state.toolLayers.mapVectorData,
    currentPolygonType: state.toolLinks.selectedColumnsIds,
    selectedNodesGeoIds: getSelectedNodesGeoIds(state),
    recolorByNodeIds: state.toolLinks.recolorByNodeIds,
    linkedGeoIds: state.toolLayers.linkedGeoIds,
    selectedGeoIds: getSelectedNodesGeoIds(state),
    highlightedGeoId: getHighlightedNodesGeoIds(state)[0],
    defaultMapView: state.app.selectedContext ? state.app.selectedContext.map : null,
    forceDefaultMapView: !state.toolLinks.selectedNodesIds.length,
    selectedColumnsIds: state.toolLinks.selectedColumnsIds,
    selectedColumnId: state.toolLinks.selectedColumnsIds
      ? state.toolLinks.selectedColumnsIds[0]
      : undefined,
    selectedMapContextualLayersData: state.toolLayers.selectedMapContextualLayersData,
    isMapVisible: state.toolLayers.isMapVisible,
    visibleNodes: getVisibleNodes(state),
    selectedBiomeFilter: getSelectedBiomeFilter(state),
    basemapId: getBasemap(state)
  };
};

const methodProps = [
  {
    name: 'setMapView',
    compared: ['mapView'],
    returned: ['mapView']
  },
  {
    name: 'showLoadedMap',
    compared: ['mapVectorData'],
    returned: [
      'mapView',
      'mapVectorData',
      'currentPolygonType',
      'selectedNodesGeoIds',
      'choropleth',
      'linkedGeoIds',
      'defaultMapView',
      'selectedBiomeFilter',
      'forceDefaultMapView'
    ]
  },
  {
    name: 'selectPolygonType',
    compared: ['selectedColumnId'],
    returned: [
      'selectedColumnsIds',
      'choropleth',
      'selectedBiomeFilter',
      'linkedGeoIds',
      'defaultMapView',
      'forceDefaultMapView'
    ]
  },
  {
    name: 'selectPolygons',
    compared: ['selectedGeoIds'],
    returned: [
      'selectedGeoIds',
      'linkedGeoIds',
      'highlightedGeoId',
      'forceDefaultMapView',
      'defaultMapView'
    ]
  },
  {
    name: 'highlightPolygon',
    compared: ['highlightedGeoId'],
    returned: ['selectedGeoIds', 'highlightedGeoId']
  },
  {
    name: 'setChoropleth',
    compared: ['choropleth'],
    returned: [
      'choropleth',
      'selectedBiomeFilter',
      'linkedGeoIds',
      'defaultMapView',
      'forceDefaultMapView'
    ]
  },
  {
    name: 'loadContextLayers',
    compared: ['selectedMapContextualLayersData'],
    returned: ['selectedMapContextualLayersData']
  },
  {
    name: 'showLinkedGeoIds',
    compared: ['linkedGeoIds'],
    returned: [
      'choropleth',
      'selectedBiomeFilter',
      'linkedGeoIds',
      'selectedGeoIds',
      'defaultMapView',
      // get back to context default map view if no nodes are selected
      'forceDefaultMapView'
    ]
  },
  {
    name: 'invalidate',
    compared: ['isMapVisible'],
    returned: ['isMapVisible']
  },
  {
    name: 'setBasemap',
    compared: ['basemapId'],
    returned: [
      'basemapId',
      'choropleth',
      'selectedBiomeFilter',
      'linkedGeoIds',
      'defaultMapView',
      'forceDefaultMapView'
    ]
  },
  {
    name: 'filterByBiome',
    compared: ['selectedBiomeFilter'],
    returned: [
      'choropleth',
      'selectedBiomeFilter',
      'linkedGeoIds',
      'defaultMapView',
      'forceDefaultMapView'
    ]
  },
  {
    name: 'updatePointShadowLayer',
    compared: ['visibleNodes'],
    returned: ['visibleNodes', 'mapVectorData']
  }
];

const mapDispatchToProps = {
  onPolygonClicked: geoId => selectNodeFromGeoId(geoId),
  onPolygonHighlighted: (geoId, coordinates) => highlightNodeFromGeoId(geoId, coordinates),
  onToggleMap: () => toggleMap(),
  onToggleMapLayerMenu: () => toggleMapLayerMenu(),
  onMoveEnd: (latlng, zoom) => saveMapView(latlng, zoom)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(Map, methodProps, Object.keys(mapDispatchToProps)));
