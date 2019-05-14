import {
  GET_COLUMNS,
  GET_CONTEXT_LAYERS,
  GET_LINKED_GEOIDS,
  GET_MAP_VECTOR_DATA,
  SET_NODE_ATTRIBUTES,
  HIGHLIGHT_NODE,
  SET_MAP_LOADING_STATE,
  SAVE_MAP_VIEW,
  SELECT_BASEMAP,
  SELECT_CONTEXTUAL_LAYERS,
  SET_MAP_DIMENSIONS_SELECTION,
  TOGGLE_MAP,
  TOGGLE_MAP_DIMENSION,
  TOGGLE_MAP_SIDEBAR_GROUP,
  SET_MAP_DIMENSIONS_DATA
} from 'actions/tool.actions';
import { SET_CONTEXT } from 'scripts/actions/app.actions';
import keyBy from 'lodash/keyBy';
import immer from 'immer';
import createReducer from 'utils/createReducer';
import getChoropleth from 'scripts/reducers/helpers/getChoropleth';
import { getMapDimensionsWarnings } from 'scripts/reducers/helpers/getMapDimensionsWarnings';
import getNodesDict from 'scripts/reducers/helpers/getNodesDict';
import setNodesMeta from 'scripts/reducers/helpers/setNodesMeta';
import getNodeMetaUid from 'reducers/helpers/getNodeMetaUid';

export const toolLayersInitialState = {
  nodesDict: null,
  choropleth: {},
  choroplethLegend: null,
  expandedMapSidebarGroupsIds: [],
  geoIdsDict: {},
  highlightedNodeCoordinates: null,
  isMapVisible: false,
  linkedGeoIds: [],
  mapContextualLayers: [],
  mapDimensions: {},
  mapDimensionsGroups: [],
  mapLoading: true,
  mapVectorData: null,
  mapView: null,
  nodesDictWithMeta: {},
  selectedMapBasemap: null,
  selectedMapContextualLayers: null,
  selectedMapDimensions: [null, null],
  selectedMapDimensionsWarnings: null,
  selectedMapContextualLayersData: []
};

const toolLayersReducer = {
  [SET_CONTEXT](state) {
    return immer(state, draft => {
      draft.mapView = null;
      draft.selectedMapBasemap = null;
      draft.selectedMapContextualLayers = null;
    });
  },

  [SET_MAP_LOADING_STATE](state) {
    return immer(state, draft => {
      draft.mapLoading = true;
    });
  },

  [SET_NODE_ATTRIBUTES](state, action) {
    return immer(state, draft => {
      const nodesMeta = action.payload;

      // store dimension values in nodesDict as uid: dimensionValue
      const nodesDictWithMeta = setNodesMeta(draft.nodesDict, nodesMeta, draft.mapDimensions);

      const { choropleth, choroplethLegend } = getChoropleth(
        draft.selectedMapDimensions,
        nodesDictWithMeta,
        state.mapDimensions
      );

      return Object.assign(draft, {
        nodesDictWithMeta,
        choropleth,
        choroplethLegend,
        mapLoading: false
      });
    });
  },
  [SET_MAP_DIMENSIONS_DATA](state, action) {
    return immer(state, draft => {
      const { dimensions, dimensionGroups } = action.payload.mapDimensionsMetaJSON;
      dimensions.forEach(dimension => {
        const uid = getNodeMetaUid(dimension.type, dimension.layerAttributeId);
        draft.mapDimensions[uid] = dimension;
        draft.mapDimensions[uid].uid = uid;
      });
      dimensionGroups.forEach((g, i) => {
        const group = {
          ...g,
          dimensions: dimensions
            .filter(dimension => dimension.groupId === g.id)
            .map(dimension => getNodeMetaUid(dimension.type, dimension.layerAttributeId))
        };
        draft.mapDimensionsGroups[i] = group;
      });
    });
  },
  [GET_LINKED_GEOIDS](state, action) {
    return immer(state, draft => {
      draft.linkedGeoIds =
        action.payload?.nodes?.length > 0 ? action.payload.nodes.map(node => node.geoId) : [];
    });
  },

  [HIGHLIGHT_NODE](state, action) {
    return immer(state, draft => {
      draft.highlightedNodeCoordinates = action.coordinates;
    });
  },
  [GET_MAP_VECTOR_DATA](state, action) {
    return immer(state, draft => {
      draft.mapVectorData = action.mapVectorData;
    });
  },
  [GET_CONTEXT_LAYERS](state, action) {
    return immer(state, draft => {
      draft.mapContextualLayers = action.mapContextualLayers;
    });
  },
  [SET_MAP_DIMENSIONS_SELECTION](state, action) {
    return immer(state, draft => {
      const { uids: selectedMapDimensions, selectedYears } = action.payload;
      const { choropleth, choroplethLegend } = getChoropleth(
        selectedMapDimensions,
        draft.nodesDictWithMeta,
        draft.mapDimensions
      );
      const selectedMapDimensionsWarnings = getMapDimensionsWarnings(
        draft.mapDimensions,
        selectedMapDimensions,
        selectedYears
      );

      Object.assign(draft, {
        selectedMapDimensions,
        selectedMapDimensionsWarnings,
        choropleth,
        choroplethLegend
      });
    });
  },
  [TOGGLE_MAP_DIMENSION](state, action) {
    return immer(state, draft => {
      const uidIndex = draft.selectedMapDimensions.indexOf(action.payload.uid);

      if (uidIndex === -1) {
        // dimension was not found: put it on a free slot
        if (draft.selectedMapDimensions[0] === null) {
          draft.selectedMapDimensions[0] = action.payload.uid;
        } else if (draft.selectedMapDimensions[1] === null) {
          draft.selectedMapDimensions[1] = action.payload.uid;
        } else {
          return state;
        }
      } else {
        // dimension was found: remove it from selection
        draft.selectedMapDimensions[uidIndex] = null;
      }

      const { choropleth, choroplethLegend } = getChoropleth(
        draft.selectedMapDimensions,
        draft.nodesDictWithMeta,
        draft.mapDimensions
      );

      const selectedMapDimensionsWarnings = getMapDimensionsWarnings(
        draft.mapDimensions,
        draft.selectedMapDimensions,
        action.payload.selectedYears
      );
      return Object.assign(draft, {
        selectedMapDimensionsWarnings,
        mapLoading: true,
        choropleth,
        choroplethLegend
      });
    });
  },
  [SELECT_CONTEXTUAL_LAYERS](state, action) {
    return immer(state, draft => {
      const mapContextualLayersDict = keyBy(draft.mapContextualLayers, 'id');
      const selectedMapContextualLayersData = action.contextualLayers.map(
        layerSlug => mapContextualLayersDict[layerSlug]
      );

      return Object.assign(draft, {
        selectedMapContextualLayers: action.contextualLayers,
        selectedMapContextualLayersData
      });
    });
  },
  [SELECT_BASEMAP](state, action) {
    return immer(state, draft => {
      draft.selectedMapBasemap = action.selectedMapBasemap;
    });
  },
  [TOGGLE_MAP](state, action) {
    return immer(state, draft => {
      draft.isMapVisible = action.forceState !== null ? action.forceState : !state.isMapVisible;
    });
  },
  [SAVE_MAP_VIEW](state, action) {
    return immer(state, draft => {
      draft.mapView = {
        latitude: action.latlng.lat,
        longitude: action.latlng.lng,
        zoom: action.zoom
      };
    });
  },
  [TOGGLE_MAP_SIDEBAR_GROUP](state, action) {
    return immer(state, draft => {
      const idIndex = draft.expandedMapSidebarGroupsIds.indexOf(action.id);
      if (idIndex === -1) {
        draft.expandedMapSidebarGroupsIds.push(action.id);
      } else {
        draft.expandedMapSidebarGroupsIds.splice(idIndex, 1);
      }
    });
  },
  [GET_COLUMNS](state, action) {
    return immer(state, draft => {
      const rawNodes = action.payload[0].data;
      const columns = action.payload[1].data;

      const { nodesDict, geoIdsDict } = getNodesDict(rawNodes, columns);

      return Object.assign(draft, {
        nodesDict,
        geoIdsDict
      });
    });
  }
};

const toolLayersReducerTypes = PropTypes => ({
  choropleth: PropTypes.object.isRequired,
  choroplethLegend: PropTypes.object,
  expandedMapSidebarGroupsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  geoIdsDict: PropTypes.object.isRequired,
  highlightedNodeCoordinates: PropTypes.object,
  isMapVisible: PropTypes.bool,
  linkedGeoIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  mapContextualLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  mapDimensions: PropTypes.object.isRequired,
  mapDimensionsGroups: PropTypes.object.isRequired,
  mapLoading: PropTypes.bool,
  mapVectorData: PropTypes.array,
  mapView: PropTypes.object,
  nodesDictWithMeta: PropTypes.object.isRequired,
  selectedMapBasemap: PropTypes.string,
  selectedMapContextualLayers: PropTypes.array,
  selectedMapDimensions: PropTypes.array.isRequired,
  selectedMapDimensionsWarnings: PropTypes.string,
  selectedMapContextualLayersData: PropTypes.array.isRequired
});

export default createReducer(toolLayersInitialState, toolLayersReducer, toolLayersReducerTypes);
