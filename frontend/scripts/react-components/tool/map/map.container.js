/* eslint-disable no-shadow */
// see sankey.container for details on how to use those containers
import { toggleMap, toggleMapLayerMenu } from 'actions/app.actions';
import { selectNodeFromGeoId, highlightNodeFromGeoId, saveMapView } from 'actions/tool.actions';
import {
  getSelectedNodesGeoIds,
  getHighlightedNodesGeoIds
} from 'react-components/tool/tool.selectors';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import { connect } from 'react-redux';
import Map from 'react-components/tool/map/map.component';
import getBasemap from 'utils/getBasemap';

const mapStateToProps = state => ({
  mapView: state.tool.mapView,
  mapVectorData: state.tool.mapVectorData,
  currentPolygonType: state.tool.selectedColumnsIds,
  selectedNodesGeoIds: getSelectedNodesGeoIds(state.tool),
  recolorByNodeIds: state.tool.recolorByNodeIds,
  choropleth: state.tool.choropleth,
  linkedGeoIds: state.tool.linkedGeoIds,
  selectedGeoIds: getSelectedNodesGeoIds(state.tool),
  highlightedGeoId: getHighlightedNodesGeoIds(state.tool)[0],
  defaultMapView: state.app.selectedContext ? state.app.selectedContext.map : null,
  biomeFilter: state.tool.selectedBiomeFilter,
  forceDefaultMapView: !state.tool.selectedNodesIds.length,
  selectedColumnsIds: state.tool.selectedColumnsIds,
  selectedColumnId: state.tool.selectedColumnsIds ? state.tool.selectedColumnsIds[0] : undefined,
  selectedMapContextualLayersData: state.tool.selectedMapContextualLayersData,
  isMapVisible: state.tool.isMapVisible,
  visibleNodes: state.tool.visibleNodes,
  selectedBiomeFilter: state.tool.selectedBiomeFilter,
  basemapId: getBasemap(state.tool)
});

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
      'biomeFilter',
      'forceDefaultMapView'
    ]
  },
  {
    name: 'selectPolygonType',
    compared: ['selectedColumnId'],
    returned: [
      'selectedColumnsIds',
      'choropleth',
      'biomeFilter',
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
this.setState();
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
