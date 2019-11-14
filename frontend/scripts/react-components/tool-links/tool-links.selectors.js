import { createSelector, createStructuredSelector } from 'reselect';
import getNodesAtColumns from 'reducers/helpers/getNodesAtColumns';
import getNodesColoredBySelection from 'reducers/helpers/getNodesColoredBySelection';
import getNextRecolorGroups from 'reducers/helpers/getRecolorGroups';
import getVisibleNodesUtil from 'reducers/helpers/getVisibleNodes';
import {
  getSelectedColumnsIds,
  getSelectedNodesData,
  getHasExtraColumn,
  getColumnsNumber
} from 'react-components/tool/tool.selectors';
import { getSelectedContext, getSelectedYears } from 'reducers/app.selectors';
import { makeGetAvailableYears } from 'selectors/years.selectors';
import getCorrectedPosition from 'utils/getCorrectedPosition';

const getToolLinks = state => state.toolLinks.data.links;
const getToolNodes = state => state.toolLinks.data.nodes;
const getToolColumns = state => state.toolLinks.data.columns;
const getToolSelectedNodesIds = state => state.toolLinks.selectedNodesIds;
const getToolSelectedColumnsIds = state => state.toolLinks.selectedColumnsIds;
const getToolRecolorBy = state => state.toolLinks.selectedRecolorBy;
const getToolResizeBy = state => state.toolLinks.selectedResizeBy;
export const getToolColumnFilterNodeId = state => state.toolLinks.extraColumnNodeId;
const getToolDetailedView = state => state.toolLinks.detailedView;
const getToolExtraColumn = createSelector(
  [getHasExtraColumn, state => state.toolLinks.extraColumn],
  (hasExtraColumn, extraColumn) => (hasExtraColumn ? extraColumn : null)
);

const getToolExtraColumnId = createSelector(
  getToolExtraColumn,
  extraColumn => (extraColumn ? extraColumn.id : null)
);

export const getSelectedResizeBy = createSelector(
  [getToolResizeBy, getSelectedContext],
  (selectedResizeBy, selectedContext) => {
    if (!selectedContext) {
      return null;
    }

    if (!selectedResizeBy && selectedContext) {
      return selectedContext.resizeBy.find(resizeBy => resizeBy.isDefault === true);
    }

    return selectedContext.resizeBy.find(resizeBy => resizeBy.attributeId === selectedResizeBy);
  }
);

export const getSelectedRecolorBy = createSelector(
  [getToolRecolorBy, getSelectedContext],
  (selectedRecolorBy, selectedContext) => {
    if (!selectedContext) {
      return null;
    }

    if (!selectedRecolorBy && selectedContext) {
      return selectedContext.recolorBy.find(recolorBy => recolorBy.isDefault === true);
    }

    return selectedContext.recolorBy.find(recolorBy => recolorBy.attributeId === selectedRecolorBy);
  }
);

export const getSelectedColumnFilterNode = createSelector(
  [getToolColumnFilterNodeId, getSelectedContext, getHasExtraColumn],
  (columnFilterNodeId, selectedContext, hasExtraColumn) => {
    if (
      !columnFilterNodeId ||
      !selectedContext ||
      selectedContext.filterBy.length === 0 ||
      !hasExtraColumn
    ) {
      return null;
    }

    return selectedContext.filterBy[0].nodes.find(filterBy => filterBy.id === columnFilterNodeId);
  }
);

export const getVisibleNodes = createSelector(
  [
    getToolLinks,
    getToolNodes,
    getToolColumns,
    getSelectedColumnsIds,
    getToolExtraColumnId,
    getColumnsNumber
  ],
  (links, nodes, toolColumns, selectedColumnsIds, extraColumnId, columnsNumber) => {
    if (!links || !nodes || !selectedColumnsIds || !toolColumns) {
      return null;
    }
    const visibleNodes = getVisibleNodesUtil(links, nodes, selectedColumnsIds);
    const visibleNodesWithCorrectedColumn = visibleNodes.map(node => {
      if (!toolColumns || !extraColumnId || toolColumns[node.columnId].filterBy !== extraColumnId) {
        return node;
      }
      return { ...node, columnId: extraColumnId };
    });
    const visibleColumns = new Set(visibleNodesWithCorrectedColumn.map(node => node.columnId));
    return visibleColumns.size === columnsNumber ? visibleNodesWithCorrectedColumn : null;
  }
);

export const getSelectedNodesColumnsPos = createSelector(
  [getSelectedNodesData, getToolColumns, getToolExtraColumnId],
  (selectedNodesData, columns, extraColumnId) => {
    if (!columns) {
      return [];
    }
    return selectedNodesData.map(({ columnId }) =>
      getCorrectedPosition(columns, columnId, extraColumnId)
    );
  }
);

export const getSelectedNodesAtColumns = createSelector(
  [getToolSelectedNodesIds, getSelectedNodesColumnsPos],
  (selectedNodesIds, selectedNodesColumnsPos) =>
    getNodesAtColumns(selectedNodesIds, selectedNodesColumnsPos)
);

export const getNodesColored = createSelector(
  getSelectedNodesAtColumns,
  selectedNodesAtColumns => getNodesColoredBySelection(selectedNodesAtColumns)
);

export const getToolRecolorGroups = createSelector(
  getNodesColored,
  nodesColored => getNextRecolorGroups(nodesColored.nodesColoredBySelection)
);

export const getToolLinksUrlProps = createStructuredSelector({
  selectedNodesIds: getToolSelectedNodesIds,
  selectedColumnsIds: getToolSelectedColumnsIds,
  detailedView: getToolDetailedView,
  selectedResizeBy: getToolResizeBy,
  selectedRecolorBy: getToolRecolorBy,
  extraColumn: getToolExtraColumn,
  extraColumnNodeId: getToolColumnFilterNodeId
});

export const getToolYearsProps = createStructuredSelector({
  selectedYears: getSelectedYears,
  years: makeGetAvailableYears(getToolResizeBy, getToolRecolorBy, getSelectedContext)
});
