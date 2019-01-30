import {
  FILTER_LINKS_BY_NODES,
  GET_COLUMNS,
  GET_CONTEXT_LAYERS,
  GET_LINKED_GEOIDS,
  GET_LINKS,
  GET_MAP_VECTOR_DATA,
  SET_NODE_ATTRIBUTES,
  HIGHLIGHT_NODE,
  SET_FLOWS_LOADING_STATE,
  SET_MAP_LOADING_STATE,
  RESET_SELECTION,
  RESET_TOOL_STATE,
  SAVE_MAP_VIEW,
  SELECT_BASEMAP,
  SELECT_BIOME_FILTER,
  SELECT_COLUMN,
  SELECT_CONTEXTUAL_LAYERS,
  SELECT_RECOLOR_BY,
  SELECT_RESIZE_BY,
  SELECT_VIEW,
  SET_MAP_DIMENSIONS_SELECTION,
  SET_SANKEY_SEARCH_VISIBILITY,
  SHOW_LINKS_ERROR,
  TOGGLE_MAP,
  TOGGLE_MAP_DIMENSION,
  TOGGLE_MAP_SIDEBAR_GROUP,
  UPDATE_NODE_SELECTION,
  EXPAND_NODE_SELECTION,
  COLLAPSE_NODE_SELECTION,
  SET_MAP_DIMENSIONS_DATA,
  RESET_TOOL_LOADERS
} from 'actions/tool.actions';
import {
  LOAD_INITIAL_CONTEXT,
  SET_CONTEXT,
  LOAD_STATE_FROM_URL
} from 'scripts/actions/app.actions';
import groupBy from 'lodash/groupBy';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import keyBy from 'lodash/keyBy';
import createReducer from 'utils/createReducer';
import { getSelectedNodesColumnsPos } from 'react-components/tool/tool.selectors';
import filterLinks from 'scripts/reducers/helpers/filterLinks';
import getChoropleth from 'scripts/reducers/helpers/getChoropleth';
import getMapDimensions from 'scripts/reducers/helpers/getMapDimensions';
import { getMapDimensionsWarnings } from 'scripts/reducers/helpers/getMapDimensionsWarnings';
import getNodesAtColumns from 'scripts/reducers/helpers/getNodesAtColumns';
import getNodesColoredBySelection from 'scripts/reducers/helpers/getNodesColoredBySelection';
import getNodesDict from 'scripts/reducers/helpers/getNodesDict';
import getRecolorGroups from 'scripts/reducers/helpers/getRecolorGroups';
import getVisibleNodes from 'scripts/reducers/helpers/getVisibleNodes';
import mergeLinks from 'scripts/reducers/helpers/mergeLinks';
import setNodesMeta from 'scripts/reducers/helpers/setNodesMeta';
import sortVisibleNodes from 'scripts/reducers/helpers/sortVisibleNodes';
import splitLinksByColumn from 'scripts/reducers/helpers/splitLinksByColumn';
import splitVisibleNodesByColumn from 'scripts/reducers/helpers/splitVisibleNodesByColumn';

export const toolInitialState = {
  choropleth: {},
  choroplethLegend: null,
  columns: [],
  currentQuant: null,
  detailedView: false,
  expandedMapSidebarGroupsIds: [],
  expandedNodesIds: [],
  forcedOverview: false,
  geoIdsDict: {},
  highlightedNodeCoordinates: null,
  highlightedNodesIds: [],
  initialDataLoading: false,
  isMapVisible: false,
  isSearchOpen: false,
  linkedGeoIds: [],
  links: [],
  flowsLoading: true,
  mapContextualLayers: [],
  mapDimensions: [],
  mapDimensionsGroups: [],
  mapLoading: true,
  mapVectorData: null,
  mapView: null,
  nodes: [],
  nodesColoredAtColumn: null,
  nodesColoredBySelection: [],
  nodesDict: null,
  nodesDictWithMeta: {},
  recolorByNodeIds: [],
  recolorGroups: [],
  selectedBiomeFilter: { name: 'none', value: 'none' },
  selectedColumnsIds: [],
  selectedMapBasemap: null,
  selectedMapContextualLayers: null,
  selectedMapDimensions: [null, null],
  selectedMapDimensionsWarnings: null,
  selectedNodesIds: [],
  selectedRecolorBy: { type: 'none', name: 'none' },
  selectedResizeBy: { type: 'none', name: 'none' },
  unmergedLinks: [],
  visibleNodes: [],
  visibleNodesByColumn: [],
  loadedFlowsContextId: null
};

const toolReducer = {
  [LOAD_STATE_FROM_URL](state, action) {
    return { ...state, initialDataLoading: true, ...action.payload.tool };
  },
  [RESET_SELECTION](state) {
    return Object.assign({}, state, {
      highlightedNodesIds: [],
      selectedNodesIds: [],
      expandedNodesIds: [],
      selectedBiomeFilter: { value: 'none' },
      recolorByNodeIds: []
    });
  },
  [LOAD_INITIAL_CONTEXT](state, action) {
    const selectedContext = action.payload;

    let selectedRecolorBy = selectedContext.recolorBy.find(
      recolorBy => recolorBy.name === state.selectedRecolorByName
    );
    if (!selectedRecolorBy) {
      selectedRecolorBy = selectedContext.recolorBy.find(recolorBy => recolorBy.isDefault === true);
    }

    let selectedResizeBy = selectedContext.resizeBy.find(
      resizeBy => resizeBy.name === state.selectedResizeByName
    );
    if (!selectedResizeBy) {
      selectedResizeBy = selectedContext.resizeBy.find(resizeBy => resizeBy.isDefault === true);
    }

    let biomeFilter;
    if (state.selectedBiomeFilterName === 'none' || !selectedContext.filterBy.length > 0) {
      biomeFilter = { value: 'none' };
    } else {
      biomeFilter = selectedContext.filterBy[0].nodes.find(
        filterBy => filterBy.name === state.selectedBiomeFilterName
      );
    }

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
      selectedRecolorBy: selectedRecolorBy || { type: 'none', name: 'none' },
      selectedResizeBy,
      selectedBiomeFilter: biomeFilter || { value: 'none', name: 'none' },
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

    const defaultRecolorBy = selectedContext.recolorBy.find(
      recolorBy => recolorBy.isDefault === true
    );
    const defaultResizeBy = selectedContext.resizeBy.find(resizeBy => resizeBy.isDefault === true);
    const defaultBiomeFilterBy =
      selectedContext.filterBy.length > 0 && selectedContext.filterBy[0][0];

    return Object.assign({}, state, {
      selectedRecolorBy: defaultRecolorBy || { type: 'none', name: 'none' },
      selectedResizeBy: defaultResizeBy,
      selectedBiomeFilter: defaultBiomeFilterBy || { name: 'none', value: 'none' },
      selectedMapContextualLayers: selectedContext.defaultContextLayers || undefined,
      selectedMapBasemap: selectedContext.defaultBasemap || 'satellite',
      detailedView: false,
      recolorGroups: [],
      mapView: selectedContext.map,
      selectedNodesIds: [],
      expandedNodesIds: []
    });
  },
  [GET_COLUMNS](state, action) {
    const rawNodes = action.payload[0].data;
    const columns = action.payload[1].data;

    // context-dependant columns
    const columnsByGroupObj = groupBy(columns, 'group');
    const columnsByGroup = [0, 0, 0, 0]
      .map((e, i) => columnsByGroupObj[i])
      .filter(n => typeof n !== 'undefined');

    const selectedColumnsIds = [];
    columnsByGroup.forEach((group, i) => {
      const defaultColumn = group.find(g => g.isDefault === true).id;
      if (state.selectedColumnsIds === undefined || state.selectedColumnsIds.length < 4) {
        selectedColumnsIds.push(defaultColumn);
      } else {
        const currentColumnForGroup = state.selectedColumnsIds[i];
        const columnId =
          group.find(g => g.id === currentColumnForGroup) !== undefined
            ? currentColumnForGroup
            : defaultColumn;
        selectedColumnsIds.push(columnId);
      }
    });

    const { nodesDict, geoIdsDict } = getNodesDict(rawNodes, columns);

    // if any selectedNode, make those columns visible (selected)
    if (!isEmpty(state.selectedNodesIds)) {
      state.selectedNodesIds
        .map(id => nodesDict[id])
        .forEach(node => {
          selectedColumnsIds[node.columnGroup] = node.columnId;
        });
    }

    // TODO the API should have the info on which file to load (if any) per column
    const municipalitiesColumn = columns.find(column => column.name === 'MUNICIPALITY');
    const logisticsHubColumn = columns.find(column => column.name === 'LOGISTICS HUB');
    if (logisticsHubColumn && municipalitiesColumn) {
      logisticsHubColumn.useGeometryFromColumnId = municipalitiesColumn.id;
    }

    return Object.assign({}, state, {
      columns,
      nodes: rawNodes,
      nodesDict,
      geoIdsDict,
      initialDataLoading: false,
      selectedColumnsIds
    });
  },

  [SET_FLOWS_LOADING_STATE](state, action) {
    // TODO: remove this see tool.thunks.js
    const { loadedFlowsContextId } = action.payload;
    return { ...state, flowsLoading: true, loadedFlowsContextId };
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
  [GET_LINKS](state, action) {
    const rawLinks = action.jsonPayload.data;
    const linksMeta = action.jsonPayload.include;

    const currentQuant = linksMeta.quant;

    const visibleNodes = getVisibleNodes(
      rawLinks,
      state.nodesDict,
      linksMeta,
      state.selectedColumnsIds
    );

    let visibleNodesByColumn = splitVisibleNodesByColumn(visibleNodes);
    visibleNodesByColumn = sortVisibleNodes(visibleNodesByColumn);

    const unmergedLinks = splitLinksByColumn(rawLinks, state.nodesDict, state.selectedRecolorBy);
    const links = mergeLinks(unmergedLinks);

    return Object.assign({}, state, {
      links,
      unmergedLinks,
      visibleNodes,
      visibleNodesByColumn,
      currentQuant,
      flowsLoading: false
    });
  },
  [SHOW_LINKS_ERROR](state) {
    return Object.assign({}, state, { links: null, flowsLoading: false });
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
  [SELECT_BIOME_FILTER](state, action) {
    return Object.assign({}, state, { selectedBiomeFilter: action.payload });
  },
  [SELECT_RECOLOR_BY](state, action) {
    return Object.assign({}, state, { selectedRecolorBy: action.payload });
  },
  [SELECT_RESIZE_BY](state, action) {
    return Object.assign({}, state, { selectedResizeBy: action.payload });
  },
  [SELECT_VIEW](state, action) {
    return Object.assign({}, state, {
      detailedView: action.detailedView,
      forcedOverview: action.forcedOverview
    });
  },

  [SELECT_COLUMN](state, action) {
    // TODO also update choropleth with default selected indicators
    const selectedColumnsIds = [].concat(state.selectedColumnsIds);
    if (selectedColumnsIds.indexOf(action.columnId) === -1) {
      selectedColumnsIds[action.columnIndex] = action.columnId;
    }
    return Object.assign({}, state, { selectedColumnsIds });
  },
  [UPDATE_NODE_SELECTION](state, action) {
    return Object.assign({}, state, {
      selectedNodesIds: action.ids
    });
  },
  [HIGHLIGHT_NODE](state, action) {
    return Object.assign({}, state, {
      highlightedNodesIds: action.ids,
      highlightedNodeCoordinates: action.coordinates
    });
  },
  [FILTER_LINKS_BY_NODES](state) {
    const selectedNodesColumnsPos = getSelectedNodesColumnsPos(state);
    const selectedNodesAtColumns = getNodesAtColumns(
      state.selectedNodesIds,
      selectedNodesColumnsPos
    );

    const { nodesColoredBySelection, nodesColoredAtColumn } = getNodesColoredBySelection(
      selectedNodesAtColumns
    );
    const recolorGroups = getRecolorGroups(
      state.nodesColoredBySelection,
      nodesColoredBySelection,
      state.recolorGroups
    );

    let links;
    if (state.selectedNodesIds.length > 0) {
      const filteredLinks = filterLinks(
        state.unmergedLinks,
        selectedNodesAtColumns,
        nodesColoredBySelection,
        recolorGroups
      );
      links = mergeLinks(filteredLinks, true);
    } else {
      links = mergeLinks(state.unmergedLinks);
    }

    return Object.assign({}, state, {
      links,
      nodesColoredBySelection,
      nodesColoredAtColumn,
      recolorGroups
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
  [COLLAPSE_NODE_SELECTION](state) {
    return {
      ...state,
      expandedNodesIds: []
    };
  },
  [EXPAND_NODE_SELECTION](state) {
    return {
      ...state,
      expandedNodesIds: state.selectedNodesIds
    };
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
  [RESET_TOOL_STATE](state, action) {
    return { ...toolInitialState, ...action.payload };
  },
  [SET_SANKEY_SEARCH_VISIBILITY](state, action) {
    return Object.assign({}, state, { isSearchOpen: action.searchVisibility });
  },
  [RESET_TOOL_LOADERS](state) {
    return Object.assign({}, state, { flowsLoading: true, mapLoading: true });
  }
};

const toolReducerTypes = PropTypes => ({
  choropleth: PropTypes.object.isRequired,
  choroplethLegend: PropTypes.object,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentQuant: PropTypes.object,
  detailedView: PropTypes.bool,
  expandedMapSidebarGroupsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  expandedNodesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  forcedOverview: PropTypes.bool,
  geoIdsDict: PropTypes.object.isRequired,
  highlightedNodeCoordinates: PropTypes.object,
  highlightedNodesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  initialDataLoading: PropTypes.bool,
  isMapVisible: PropTypes.bool,
  isSearchOpen: PropTypes.bool,
  linkedGeoIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  links: PropTypes.arrayOf(PropTypes.object).isRequired,
  flowsLoading: PropTypes.bool,
  mapContextualLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  mapDimensions: PropTypes.arrayOf(PropTypes.object).isRequired,
  mapDimensionsGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
  mapLoading: PropTypes.bool,
  mapVectorData: PropTypes.array,
  mapView: PropTypes.object,
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  nodesColoredAtColumn: PropTypes.number,
  nodesColoredBySelection: PropTypes.arrayOf(PropTypes.number).isRequired,
  nodesDict: PropTypes.object,
  nodesDictWithMeta: PropTypes.object.isRequired,
  recolorByNodeIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  recolorGroups: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedBiomeFilter: PropTypes.object,
  selectedColumnsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedMapBasemap: PropTypes.string,
  selectedMapContextualLayers: PropTypes.array,
  selectedMapDimensions: PropTypes.array.isRequired,
  selectedMapDimensionsWarnings: PropTypes.string,
  selectedNodesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedRecolorBy: PropTypes.object.isRequired,
  selectedResizeBy: PropTypes.object.isRequired,
  unmergedLinks: PropTypes.arrayOf(PropTypes.object).isRequired,
  visibleNodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  visibleNodesByColumn: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadedFlowsContextId: PropTypes.string
});

export default createReducer(toolInitialState, toolReducer, toolReducerTypes);
