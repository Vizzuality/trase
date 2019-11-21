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
      selectedColumnsIds.filter(Boolean).length === selectedContext.defaultColumns.length &&
      !extraColumn
    ) {
      return selectedColumnsIds;
    }

    if (!selectedContext) {
      return [];
    }

    const selectedColumns = selectedContext.defaultColumns.reduce((acc, next) => {
      // TODO: default columns should have the column role as well
      // we're relying on the columns always being specified
      const column = columns ? columns[next.id] : next;
      let id = column.id;
      if (selectedColumnsIds && selectedColumnsIds[column.group]) {
        id = selectedColumnsIds[column.group];
      } else if (panelActiveNodeTypesIds && panelActiveNodeTypesIds[column.role]) {
        const defaultActiveNodeTypeColumn = selectedContext.defaultColumns.find(
          c => c.id === panelActiveNodeTypesIds[column.role]
        );
        // FIXME: In lieu of a more solid solution that includes changes to the panel structure,
        //  we make sure that when an activeNodeType exists in another position, the default is maintained
        if (typeof defaultActiveNodeTypeColumn === 'undefined') {
          id = panelActiveNodeTypesIds[column.role];
        } else if (defaultActiveNodeTypeColumn.group === column.group) {
          id = defaultActiveNodeTypeColumn.id;
        }
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
