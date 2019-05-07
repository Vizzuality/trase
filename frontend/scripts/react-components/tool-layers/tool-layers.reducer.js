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
import { LOAD_INITIAL_CONTEXT, SET_CONTEXT } from 'scripts/actions/app.actions';
import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import createReducer from 'utils/createReducer';
import getChoropleth from 'scripts/reducers/helpers/getChoropleth';
import getMapDimensions from 'scripts/reducers/helpers/getMapDimensions';
import { getMapDimensionsWarnings } from 'scripts/reducers/helpers/getMapDimensionsWarnings';
import getNodesDict from 'scripts/reducers/helpers/getNodesDict';
import setNodesMeta from 'scripts/reducers/helpers/setNodesMeta';

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
  mapDimensions: [],
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
  [LOAD_INITIAL_CONTEXT](state, action) {
    const selectedContext = action.payload;

    // use current selectedMapContextualLayers, or use the context's default
    let selectedMapContextualLayers = selectedContext.defaultContextLayers || undefined;
    if (
      state.selectedMapContextualLayers !== undefined &&
      state.selectedMapContextualLayers !== null
    ) {
      selectedMapContextualLayers = state.selectedMapContextualLayers;
    }

    let selectedMapBasemap = selectedContext.defaultBasemap || 'satellite';
    if (state.selectedMapBasemap !== undefined && state.selectedMapBasemap !== null) {
      selectedMapBasemap = state.selectedMapBasemap;
    }

    // force state updates on the component
    const mapView = state.mapView ? Object.assign({}, state.mapView) : selectedContext.map;

    return Object.assign({}, state, {
      selectedMapContextualLayers,
      selectedMapBasemap,
      mapView
    });
  },
  [SET_CONTEXT](state, action) {
    const selectedContext = action.payload;
    if (!selectedContext) {
      return Object.assign({}, state);
    }

    return Object.assign({}, state, {
      selectedMapContextualLayers: selectedContext.defaultContextLayers || undefined,
      selectedMapBasemap: selectedContext.defaultBasemap || 'satellite',
      mapView: selectedContext.map
    });
  },

  [SET_MAP_LOADING_STATE](state) {
    return Object.assign({}, state, { mapLoading: true });
  },

  [SET_NODE_ATTRIBUTES](state, action) {
    const nodesMeta = action.payload;

    // store dimension values in nodesDict as uid: dimensionValue
    const nodesDictWithMeta = setNodesMeta(state.nodesDict, nodesMeta, state.mapDimensions);

    const { choropleth, choroplethLegend } = getChoropleth(
      state.selectedMapDimensions,
      nodesDictWithMeta,
      state.mapDimensions
    );

    return Object.assign({}, state, {
      nodesDictWithMeta,
      choropleth,
      choroplethLegend,
      mapLoading: false
    });
  },
  [SET_MAP_DIMENSIONS_DATA](state, action) {
    const mapDimensionsMeta = action.payload.mapDimensionsMetaJSON;
    const rawMapDimensions = mapDimensionsMeta.dimensions;
    const mapDimensions = getMapDimensions(rawMapDimensions);

    const mapDimensionsGroups = mapDimensionsMeta.dimensionGroups.map(group => ({
      group,
      dimensions: mapDimensions.filter(dimension => dimension.groupId === group.id)
    }));

    return Object.assign({}, state, {
      mapDimensions,
      mapDimensionsGroups
    });
  },
  [GET_LINKED_GEOIDS](state, action) {
    const linkedGeoIds =
      action.payload && action.payload.nodes && action.payload.nodes.length
        ? action.payload.nodes.map(node => node.geoId)
        : [];
    if (isEqual(linkedGeoIds, state.linkedGeoIds)) {
      return state;
    }
    return Object.assign({}, state, { linkedGeoIds });
  },

  [HIGHLIGHT_NODE](state, action) {
    return Object.assign({}, state, {
      highlightedNodeCoordinates: action.coordinates
    });
  },
  [GET_MAP_VECTOR_DATA](state, action) {
    return Object.assign({}, state, { mapVectorData: action.mapVectorData });
  },
  [GET_CONTEXT_LAYERS](state, action) {
    return Object.assign({}, state, { mapContextualLayers: action.mapContextualLayers });
  },
  [SET_MAP_DIMENSIONS_SELECTION](state, action) {
    const { uids: selectedMapDimensions, selectedYears } = action.payload;
    const { choropleth, choroplethLegend } = getChoropleth(
      selectedMapDimensions,
      state.nodesDictWithMeta,
      state.mapDimensions
    );
    const selectedMapDimensionsWarnings = getMapDimensionsWarnings(
      state.mapDimensions,
      selectedMapDimensions,
      selectedYears
    );

    return {
      ...state,
      selectedMapDimensions,
      selectedMapDimensionsWarnings,
      choropleth,
      choroplethLegend
    };
  },
  [TOGGLE_MAP_DIMENSION](state, action) {
    const selectedMapDimensions = state.selectedMapDimensions.slice();
    const uidIndex = selectedMapDimensions.indexOf(action.payload.uid);

    if (uidIndex === -1) {
      // dimension was not found: put it on a free slot
      if (selectedMapDimensions[0] === null) {
        selectedMapDimensions[0] = action.payload.uid;
      } else if (selectedMapDimensions[1] === null) {
        selectedMapDimensions[1] = action.payload.uid;
      } else {
        return state;
      }
    } else {
      // dimension was found: remove it from selection
      selectedMapDimensions[uidIndex] = null;
    }

    const { choropleth, choroplethLegend } = getChoropleth(
      selectedMapDimensions,
      state.nodesDictWithMeta,
      state.mapDimensions
    );

    const selectedMapDimensionsWarnings = getMapDimensionsWarnings(
      state.mapDimensions,
      selectedMapDimensions,
      action.payload.selectedYears
    );
    return {
      ...state,
      selectedMapDimensions,
      selectedMapDimensionsWarnings,
      mapLoading: true,
      choropleth,
      choroplethLegend
    };
  },
  [SELECT_CONTEXTUAL_LAYERS](state, action) {
    const mapContextualLayersDict = keyBy(state.mapContextualLayers, 'id');
    const selectedMapContextualLayersData = action.contextualLayers.map(layerSlug =>
      Object.assign({}, mapContextualLayersDict[layerSlug])
    );

    return Object.assign({}, state, {
      selectedMapContextualLayers: action.contextualLayers,
      selectedMapContextualLayersData
    });
  },
  [SELECT_BASEMAP](state, action) {
    return Object.assign({}, state, { selectedMapBasemap: action.selectedMapBasemap });
  },
  [TOGGLE_MAP](state, action) {
    return Object.assign({}, state, {
      isMapVisible: action.forceState !== null ? action.forceState : !state.isMapVisible
    });
  },
  [SAVE_MAP_VIEW](state, action) {
    return Object.assign({}, state, {
      mapView: {
        latitude: action.latlng.lat,
        longitude: action.latlng.lng,
        zoom: action.zoom
      }
    });
  },
  [TOGGLE_MAP_SIDEBAR_GROUP](state, action) {
    const expandedMapSidebarGroupsIds = state.expandedMapSidebarGroupsIds.slice();
    const idIndex = expandedMapSidebarGroupsIds.indexOf(action.id);
    if (idIndex === -1) {
      expandedMapSidebarGroupsIds.push(action.id);
    } else {
      expandedMapSidebarGroupsIds.splice(idIndex, 1);
    }
    return Object.assign({}, state, { expandedMapSidebarGroupsIds });
  },
  [GET_COLUMNS](state, action) {
    const rawNodes = action.payload[0].data;
    const columns = action.payload[1].data;

    const { nodesDict, geoIdsDict } = getNodesDict(rawNodes, columns);

    return Object.assign({}, state, {
      nodesDict,
      geoIdsDict
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
  mapDimensions: PropTypes.arrayOf(PropTypes.object).isRequired,
  mapDimensionsGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
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
