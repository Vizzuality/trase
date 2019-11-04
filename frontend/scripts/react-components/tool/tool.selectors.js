import { createSelector, createStructuredSelector } from 'reselect';
import { getSelectedContext } from 'reducers/app.selectors';
import { MIN_COLUMNS_NUMBER } from 'constants';

const getToolSelectedNodesIds = state => state.toolLinks.selectedNodesIds;
const getToolNodes = state => state.toolLinks.data.nodes;
const getToolSelectedColumnsIds = state => state.toolLinks.selectedColumnsIds;
const getExtraColumn = state => state.toolLinks.extraColumn;
const getHighlightedNodeIds = state => state.toolLinks.highlightedNodeId;

const getSources = state => state.nodesPanel.sources.selectedNodesIds;
const getDestinations = state => state.nodesPanel.destinations.selectedNodesIds;
const getExporters = state => state.nodesPanel.exporters.selectedNodesIds;
const getImporters = state => state.nodesPanel.importers.selectedNodesIds;

const getSelectedCountryId = state => state.nodesPanel.countries.selectedNodeId;
const getSelectedCommodityId = state => state.nodesPanel.commodities.selectedNodeId;

export const getSelectedColumnsIds = createSelector(
  [getSelectedContext, getToolSelectedColumnsIds, getExtraColumn],
  (selectedContext, selectedColumnsIds, extraColumn) => {
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

    const selectedColumns = selectedContext.defaultColumns.reduce((acc, column) => {
      let id = column.id;
      if (selectedColumnsIds && selectedColumnsIds[column.group]) {
        id = selectedColumnsIds[column.group];
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

const getURLParamsIfContext = (params, context) => {
  if (!context) {
    return null;
  }
  return params;
};

const getURLSources = createSelector(
  [getSources, getSelectedContext],
  getURLParamsIfContext
);
const getURLExporters = createSelector(
  [getExporters, getSelectedContext],
  getURLParamsIfContext
);
const getURLImporters = createSelector(
  [getImporters, getSelectedContext],
  getURLParamsIfContext
);
const getURLDestinations = createSelector(
  [getDestinations, getSelectedContext],
  getURLParamsIfContext
);

export const getPanelUrlProps = createStructuredSelector({
  sources: getURLSources,
  exporters: getURLExporters,
  importers: getURLImporters,
  countries: getSelectedCountryId,
  destinations: getURLDestinations,
  commodities: getSelectedCommodityId
});
