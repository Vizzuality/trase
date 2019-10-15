import { createSelector } from 'reselect';
import { getSelectedContext } from 'reducers/app.selectors';

const getToolSelectedNodesIds = state => state.toolLinks.selectedNodesIds;
const getToolNodes = state => state.toolLinks.data.nodes;
const getToolColumns = state => state.toolLinks.data.columns;
const getToolSelectedColumnsIds = state => state.toolLinks.selectedColumnsIds;
const getExtraColumnId = state => state.toolLinks.extraColumnId;
const getHighlightedNodeIds = state => state.toolLinks.highlightedNodeId;

export const getSelectedColumnsIds = createSelector(
  [getSelectedContext, getToolColumns, getToolSelectedColumnsIds, getExtraColumnId],
  (selectedContext, columns, selectedColumnsIds, extraColumnId) => {
    if (
      selectedColumnsIds &&
      selectedContext &&
      selectedColumnsIds.length === selectedContext.defaultColumns.length
    ) {
      return selectedColumnsIds;
    }

    if (!columns && !selectedContext) {
      return [];
    }

    return selectedContext.defaultColumns.reduce((acc, column) => {
      let id = column.id;
      if (selectedColumnsIds && selectedColumnsIds[column.group]) {
        id = selectedColumnsIds[column.group];
      }
      acc.push(id);

      if (columns && columns[id].filterTo && columns[id].filterTo === extraColumnId) {
        acc.push(extraColumnId);
      }

      return acc;
    }, []);
  }
);

export const getSelectedNodesData = createSelector(
  [getToolSelectedNodesIds, getToolNodes],
  (selectedNodesIds, nodes) => {
    if (nodes) {
      return selectedNodesIds.map(id => nodes[id]).filter(Boolean);
    }
    return [];
  }
);

export const getHighlightedNodesData = createSelector(
  [getHighlightedNodeIds, getToolNodes],
  (highlightedNodeId, nodes) => {
    if (nodes && highlightedNodeId && nodes[highlightedNodeId]) {
      return [nodes[highlightedNodeId]];
    }
    return [];
  }
);
