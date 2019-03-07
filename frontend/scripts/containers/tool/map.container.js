/* eslint-disable no-shadow */
// see sankey.container for details on how to use those containers
import { toggleMap, toggleMapLayerMenu } from 'actions/app.actions';
import { selectNodeFromGeoId, highlightNodeFromGeoId, saveMapView } from 'actions/tool.actions';
import {
  getSelectedNodesGeoIds,
  getHighlightedNodesGeoIds
} from 'react-components/tool/tool.selectors';
import connect from 'base/connect';
import Map from 'components/tool/map.component';
import getBasemap from '../helpers/getBasemap';

const mapMethodsToState = state => ({
  setMapView: state.tool.mapView,
  showLoadedMap: {
    _comparedValue: state => state.tool.mapVectorData,
    _returnedValue: state => ({
      mapVectorData: state.tool.mapVectorData,
      currentPolygonType: state.tool.selectedColumnsIds,
      selectedNodesGeoIds: getSelectedNodesGeoIds(state.tool),
      recolorByNodeIds: state.tool.recolorByNodeIds,
      choropleth: state.tool.choropleth,
      linkedGeoIds: state.tool.linkedGeoIds,
      defaultMapView: state.app.selectedContext ? state.app.selectedContext.map : null,
      biomeFilter: state.tool.selectedBiomeFilter,
      forceDefaultMapView: !state.tool.selectedNodesIds.length
    })
  },
  selectPolygonType: {
    _comparedValue: state =>
      state.tool.selectedColumnsIds ? state.tool.selectedColumnsIds[0] : undefined,
    _returnedValue: state => ({
      selectedColumnsIds: state.tool.selectedColumnsIds,
      choropleth: state.tool.choropleth,
      biomeFilter: state.tool.selectedBiomeFilter,
      linkedGeoIds: state.tool.linkedGeoIds,
      defaultMapView: state.tool.selectedContext ? state.tool.selectedContext.map : null,
      forceDefaultMapView: !state.tool.selectedNodesIds.length
    })
  },
  selectPolygons: {
    _comparedValue: state => getSelectedNodesGeoIds(state.tool),
    _returnedValue: state => ({
      selectedGeoIds: getSelectedNodesGeoIds(state.tool),
      linkedGeoIds: state.tool.linkedGeoIds,
      defaultMapView: state.app.selectedContext ? state.app.selectedContext.map : null,
      forceDefaultMapView: !state.tool.selectedNodesIds.length
    })
  },
  highlightPolygon: {
    _comparedValue: state => getHighlightedNodesGeoIds(state.tool),
    _returnedValue: state => ({
      selectedGeoIds: getSelectedNodesGeoIds(state.tool),
      highlightedGeoId: getHighlightedNodesGeoIds(state.tool)[0]
    })
  },
  setChoropleth: {
    _comparedValue: state => state.tool.choropleth,
    _returnedValue: state => ({
      choropleth: state.tool.choropleth,
      selectedBiomeFilter: state.tool.selectedBiomeFilter,
      linkedGeoIds: state.tool.linkedGeoIds,
      defaultMapView: state.tool.selectedContext ? state.tool.selectedContext.map : null,
      forceDefaultMapView: !state.tool.selectedNodesIds.length
    })
  },
  loadContextLayers: state.tool.selectedMapContextualLayersData,
  showLinkedGeoIds: {
    _comparedValue: state => state.tool.linkedGeoIds,
    _returnedValue: state => ({
      choropleth: state.tool.choropleth,
      selectedBiomeFilter: state.tool.selectedBiomeFilter,
      linkedGeoIds: state.tool.linkedGeoIds,
      selectedGeoIds: getSelectedNodesGeoIds(state.tool),
      defaultMapView: state.app.selectedContext ? state.app.selectedContext.map : null,
      // get back to context default map view if no nodes are selected
      forceDefaultMapView: !state.tool.selectedNodesIds.length
    })
  },
  invalidate: state.tool.isMapVisible,
  setBasemap: {
    _comparedValue: state => getBasemap(state.tool),
    _returnedValue: state => ({
      basemapId: getBasemap(state.tool),
      choropleth: state.tool.choropleth,
      selectedBiomeFilter: state.tool.selectedBiomeFilter,
      linkedGeoIds: state.tool.linkedGeoIds,
      defaultMapView: state.tool.selectedContext ? state.tool.selectedContext.map : null,
      forceDefaultMapView: !state.tool.selectedNodesIds.length
    })
  },
  filterByBiome: {
    _comparedValue: state => state.tool.selectedBiomeFilter,
    _returnedValue: state => ({
      choropleth: state.tool.choropleth,
      selectedBiomeFilter: state.tool.selectedBiomeFilter,
      linkedGeoIds: state.tool.linkedGeoIds,
      defaultMapView: state.tool.selectedContext ? state.tool.selectedContext.map : null,
      forceDefaultMapView: !state.tool.selectedNodesIds.length
    })
  },
  updatePointShadowLayer: {
    _comparedValue: state => state.tool.visibleNodes,
    _returnedValue: state => ({
      mapVectorData: state.tool.mapVectorData,
      visibleNodes: state.tool.visibleNodes
    })
  }
});

const mapViewCallbacksToActions = () => ({
  onPolygonClicked: geoId => selectNodeFromGeoId(geoId),
  onPolygonHighlighted: (geoId, coordinates) => highlightNodeFromGeoId(geoId, coordinates),
  onToggleMap: () => toggleMap(),
  onToggleMapLayerMenu: () => toggleMapLayerMenu(),
  onMoveEnd: (latlng, zoom) => saveMapView(latlng, zoom)
});

export default connect(
  Map,
  mapMethodsToState,
  mapViewCallbacksToActions
);
