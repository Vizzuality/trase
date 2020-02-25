import { createSelector } from 'reselect';
import { getSelectedContext } from 'app/app.selectors';
import { getPanelsActiveNodeTypeIds } from 'react-components/nodes-panel/nodes-panel.selectors';
import groupBy from 'lodash/groupBy';
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
    if (!selectedContext || !columns) {
      return [];
    }
    const getCorrectedIndex = (index, selectionHasExtraColumnId) => {
      if (!extraColumn || selectionHasExtraColumnId) {
        return index;
      }
      if (index > columns[extraColumn.parentId].group) {
        const correctedIndex = index - 1;
        return correctedIndex;
      }
      return index;
    };
    const defaultColumns = selectedContext.defaultColumns;
    const columnsNumber = extraColumn ? MIN_COLUMNS_NUMBER + 1 : MIN_COLUMNS_NUMBER;

    // TODO: This fixes a bug when reloading with an extra column and removing it
    let correctedSelectedColumnsIds = selectedColumnsIds;
    if (selectedColumnsIds?.length > MIN_COLUMNS_NUMBER && !extraColumn) {
      const idsGroupedByGroup = groupBy(selectedColumnsIds, id => columns[id].group);
      // We assume that there is only one column by group
      correctedSelectedColumnsIds = Object.values(idsGroupedByGroup).map(ids => ids[0]);
    }

    const isExtraColumn = index =>
      extraColumn &&
      index > 0 &&
      correctedSelectedColumnsIds[index - 1] &&
      extraColumn.parentId === correctedSelectedColumnsIds[index - 1];
    const selectionHasExtraColumnId =
      extraColumn && correctedSelectedColumnsIds.includes(extraColumn.id);
    const columnsIds = Array.from(Array(columnsNumber)).map((id, index) => {
      if (isExtraColumn(index)) {
        return extraColumn.id;
      }

      if (correctedSelectedColumnsIds) {
        return correctedSelectedColumnsIds[getCorrectedIndex(index, selectionHasExtraColumnId)];
      }
      return undefined;
    });

    const selectedColumns = columnsIds.map((columnId, index) => {
      if (columnId) return columnId;

      const correctedIndex = getCorrectedIndex(index, selectionHasExtraColumnId);
      const defaultColumn = defaultColumns[correctedIndex];

      if (columnId === extraColumn?.parentId) {
        if (panelActiveNodeTypesIds && panelActiveNodeTypesIds[defaultColumn.role]) {
          const panelActiveColumnId = panelActiveNodeTypesIds[defaultColumn.role];
          const defaultActiveNodeTypeColumn = selectedContext.defaultColumns.find(
            c => c.id === panelActiveColumnId
          );
          // FIXME: In lieu of a more solid solution that includes changes to the panel structure,
          //  we make sure that when an activeNodeType exists in another position, the default is maintained
          if (typeof defaultActiveNodeTypeColumn === 'undefined') {
            return panelActiveColumnId;
          }
          if (defaultActiveNodeTypeColumn.group === correctedIndex) {
            return defaultActiveNodeTypeColumn.id;
          }
        }
      }

      return defaultColumn.id;
    });
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

export const getColumnsNumber = createSelector(getHasExtraColumn, hasExtraColumn =>
  hasExtraColumn ? MIN_COLUMNS_NUMBER + 1 : MIN_COLUMNS_NUMBER
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
