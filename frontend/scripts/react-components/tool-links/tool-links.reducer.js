import {
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
  TOOL_LINKS__SET_NODES,
  TOOL_LINKS__SET_MORE_NODES,
  TOOL_LINKS__SET_FLOWS_LOADING,
  TOOL_LINKS__SET_COLUMNS,
  TOOL_LINKS__SET_LINKS
} from 'react-components/tool-links/tool-links.actions';
import { SET_CONTEXT } from 'actions/app.actions';
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
  flowsLoading: false, // TODO: remove this, should not be true by default.
  selectedBiomeFilter: null,
  selectedColumnsIds: null,
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
        selectedBiomeFilter: null,
        selectedColumnsIds: null
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
        selectedColumnsIds: null,
        data: toolLinksInitialState.data
      });
    });
  },

  [TOOL_LINKS__SET_COLUMNS](state, action) {
    return immer(state, draft => {
      const { columns } = action.payload;

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

      // TODO: if any selectedNode, make those columns visible (selected)
    });
  },

  [TOOL_LINKS__SET_NODES](state, action) {
    const { nodes } = action.payload;
    return immer(state, draft => {
      draft.data.nodes = {};
      draft.data.nodesByColumnGeoId = {};
      nodes.forEach(node => {
        draft.data.nodes[node.id] = node;
        draft.data.nodesByColumnGeoId[`${node.columnId}-${node.geoId}`] = node.id;
      });
    });
  },

  [TOOL_LINKS__SET_MORE_NODES](state, action) {
    const { nodes } = action.payload;
    return immer(state, draft => {
      nodes.forEach(node => {
        if (!draft.data.nodes[node.id]) {
          draft.data.nodes[node.id] = node;
          draft.data.nodesByColumnGeoId[`${node.columnId}-${node.geoId}`] = node.id;
        }
      });
    });
  },

  [TOOL_LINKS__SET_LINKS](state, action) {
    return immer(state, draft => {
      const { links, linksMeta } = action.payload;

      draft.data.nodeHeights = {};
      linksMeta.nodeHeights.forEach(nodeHeight => {
        draft.data.nodeHeights[nodeHeight.id] = nodeHeight;
      });

      draft.currentQuant = linksMeta.quant;
      draft.data.links = links;
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
      const { currentColumnsIds, columnId, columnIndex } = action.payload;
      if (!draft.selectedColumnsIds) {
        draft.selectedColumnsIds = [...currentColumnsIds];
      }
      // TODO also update choropleth with default selected indicators
      if (!draft.selectedColumnsIds.includes(columnId)) {
        draft.selectedColumnsIds[columnIndex] = columnId;
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
