import {
  FILTER_LINKS_BY_NODES,
  GET_COLUMNS,
  GET_LINKS,
  HIGHLIGHT_NODE,
  SET_FLOWS_LOADING_STATE,
  RESET_SELECTION,
  RESET_TOOL_STATE,
  SELECT_BIOME_FILTER,
  SELECT_COLUMN,
  SELECT_RECOLOR_BY,
  SELECT_RESIZE_BY,
  SELECT_VIEW,
  SET_SANKEY_SEARCH_VISIBILITY,
  SHOW_LINKS_ERROR,
  UPDATE_NODE_SELECTION,
  EXPAND_NODE_SELECTION,
  COLLAPSE_NODE_SELECTION,
  RESET_TOOL_LOADERS
} from 'actions/tool.actions';
import { LOAD_INITIAL_CONTEXT, SET_CONTEXT, LOAD_STATE_FROM_URL } from 'actions/app.actions';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import createReducer from 'utils/createReducer';
import { getSelectedNodesColumnsPos } from 'react-components/tool/tool.selectors';
import filterLinks from 'reducers/helpers/filterLinks';
import getNodesAtColumns from 'reducers/helpers/getNodesAtColumns';
import getNodesColoredBySelection from 'reducers/helpers/getNodesColoredBySelection';
import getNodesDict from 'reducers/helpers/getNodesDict';
import getRecolorGroups from 'reducers/helpers/getRecolorGroups';
import getVisibleNodes from 'reducers/helpers/getVisibleNodes';
import mergeLinks from 'reducers/helpers/mergeLinks';
import sortVisibleNodes from 'reducers/helpers/sortVisibleNodes';
import splitLinksByColumn from 'reducers/helpers/splitLinksByColumn';
import splitVisibleNodesByColumn from 'reducers/helpers/splitVisibleNodesByColumn';

export const toolLinksInitialState = {
  columns: [],
  currentQuant: null,
  detailedView: false,
  expandedNodesIds: [],
  forcedOverview: false,
  highlightedNodesIds: [],
  initialDataLoading: false,
  links: [],
  flowsLoading: true,
  nodes: [],
  nodesColoredAtColumn: null,
  nodesColoredBySelection: [],
  nodesDict: null,
  nodesDictWithMeta: {},
  recolorByNodeIds: [],
  recolorGroups: [],
  selectedBiomeFilter: { name: 'none', value: 'none' },
  selectedColumnsIds: [],
  selectedNodesIds: [],
  selectedRecolorBy: { type: 'none', name: 'none' },
  selectedResizeBy: { type: 'none', name: 'none' },
  unmergedLinks: [],
  visibleNodes: [],
  visibleNodesByColumn: [],
  loadedFlowsContextId: null
};

const toolLinksReducer = {
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

    return Object.assign({}, state, {
      selectedRecolorBy: selectedRecolorBy || { type: 'none', name: 'none' },
      selectedResizeBy,
      selectedBiomeFilter: biomeFilter || { value: 'none', name: 'none' }
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
      detailedView: false,
      recolorGroups: [],
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

    const { nodesDict } = getNodesDict(rawNodes, columns);

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
      initialDataLoading: false,
      selectedColumnsIds
    });
  },

  [SET_FLOWS_LOADING_STATE](state, action) {
    // TODO: remove this see tool.thunks.js
    const { loadedFlowsContextId } = action.payload;
    return { ...state, flowsLoading: true, loadedFlowsContextId };
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
      highlightedNodesIds: action.ids
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
  [RESET_TOOL_STATE](state, action) {
    return { ...toolLinksInitialState, ...action.payload };
  },
  [SET_SANKEY_SEARCH_VISIBILITY](state, action) {
    return Object.assign({}, state, { isSearchOpen: action.searchVisibility });
  },
  [RESET_TOOL_LOADERS](state) {
    return Object.assign({}, state, { flowsLoading: true, mapLoading: true });
  }
};

const toolLinksReducerTypes = PropTypes => ({
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentQuant: PropTypes.object,
  detailedView: PropTypes.bool,
  expandedNodesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  forcedOverview: PropTypes.bool,
  highlightedNodesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  initialDataLoading: PropTypes.bool,
  links: PropTypes.arrayOf(PropTypes.object).isRequired,
  flowsLoading: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  nodesColoredAtColumn: PropTypes.number,
  nodesColoredBySelection: PropTypes.arrayOf(PropTypes.number).isRequired,
  nodesDict: PropTypes.object,
  nodesDictWithMeta: PropTypes.object.isRequired,
  recolorByNodeIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  recolorGroups: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedBiomeFilter: PropTypes.object,
  selectedColumnsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedNodesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedRecolorBy: PropTypes.object.isRequired,
  selectedResizeBy: PropTypes.object.isRequired,
  unmergedLinks: PropTypes.arrayOf(PropTypes.object).isRequired,
  visibleNodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  visibleNodesByColumn: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadedFlowsContextId: PropTypes.number
});

export default createReducer(toolLinksInitialState, toolLinksReducer, toolLinksReducerTypes);
