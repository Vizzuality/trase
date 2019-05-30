import {
  GET_LINKS,
  HIGHLIGHT_NODE,
  RESET_SELECTION,
  RESET_TOOL_STATE,
  SELECT_BIOME_FILTER,
  SELECT_COLUMN,
  SELECT_RECOLOR_BY,
  SELECT_RESIZE_BY,
  SELECT_VIEW,
  SET_NODE_ATTRIBUTES,
  SET_SANKEY_SEARCH_VISIBILITY,
  SHOW_LINKS_ERROR,
  UPDATE_NODE_SELECTION,
  EXPAND_NODE_SELECTION,
  COLLAPSE_NODE_SELECTION
} from 'react-components/tool/tool.actions';
import {
  TOOL_LINKS__SET_FLOWS_LOADING,
  TOOL_LINKS__SET_NODES_AND_COLUMNS
} from 'react-components/tool-links/tool-links.actions';
import { SET_CONTEXT } from 'actions/app.actions';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import immer from 'immer';
import createReducer from 'utils/createReducer';
import getNodesMetaUid from 'reducers/helpers/getNodeMetaUid';

export const toolLinksInitialState = {
  data: {
    columns: null,
    nodes: null,
    links: null,
    nodeHeights: null,
    nodeAttributes: null,
    nodesByColumnGeoId: null
  },
  currentQuant: null,
  detailedView: false,
  forcedOverview: false,
  expandedNodesIds: [],
  highlightedNodesIds: [],
  flowsLoading: true, // TODO: remove this, should not be true by default.
  selectedBiomeFilter: null,
  selectedColumnsIds: [],
  selectedNodesIds: [],
  selectedRecolorBy: null,
  selectedResizeBy: null,
  isSearchOpen: false
};

const toolLinksReducer = {
  [TOOL_LINKS__SET_FLOWS_LOADING](state, action) {
    const { loading } = action.payload;
    return immer(state, draft => {
      draft.flowsLoading = loading;
    });
  },
  [RESET_SELECTION](state) {
    return immer(state, draft => {
      Object.assign(draft, {
        highlightedNodesIds: [],
        selectedNodesIds: [],
        expandedNodesIds: [],
        forcedOverview: false,
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
        expandedNodesIds: [],
        flowsLoading: true,
        data: toolLinksInitialState.data
      });
    });
  },

  [TOOL_LINKS__SET_NODES_AND_COLUMNS](state, action) {
    return immer(state, draft => {
      const { nodes, columns } = action.payload;

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

      draft.data.nodes = {};
      draft.data.nodesByColumnGeoId = {};
      nodes.forEach(node => {
        draft.data.nodes[node.id] = node;
        draft.data.nodesByColumnGeoId[`${node.columnId}-${node.geoId}`] = node.id;
      });

      // TODO the API should have the info on which file to load (if any) per column
      const municipalitiesColumn = columns.find(column => column.name === 'MUNICIPALITY');
      const logisticsHubColumn = columns.find(column => column.name === 'LOGISTICS HUB');
      if (logisticsHubColumn && municipalitiesColumn) {
        logisticsHubColumn.useGeometryFromColumnId = municipalitiesColumn.id;
      }

      draft.data.columns = {};
      columns.forEach(column => {
        draft.data.columns[column.id] = column;
      });

      // if any selectedNode, make those columns visible (selected)
      if (!isEmpty(state.selectedNodesIds)) {
        state.selectedNodesIds
          .map(id => draft.data.nodes[id])
          .forEach(node => {
            const column = draft.data.columns[node.columnId];
            selectedColumnsIds[column.group] = node.columnId;
          });
      }
      draft.selectedColumnsIds = selectedColumnsIds;
    });
  },

  [GET_LINKS](state, action) {
    return immer(state, draft => {
      const links = action.jsonPayload.data;
      const linksMeta = action.jsonPayload.include;

      draft.data.nodeHeights = {};
      linksMeta.nodeHeights.forEach(nodeHeight => {
        draft.data.nodeHeights[nodeHeight.id] = nodeHeight;
      });

      draft.currentQuant = linksMeta.quant;
      draft.data.links = links;
      draft.flowsLoading = false;
    });
  },
  [SET_NODE_ATTRIBUTES](state, action) {
    return immer(state, draft => {
      if (action.payload?.data?.length > 0) {
        draft.data.nodeAttributes = {};
        action.payload.data.forEach(attribute => {
          if (typeof draft.data.nodeAttributes[attribute.node_id] !== 'undefined') {
            const uid = getNodesMetaUid(attribute.attribute_type, attribute.attribute_id);
            draft.data.nodeAttributes[attribute.node_id][uid] = attribute;
          } else {
            const uid = getNodesMetaUid(attribute.attribute_type, attribute.attribute_id);
            draft.data.nodeAttributes[attribute.node_id] = {
              [uid]: attribute
            };
          }
        });
      } else {
        draft.data.nodeAttributes = null;
      }
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
      if (!draft.selectedColumnsIds.includes(action.columnId)) {
        draft.selectedColumnsIds[action.columnIndex] = action.columnId;
      }
      draft.data.links = [];
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
  currentQuant: PropTypes.object,
  detailedView: PropTypes.bool,
  isSearchOpen: PropTypes.bool,
  forcedOverview: PropTypes.bool,
  expandedNodesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  highlightedNodesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  flowsLoading: PropTypes.bool,
  selectedBiomeFilter: PropTypes.object,
  selectedColumnsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedNodesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedRecolorBy: PropTypes.object,
  selectedResizeBy: PropTypes.object
});

export default createReducer(toolLinksInitialState, toolLinksReducer, toolLinksReducerTypes);
