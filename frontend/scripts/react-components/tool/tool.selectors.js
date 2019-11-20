import { createSelector } from 'reselect';
import { getSelectedContext } from 'reducers/app.selectors';
import { getPanelsActiveNodeTypeIds } from 'react-components/nodes-panel/nodes-panel.selectors';
import { MIN_COLUMNS_NUMBER } from 'constants';

const getToolSelectedNodesIds = state => state.toolLinks.selectedNodesIds;
const getToolNodes = state => state.toolLinks.data.nodes;
const getToolColumns = state => state.toolLinks.data.columns;
const getToolSelectedColumnsIds = state => state.toolLinks.selectedColumnsIds;
const getExtraColumn = state => state.toolLinks.extraColumn;
const getHighlightedNodeIds = state => state.toolLinks.highlightedNodeId;

export const getSelectedColumnsIds = createSelector(
  [
    getSelectedContext,
    getToolSelectedColumnsIds,
    getExtraColumn,
    getToolColumns,
    getPanelsActiveNodeTypeIds
  ],
  (selectedContext, selectedColumnsIds, extraColumn, columns, panelActiveNodeTypesIds) => {
    if (
      selectedColumnsIds &&
      selectedContext &&
      selectedColumnsIds.length === selectedContext.defaultColumns.length &&
      !extraColumn
    ) {
      return selectedColumnsIds;
    }

    if (!selectedContext) {
      return [];
    }

    const selectedColumns = selectedContext.defaultColumns.reduce((acc, next) => {
      const column = columns ? columns[next.id] : next;
      let id = column.id;
      if (selectedColumnsIds && selectedColumnsIds[column.group]) {
        id = selectedColumnsIds[column.group];
      } else if (panelActiveNodeTypesIds && panelActiveNodeTypesIds[column.role]) {
        id = panelActiveNodeTypesIds[column.role];
      }
      acc.push(id);

      if (id === extraColumn?.parentId) {
        acc.push(extraColumn.id);
      }

      return acc;
    }, []);
    return selectedColumns;
  }
);

export const getHasExtraColumn = createSelector(
  [getExtraColumn, getSelectedColumnsIds],
  (extraColumn, selectedColumnsIds) => {
    if (!selectedColumnsIds || !extraColumn) return false;
    return selectedColumnsIds.includes(extraColumn.parentId);
  }
);

export const getColumnsNumber = createSelector(
  getHasExtraColumn,
  hasExtraColumn => (hasExtraColumn ? MIN_COLUMNS_NUMBER + 1 : MIN_COLUMNS_NUMBER)
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
