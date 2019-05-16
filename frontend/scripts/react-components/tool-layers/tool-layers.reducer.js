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
  SET_MAP_DIMENSIONS_DATA
} from 'actions/tool.actions';
import { SET_CONTEXT } from 'scripts/actions/app.actions';
import immer from 'immer';
import createReducer from 'utils/createReducer';
import getNodesDict from 'scripts/reducers/helpers/getNodesDict';
import setNodesMeta from 'scripts/reducers/helpers/setNodesMeta';
import getNodeMetaUid from 'reducers/helpers/getNodeMetaUid';

export const toolLayersInitialState = {
  nodesDict: null,
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
  selectedMapDimensionsWarnings: null
};

const toolLayersReducer = {
  [SET_CONTEXT]() {
    return toolLayersInitialState;
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

      return Object.assign(draft, {
        nodesDictWithMeta,
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
        draft.mapDimensionsGroups[i] = {
          ...g,
          dimensions: dimensions
            .filter(dimension => dimension.groupId === g.id)
            .map(dimension => getNodeMetaUid(dimension.type, dimension.layerAttributeId))
        };
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
      draft.mapContextualLayers = {};
      action.mapContextualLayers.forEach(layer => {
        draft.mapContextualLayers[layer.id] = layer;
      });
    });
  },
  [SET_MAP_DIMENSIONS_SELECTION](state, action) {
    return immer(state, draft => {
      const { uids } = action.payload;
      draft.selectedMapDimensions = uids;
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
        }
        draft.mapLoading = true;
      } else {
        // dimension was found: remove it from selection
        draft.selectedMapDimensions[uidIndex] = null;
      }
    });
  },
  [SELECT_CONTEXTUAL_LAYERS](state, action) {
    return immer(state, draft => {
      draft.selectedMapContextualLayers = action.contextualLayers;
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
  selectedMapDimensionsWarnings: PropTypes.string
});

export default createReducer(toolLayersInitialState, toolLayersReducer, toolLayersReducerTypes);
