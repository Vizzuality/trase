import { createSelector } from 'reselect';
import { makeGetSelectedResizeBy } from 'selectors/indicators.selectors';
import { getSelectedContext } from 'reducers/app.selectors';

const getToolSelectedNodesIds = state => state.toolLinks.selectedNodesIds;
const getToolNodes = state => state.toolLinks.data.nodes;
const getToolColumns = state => state.toolLinks.data.columns;
const getToolResizeBy = state => state.toolLinks.selectedResizeBy;
const getToolBiomeFilter = state => state.toolLinks.selectedBiomeFilter;
const getToolSelectedColumnsIds = state => state.toolLinks.selectedColumnsIds;
const getHighlightedNodeIds = state => state.toolLinks.highlightedNodeId;

export const getSelectedResizeBy = makeGetSelectedResizeBy(getToolResizeBy, getSelectedContext);

export const getSelectedBiomeFilter = createSelector(
  [getToolBiomeFilter, getSelectedContext],
  (selectedBiomeFilter, selectedContext) => {
    if (!selectedContext || selectedContext.filterBy.length === 0) {
      return { value: 'none' };
    }
    return (
      selectedContext.filterBy[0].nodes.find(
        filterBy => filterBy.name === selectedBiomeFilter?.name
      ) || { value: 'none', name: 'none' }
    );
  }
);

export const getSelectedColumnsIds = createSelector(
  [getSelectedContext, getToolColumns, getToolSelectedColumnsIds],
  (selectedContext, columns, selectedColumnsIds) => {
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
      acc[column.group] = id;
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
    if (nodes && highlightedNodeId) {
      return [nodes[highlightedNodeId]];
    }
    return [];
  }
);
