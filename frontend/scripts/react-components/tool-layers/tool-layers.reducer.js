import {
  GET_CONTEXT_LAYERS,
  GET_MAP_VECTOR_DATA,
  SET_NODE_ATTRIBUTES,
  SET_MAP_LOADING_STATE,
  SAVE_MAP_VIEW,
  SELECT_BASEMAP,
  SELECT_CONTEXTUAL_LAYERS,
  TOGGLE_MAP,
  TOGGLE_MAP_DIMENSION
} from 'react-components/tool/tool.actions';
import {
  TOOL_LAYERS__SET_LINKED_GEOIDS,
  TOOL_LAYERS__SET_MAP_DIMENSIONS
} from 'react-components/tool-layers/tool-layers.actions';
import { TOOL_LINKS__HIGHLIGHT_NODE } from 'react-components/tool-links/tool-links.actions';
import { SET_CONTEXT } from 'scripts/actions/app.actions';
import immer from 'immer';
import createReducer from 'utils/createReducer';
import getNodeMetaUid from 'reducers/helpers/getNodeMetaUid';
import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import * as ToolLayersUrlPropHandlers from 'react-components/tool-layers/tool-layers.serializers';
import toolLayersInitialState from './tool-layers.initial-state';

const toolLayersReducer = {
  tool(state, action) {
    if (action.payload?.serializerParams) {
      const newState = deserialize({
        params: action.payload.serializerParams,
        state: { ...state, mapView: null },
        urlPropHandlers: ToolLayersUrlPropHandlers,
        props: [
          'mapView',
          'isMapVisible',
          'selectedMapBasemap',
          'selectedMapContextualLayers',
          'selectedMapDimensions'
        ]
      });
      return newState;
    }
    return state;
  },
  [SET_CONTEXT]() {
    return toolLayersInitialState;
  },

  [SET_MAP_LOADING_STATE](state) {
    return immer(state, draft => {
      draft.mapLoading = true;
    });
  },

  [SET_NODE_ATTRIBUTES](state) {
    return immer(state, draft => {
      draft.mapLoading = false;
    });
  },
  [TOOL_LAYERS__SET_MAP_DIMENSIONS](state, action) {
    return immer(state, draft => {
      const { dimensions, dimensionGroups } = action.payload;
      draft.data.mapDimensions = {};
      dimensions.forEach(dimension => {
        const uid = getNodeMetaUid(dimension.type, dimension.layerAttributeId);
        draft.data.mapDimensions[uid] = dimension;
        draft.data.mapDimensions[uid].uid = uid;
      });
      draft.data.mapDimensionsGroups = [];
      dimensionGroups.forEach((g, i) => {
        draft.data.mapDimensionsGroups[i] = {
          ...g,
          dimensions: dimensions
            .filter(dimension => dimension.groupId === g.id)
            .map(dimension => getNodeMetaUid(dimension.type, dimension.layerAttributeId))
        };
      });
    });
  },
  [TOOL_LAYERS__SET_LINKED_GEOIDS](state, action) {
    return immer(state, draft => {
      draft.linkedGeoIds =
        action.payload?.nodes?.length > 0 ? action.payload.nodes.map(node => node.geoId) : [];
    });
  },

  [TOOL_LINKS__HIGHLIGHT_NODE](state, action) {
    return immer(state, draft => {
      draft.highlightedNodeCoordinates = action.payload.coordinates;
    });
  },
  [GET_MAP_VECTOR_DATA](state, action) {
    return immer(state, draft => {
      draft.data.mapVectorData = action.mapVectorData;
    });
  },
  [GET_CONTEXT_LAYERS](state, action) {
    return immer(state, draft => {
      draft.data.mapContextualLayers = {};
      action.mapContextualLayers.forEach(layer => {
        draft.data.mapContextualLayers[layer.id] = layer;
      });
    });
  },
  [TOGGLE_MAP_DIMENSION](state, action) {
    return immer(state, draft => {
      if (!draft.selectedMapDimensions) {
        draft.selectedMapDimensions = [...action.payload.selectedMapDimensions];
      }
      const uidIndex = draft.selectedMapDimensions.indexOf(action.payload.uid);

      if (uidIndex === -1) {
        // dimension was not found: put it on a free slot
        if (!draft.selectedMapDimensions[0]) {
          draft.selectedMapDimensions[0] = action.payload.uid;
        } else if (!draft.selectedMapDimensions[1]) {
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
  }
};

const toolLayersReducerTypes = PropTypes => ({
  highlightedNodeCoordinates: PropTypes.object,
  isMapVisible: PropTypes.bool,
  linkedGeoIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  mapContextualLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  mapDimensions: PropTypes.object.isRequired,
  mapDimensionsGroups: PropTypes.object.isRequired,
  mapLoading: PropTypes.bool,
  mapVectorData: PropTypes.array,
  mapView: PropTypes.object,
  selectedMapBasemap: PropTypes.string,
  selectedMapContextualLayers: PropTypes.array,
  selectedMapDimensions: PropTypes.array.isRequired
});

export default createReducer(toolLayersInitialState, toolLayersReducer, toolLayersReducerTypes);
