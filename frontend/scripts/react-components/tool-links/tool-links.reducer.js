import { SET_NODE_ATTRIBUTES } from 'react-components/tool/tool.actions';
import {
  TOOL_LINKS__CLEAR_SANKEY,
  TOOL_LINKS__HIGHLIGHT_NODE,
  TOOL_LINKS__SET_NODES,
  TOOL_LINKS__SET_FLOWS_LOADING,
  TOOL_LINKS__SET_COLUMNS,
  TOOL_LINKS__SET_LINKS,
  TOOL_LINKS_RESET_SANKEY,
  TOOL_LINKS__SELECT_VIEW,
  TOOL_LINKS__SET_IS_SEARCH_OPEN,
  TOOL_LINKS__SELECT_COLUMN,
  TOOL_LINKS_SET_NO_LINKS_FOUND,
  TOOL_LINKS__SET_SELECTED_NODES,
  TOOL_LINKS__SET_SELECTED_RECOLOR_BY,
  TOOL_LINKS__SET_SELECTED_RESIZE_BY,
  TOOL_LINKS__SET_SELECTED_BIOME_FILTER,
  TOOL_LINKS__SET_MISSING_LOCKED_NODES,
  TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH,
  TOOL_LINKS__CHANGE_EXTRA_COLUMN,
  TOOL_LINKS__SET_CHARTS,
  TOOL_LINKS__SET_CHARTS_LOADING
} from 'react-components/tool-links/tool-links.actions';

import { SET_CONTEXT } from 'app/app.actions';
import { NODES_PANEL__SAVE } from 'react-components/nodes-panel/nodes-panel.actions';

import immer from 'immer';
import createReducer from 'utils/createReducer';
import getNodesMetaUid from 'app/helpers/getNodeMetaUid';
import xor from 'lodash/xor';
import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import toolLinksSerialization from 'react-components/tool-links/tool-links.serializers';
import toolLinksInitialState from './tool-links.initial-state';

function setNodes(state, action) {
  const { nodes } = action.payload;
  return immer(state, draft => {
    nodes.forEach(node => {
      if (!draft.data.nodes) {
        draft.data.nodes = {};
      }
      if (!draft.data.nodesByColumnGeoId) {
        draft.data.nodesByColumnGeoId = {};
      }
      if (!draft.data.nodes[node.id]) {
        draft.data.nodes[node.id] = node;
        draft.data.nodesByColumnGeoId[`${node.columnId}-${node.geoId}`] = node.id;
      }
    });
  });
}

const onContextChange = state =>
  immer(state, draft => {
    Object.assign(draft, {
      selectedRecolorBy: toolLinksInitialState.selectedRecolorBy,
      selectedResizeBy: toolLinksInitialState.selectedResizeBy,
      selectedBiomeFilterName: toolLinksInitialState.selectedBiomeFilterName,
      extraColumn: toolLinksInitialState.extraColumn,
      extraColumnNodeId: toolLinksInitialState.extraColumnNodeId,
      detailedView: toolLinksInitialState.detailedView,
      highlightedNodeId: toolLinksInitialState.highlightedNodeId,
      selectedNodesIds: toolLinksInitialState.selectedNodesIds,
      selectedColumnsIds: toolLinksInitialState.selectedColumnsIds,
      data: toolLinksInitialState.data
    });
  });

const toolLinksReducer = {
  tool(state, action) {
    if (action.payload?.serializerParams) {
      const newState = deserialize({
        params: action.payload.serializerParams,
        state: toolLinksInitialState,
        ...toolLinksSerialization
      });
      return newState;
    }
    return state;
  },
  [TOOL_LINKS__SET_FLOWS_LOADING](state, action) {
    const { loading } = action.payload;
    return immer(state, draft => {
      draft.flowsLoading = loading;
    });
  },
  [TOOL_LINKS__SET_CHARTS_LOADING](state, action) {
    const { loading } = action.payload;
    return immer(state, draft => {
      draft.chartsLoading = loading;
    });
  },
  [NODES_PANEL__SAVE](state) {
    return immer(state, draft => {
      Object.assign(draft, {
        selectedColumnsIds: toolLinksInitialState.selectedColumnsIds,
        selectedBiomeFilterName: toolLinksInitialState.selectedBiomeFilterName,
        extraColumn: toolLinksInitialState.extraColumn,
        extraColumnNodeId: toolLinksInitialState.extraColumnNodeId,
        highlightedNodeId: toolLinksInitialState.highlightedNodeId,
        selectedNodesIds: toolLinksInitialState.selectedNodesIds
      });
    });
  },
  [TOOL_LINKS_RESET_SANKEY](state) {
    return immer(state, draft => {
      Object.assign(draft, {
        noLinksFound: toolLinksInitialState.noLinksFound,
        selectedRecolorBy: toolLinksInitialState.selectedRecolorBy,
        selectedResizeBy: toolLinksInitialState.selectedResizeBy,
        selectedBiomeFilterName: toolLinksInitialState.selectedBiomeFilterName,
        detailedView: toolLinksInitialState.detailedView,
        forcedOverview: toolLinksInitialState.forcedOverview,
        highlightedNodeId: toolLinksInitialState.highlightedNodeId,
        selectedNodesIds: toolLinksInitialState.selectedNodesIds,
        selectedColumnsIds: toolLinksInitialState.selectedColumnsIds,
        extraColumn: toolLinksInitialState.extraColumn,
        extraColumnNodeId: toolLinksInitialState.extraColumnNodeId
      });
    });
  },
  [TOOL_LINKS__CLEAR_SANKEY](state) {
    return immer(state, draft => {
      Object.assign(draft, {
        highlightedNodeId: toolLinksInitialState.highlightedNodeId,
        selectedNodesIds: toolLinksInitialState.selectedNodesIds,
        detailedView: toolLinksInitialState.detailedView,
        forcedOverview: toolLinksInitialState.forcedOverview,
        selectedBiomeFilterName: toolLinksInitialState.selectedBiomeFilterName,
        extraColumn: toolLinksInitialState.extraColumn,
        extraColumnNodeId: toolLinksInitialState.extraColumnNodeId
      });
    });
  },
  [NODES_PANEL__SAVE](state, action) {
    if (action.payload) {
      return onContextChange(state);
    }
    return state;
  },

  [SET_CONTEXT]: onContextChange,

  [TOOL_LINKS__SET_COLUMNS](state, action) {
    return immer(state, draft => {
      const { columns } = action.payload;

      draft.data.columns = {};
      columns.forEach(column => {
        draft.data.columns[column.id] = column;
      });
    });
  },
  [TOOL_LINKS__SET_NODES]: setNodes,

  [TOOL_LINKS__SET_MISSING_LOCKED_NODES]: setNodes,

  [TOOL_LINKS__SET_LINKS](state, action) {
    return immer(state, draft => {
      const { links, linksMeta } = action.payload;

      draft.data.nodeHeights = {};
      linksMeta.nodeHeights.forEach(nodeHeight => {
        draft.data.nodeHeights[nodeHeight.id] = nodeHeight;
      });
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
  [TOOL_LINKS__SET_SELECTED_BIOME_FILTER](state, action) {
    return immer(state, draft => {
      draft.selectedBiomeFilterName = action.payload.name;
    });
  },
  [TOOL_LINKS__SET_SELECTED_RECOLOR_BY](state, action) {
    return immer(state, draft => {
      draft.selectedRecolorBy = action.payload.attributeId;
    });
  },
  [TOOL_LINKS__SET_SELECTED_RESIZE_BY](state, action) {
    return immer(state, draft => {
      draft.selectedResizeBy = action.payload.attributeId;
    });
  },
  [TOOL_LINKS__SELECT_VIEW](state, action) {
    return immer(state, draft => {
      const { detailedView, forcedOverview } = action.payload;
      draft.detailedView = detailedView;
      draft.forcedOverview = forcedOverview;
    });
  },

  [TOOL_LINKS__SELECT_COLUMN](state, action) {
    return immer(state, draft => {
      const { columnId, columnIndex } = action.payload;
      if (!draft.selectedColumnsIds) {
        draft.selectedColumnsIds = [];
      }

      if (!draft.selectedColumnsIds.includes(columnId)) {
        draft.selectedColumnsIds[columnIndex] = columnId;
      }

      const isInColumn = nodeId => {
        const node = draft.data.nodes[nodeId];
        // The node could come from the search or URL and not be in the state yet
        if (!node) return true;
        const column = draft.data.columns[node.columnId];
        return column.group !== columnIndex;
      };
      draft.selectedNodesIds = state.selectedNodesIds.filter(isInColumn);
      // draft.expandedNodesIds = state.expandedNodesIds.filter(isInColumn);

      if (state.extraColumn && columnId === state.extraColumn.parentId) {
        draft.selectedNodesIds.filter(id => state.extraColumnNodeId !== id);
        // draft.expandedNodesIds.filter(id => state.extraColumnNodeId !== id);
        draft.extraColumn = toolLinksInitialState.extraColumn;
        draft.extraColumnNodeId = toolLinksInitialState.extraColumnNodeId;
      }
    });
  },
  [TOOL_LINKS__CHANGE_EXTRA_COLUMN](state, action) {
    return immer(state, draft => {
      const { columnId, parentColumnId, nodeId } = action.payload;
      const extraColumnNode =
        state.data.nodes && state.data.nodes[state.extraColumnNodeId || nodeId];

      const wasInExtraColumn = id => {
        const node = draft.data.nodes[id];
        const column = draft.data.columns[node.columnId];
        return column.id === state.extraColumn.id;
      };

      if (columnId) {
        // Open extra column
        if (extraColumnNode) {
          // draft.expandedNodesIds = state.expandedNodesIds
          //   .filter(expandedNodeId => draft.data.nodes[expandedNodeId].columnId !== parentColumnId)
          //   .concat(extraColumnNode?.id);
        }
        draft.extraColumnNodeId = action.payload.nodeId;
        draft.extraColumn = { id: columnId, parentId: parentColumnId };
      } else {
        // Close extra column
        // draft.expandedNodesIds = state.expandedNodesIds.filter(
        //   id => !wasInExtraColumn(id) && id !== extraColumnNode?.id
        // );
        draft.selectedNodesIds = state.selectedNodesIds.filter(id => !wasInExtraColumn(id));
        draft.extraColumnNodeId = null;
        draft.extraColumn = null;
      }
    });
  },
  [TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH](state, action) {
    return immer(state, draft => {
      const { results } = action.payload;
      const ids = results.map(n => n.id);

      const columns = Object.values(draft.data.columns || {});
      results.forEach(result => {
        const column = columns.find(c => c.name === result.nodeType);
        const { selectedColumnsIds } = draft;
        const needsColumnChange =
          (column.isDefault === false && !selectedColumnsIds) ||
          (column.isDefault === false && !selectedColumnsIds[column.group]) ||
          (selectedColumnsIds &&
            selectedColumnsIds[column.group] &&
            selectedColumnsIds[column.group] !== column.id);
        if (needsColumnChange) {
          if (selectedColumnsIds) {
            draft.selectedColumnsIds.splice(column.group, 1, column.id);
          } else {
            draft.selectedColumnsIds = [];
            draft.selectedColumnsIds[column.group] = column.id;
          }
        }
      });

      draft.selectedNodesIds = xor(draft.selectedNodesIds, ids);
    });
  },
  [TOOL_LINKS__SET_SELECTED_NODES](state, action) {
    return immer(state, draft => {
      const { nodeIds } = action.payload;
      let hasChanged = false;
      let newSelectedNodes = [...draft.selectedNodesIds];
      nodeIds.forEach(nodeId => {
        const node = draft.data.nodes[nodeId];
        if (node.isAggregated) {
          draft.isSearchOpen = true;
        } else {
          hasChanged = true;

          newSelectedNodes = xor(newSelectedNodes, [nodeId]);
        }
      });
      if (hasChanged) {
        // save to state the new node selection
        draft.selectedNodesIds = newSelectedNodes;
      }
    });
  },
  [TOOL_LINKS__HIGHLIGHT_NODE](state, action) {
    return immer(state, draft => {
      draft.highlightedNodeId = action.payload.nodeId;
    });
  },
  [TOOL_LINKS__SET_IS_SEARCH_OPEN](state, action) {
    return immer(state, draft => {
      draft.isSearchOpen = action.payload.isSearchOpen;
    });
  },
  [TOOL_LINKS_SET_NO_LINKS_FOUND](state, action) {
    return immer(state, draft => {
      draft.noLinksFound = action.payload.noLinksFound;
    });
  },
  [TOOL_LINKS__SET_CHARTS](state, action) {
    const { charts } = action.payload;
    return immer(state, draft => {
      draft.data.charts = charts;
    });
  }
};

const toolLinksReducerTypes = PropTypes => ({
  data: PropTypes.shape({
    columns: PropTypes.object,
    nodes: PropTypes.object,
    links: PropTypes.array,
    nodeHeights: PropTypes.object,
    nodeAttributes: PropTypes.object,
    nodesByColumnGeoId: PropTypes.object
  }).isRequired,
  noLinksFound: PropTypes.bool,
  detailedView: PropTypes.bool,
  isSearchOpen: PropTypes.bool,
  forcedOverview: PropTypes.bool,
  highlightedNodeId: PropTypes.number,
  flowsLoading: PropTypes.bool,
  selectedBiomeFilterName: PropTypes.string,
  extraColumn: PropTypes.object,
  selectedColumnsIds: PropTypes.arrayOf(PropTypes.number),
  selectedNodesIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedRecolorBy: PropTypes.number,
  selectedResizeBy: PropTypes.number
});

export default createReducer(toolLinksInitialState, toolLinksReducer, toolLinksReducerTypes);
