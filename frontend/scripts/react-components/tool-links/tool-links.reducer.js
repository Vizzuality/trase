import {
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
  COLLAPSE_NODE_SELECTION
} from 'actions/tool.actions';
import { SET_CONTEXT } from 'actions/app.actions';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import immer from 'immer';
import createReducer from 'utils/createReducer';
import getNodesDict from 'reducers/helpers/getNodesDict';
import splitLinksByColumn from 'reducers/helpers/splitLinksByColumn';

export const toolLinksInitialState = {
  columns: [],
  currentQuant: null,
  detailedView: false,
  expandedNodesIds: [],
  forcedOverview: false,
  highlightedNodesIds: [],
  initialDataLoading: false,
  flowsLoading: true,
  nodes: [],
  nodesDict: null,
  selectedBiomeFilter: null,
  selectedColumnsIds: [],
  selectedNodesIds: [],
  selectedRecolorBy: null,
  selectedResizeBy: null,
  unmergedLinks: [],
  rawLinks: [],
  loadedFlowsContextId: null,
  isSearchOpen: false
};

const toolLinksReducer = {
  [RESET_SELECTION](state) {
    return immer(state, draft => {
      Object.assign(draft, {
        highlightedNodesIds: [],
        selectedNodesIds: [],
        expandedNodesIds: [],
        selectedBiomeFilter: null
      });
    });
  },
  [SET_CONTEXT](state) {
    return immer(state, draft => {
      Object.assign(draft, {
        selectedRecolorBy: null,
        selectedResizeBy: null,
        selectedBiomeFilter: null,
        detailedView: false,
        highlightedNodesIds: [],
        selectedNodesIds: [],
        expandedNodesIds: []
      });
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
    return immer(state, draft => {
      const rawLinks = action.jsonPayload.data;
      const linksMeta = action.jsonPayload.include;

      const currentQuant = linksMeta.quant;

      const unmergedLinks = splitLinksByColumn(rawLinks, draft.nodesDict, draft.selectedRecolorBy);

      return Object.assign(draft, {
        rawLinks,
        linksMeta,
        unmergedLinks,
        currentQuant,
        flowsLoading: false
      });
    });
  },
  [SHOW_LINKS_ERROR](state) {
    return immer(state, draft => {
      Object.assign(draft, { links: null, flowsLoading: false });
    });
  },
  [SELECT_BIOME_FILTER](state, action) {
    return immer(state, draft => {
      draft.selectedBiomeFilter = action.payload;
    });
  },
  [SELECT_RECOLOR_BY](state, action) {
    return immer(state, draft => {
      draft.selectedRecolorBy = action.payload;
    });
  },
  [SELECT_RESIZE_BY](state, action) {
    return immer(state, draft => {
      draft.selectedResizeBy = action.payload;
    });
  },
  [SELECT_VIEW](state, action) {
    return immer(state, draft => {
      Object.assign(draft, {
        detailedView: action.detailedView,
        forcedOverview: action.forcedOverview
      });
    });
  },

  [SELECT_COLUMN](state, action) {
    return immer(state, draft => {
      // TODO also update choropleth with default selected indicators
      if (draft.selectedColumnsIds.indexOf(action.columnId) === -1) {
        draft.selectedColumnsIds[action.columnIndex] = action.columnId;
      }
      draft.rawLinks = [];
      draft.unmergedLinks = [];
    });
  },
  [UPDATE_NODE_SELECTION](state, action) {
    return immer(state, draft => {
      draft.selectedNodesIds = action.ids;
    });
  },
  [HIGHLIGHT_NODE](state, action) {
    return immer(state, draft => {
      draft.highlightedNodesIds = action.ids;
    });
  },
  [COLLAPSE_NODE_SELECTION](state) {
    return immer(state, draft => {
      draft.expandedNodesIds = [];
    });
  },
  [EXPAND_NODE_SELECTION](state) {
    return immer(state, draft => {
      draft.expandedNodesIds = state.selectedNodesIds;
    });
  },
  [RESET_TOOL_STATE](state, action) {
    return immer(state, draft => {
      Object.assign(draft, toolLinksInitialState, action.payload);
    });
  },
  [SET_SANKEY_SEARCH_VISIBILITY](state, action) {
    return immer(state, draft => {
      draft.isSearchOpen = action.searchVisibility;
    });
  }
};

const toolLinksReducerTypes = PropTypes => ({
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentQuant: PropTypes.object,
  detailedView: PropTypes.bool,
  isSearchOpen: PropTypes.bool,
  expandedNodesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  forcedOverview: PropTypes.bool,
  highlightedNodesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  initialDataLoading: PropTypes.bool,
  flowsLoading: PropTypes.bool,
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  nodesDict: PropTypes.object,
  selectedBiomeFilter: PropTypes.object,
  selectedColumnsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedNodesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedRecolorBy: PropTypes.object,
  selectedResizeBy: PropTypes.object,
  rawLinks: PropTypes.arrayOf(PropTypes.object),
  unmergedLinks: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadedFlowsContextId: PropTypes.number
});

export default createReducer(toolLinksInitialState, toolLinksReducer, toolLinksReducerTypes);
