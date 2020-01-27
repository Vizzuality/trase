import {
  GET_CONTEXT_LAYERS,
  GET_MAP_VECTOR_DATA,
  SET_NODE_ATTRIBUTES,
  SELECT_BASEMAP,
  SELECT_CONTEXTUAL_LAYERS,
  CHANGE_LAYOUT,
  SET_SANKEY_SIZE,
  SET_ACTIVE_MODAL,
  SELECT_UNIT_LAYERS,
  TOGGLE_MAP_DIMENSION
} from 'react-components/tool/tool.actions';
import {
  TOOL_LAYERS__SAVE_MAP_VIEW,
  TOOL_LAYERS__SET_LINKED_GEOIDS,
  TOOL_LAYERS__SET_MAP_DIMENSIONS
} from 'react-components/tool-layers/tool-layers.actions';
import { TOOL_LINKS__HIGHLIGHT_NODE } from 'react-components/tool-links/tool-links.actions';
import { SET_CONTEXT } from 'app/app.actions';
import { NODES_PANEL__SAVE } from 'react-components/nodes-panel/nodes-panel.actions';
import immer from 'immer';
import createReducer from 'utils/createReducer';
import getNodeMetaUid from 'app/helpers/getNodeMetaUid';
import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import toolLayersSerialization from 'react-components/tool-layers/tool-layers.serializers';
import toolLayersInitialState from 'react-components/tool-layers//tool-layers.initial-state';
import { TOOL_LAYOUT, SANKEY_OFFSETS } from 'constants';

const onContextChange = state =>
  immer(state, draft => {
    Object.assign(draft, toolLayersInitialState, {
      toolLayout: state.toolLayout,
      sankeySize: state.sankeySize
    });
  });

const toolLayersReducer = {
  tool(state, action) {
    if (action.payload?.serializerParams) {
      const newState = deserialize({
        params: action.payload.serializerParams,
        state: { ...state, mapView: null },
        ...toolLayersSerialization
      });
      return newState;
    }
    return state;
  },
  [NODES_PANEL__SAVE](state, action) {
    if (action.payload) {
      return onContextChange(state);
    }
    return state;
  },
  [SET_CONTEXT]: onContextChange,
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
      draft.data.mapVectorData = action.payload.mapVectorData;
    });
  },
  [GET_CONTEXT_LAYERS](state, action) {
    return immer(state, draft => {
      const { mapContextualLayers } = action.payload;
      draft.data.mapContextualLayers = {};
      mapContextualLayers.forEach(layer => {
        draft.data.mapContextualLayers[layer.id] = layer;
      });
    });
  },
  [SELECT_UNIT_LAYERS](state, action) {
    const { uids } = action.payload;
    return immer(state, draft => {
      draft.selectedMapDimensions = uids;
    });
  },
  [SELECT_CONTEXTUAL_LAYERS](state, action) {
    return immer(state, draft => {
      draft.selectedMapContextualLayers = action.payload.contextualLayers;
    });
  },
  [SELECT_BASEMAP](state, action) {
    return immer(state, draft => {
      draft.selectedBasemap = action.payload.selectedBasemap;
    });
  },
  [CHANGE_LAYOUT](state, action) {
    return immer(state, draft => {
      draft.toolLayout = action.payload.toolLayout;
    });
  },
  [TOOL_LAYERS__SAVE_MAP_VIEW](state, action) {
    return immer(state, draft => {
      draft.mapView = {
        latitude: action.latlng.lat.toFixed(2),
        longitude: action.latlng.lng.toFixed(2),
        zoom: action.zoom
      };
    });
  },
  [SET_SANKEY_SIZE](state) {
    const { toolLayout } = state;
    let widthOffset = SANKEY_OFFSETS.width;
    if (toolLayout === TOOL_LAYOUT.splitted) {
      widthOffset = SANKEY_OFFSETS.splittedWidth;
    }
    return immer(state, draft => {
      draft.sankeySize = [
        window.innerWidth - widthOffset,
        window.innerHeight - SANKEY_OFFSETS.height
      ];
    });
  },
  [SET_ACTIVE_MODAL](state, action) {
    return immer(state, draft => {
      draft.activeModal = action.payload.activeModal;
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
  }
};

const toolLayersReducerTypes = PropTypes => ({
  data: PropTypes.shape({
    mapDimensions: PropTypes.object.isRequired,
    mapVectorData: PropTypes.array,
    mapDimensionsGroups: PropTypes.array.isRequired,
    mapContextualLayers: PropTypes.object.isRequired
  }).isRequired,
  highlightedNodeCoordinates: PropTypes.object,
  toolLayout: PropTypes.number,
  linkedGeoIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  mapLoading: PropTypes.bool,
  mapView: PropTypes.object,
  selectedBasemap: PropTypes.string,
  selectedMapContextualLayers: PropTypes.array,
  selectedMapDimensions: PropTypes.array,
  sankeySize: PropTypes.arrayOf(PropTypes.number).isRequired
});

export default createReducer(toolLayersInitialState, toolLayersReducer, toolLayersReducerTypes);
