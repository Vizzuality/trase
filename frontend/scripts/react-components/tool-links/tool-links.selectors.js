import { createSelector, createStructuredSelector } from 'reselect';
import mergeLinks from 'reducers/helpers/mergeLinks';
import filterLinks from 'reducers/helpers/filterLinks';
import getNodesAtColumns from 'reducers/helpers/getNodesAtColumns';
import getNodesColoredBySelection from 'reducers/helpers/getNodesColoredBySelection';
import getNextRecolorGroups from 'reducers/helpers/getRecolorGroups';
import splitLinksByColumn from 'reducers/helpers/splitLinksByColumn';
import splitVisibleNodesByColumn from 'reducers/helpers/splitVisibleNodesByColumn';
import sortVisibleNodes from 'reducers/helpers/sortVisibleNodes';
import getVisibleNodesUtil from 'reducers/helpers/getVisibleNodes';
import { getSelectedColumnsIds, getSelectedNodesData } from 'react-components/tool/tool.selectors';
import { getSelectedContext } from 'reducers/app.selectors';
import { NUM_COLUMNS } from 'constants';

const getToolLinks = state => state.toolLinks.data.links;
const getToolNodes = state => state.toolLinks.data.nodes;
const getToolColumns = state => state.toolLinks.data.columns;
const getToolNodeHeights = state => state.toolLinks.data.nodeHeights;
const getToolSelectedNodesIds = state => state.toolLinks.selectedNodesIds;
const getToolExpandedNodesIds = state => state.toolLinks.expandedNodesIds;
const getToolSelectedColumnsIds = state => state.toolLinks.selectedColumnsIds;
const getToolRecolorByName = state => state.toolLinks.selectedRecolorByName;
const getToolResizeByName = state => state.toolLinks.selectedResizeByName;
const getToolBiomeFilterName = state => state.toolLinks.selectedBiomeFilterName;
const getToolDetailedView = state => state.toolLinks.detailedView;

export const getSelectedResizeBy = createSelector(
  [getToolResizeByName, getSelectedContext],
  (selectedResizeByName, selectedContext) => {
    if (!selectedContext) {
      return null;
    }

    if (!selectedResizeByName && selectedContext) {
      return selectedContext.resizeBy.find(resizeBy => resizeBy.isDefault === true);
    }

    return selectedContext.resizeBy.find(resizeBy => resizeBy.name === selectedResizeByName);
  }
);

export const getSelectedRecolorBy = createSelector(
  [getToolRecolorByName, getSelectedContext],
  (selectedRecolorByName, selectedContext) => {
    if (!selectedContext) {
      return null;
    }

    if (!selectedRecolorByName && selectedContext) {
      return selectedContext.recolorBy.find(recolorBy => recolorBy.isDefault === true);
    }

    return selectedContext.recolorBy.find(recolorBy => recolorBy.name === selectedRecolorByName);
  }
);

export const getSelectedBiomeFilter = createSelector(
  [getToolBiomeFilterName, getSelectedContext],
  (selectedBiomeFilterName, selectedContext) => {
    if (!selectedBiomeFilterName || !selectedContext || selectedContext.filterBy.length === 0) {
      return null;
    }

    return selectedContext.filterBy[0].nodes.find(
      filterBy => filterBy.name === selectedBiomeFilterName
    );
  }
);

export const getVisibleNodes = createSelector(
  [getToolLinks, getToolNodes, getSelectedColumnsIds],
  (links, nodes, selectedColumnsIds) => {
    if (!links || !nodes || !selectedColumnsIds) {
      return null;
    }
    const visibleNodes = getVisibleNodesUtil(links, nodes, selectedColumnsIds);
    const visibleColumns = new Set(visibleNodes.map(node => node.columnId));
    return visibleColumns.size === NUM_COLUMNS ? visibleNodes : null;
  }
);

export const getVisibleNodesByColumn = createSelector(
  [getVisibleNodes, getToolColumns, getToolNodeHeights],
  (visibleNodes, columns, nodeHeights) => {
    if (!visibleNodes || !columns) {
      return [];
    }
    const byColumn = splitVisibleNodesByColumn(visibleNodes, columns);
    return sortVisibleNodes(byColumn, nodeHeights);
  }
);

export const getSelectedNodesColumnsPos = createSelector(
  [getSelectedNodesData, getToolColumns],
  (selectedNodesData, columns) => {
    if (!columns) {
      return [];
    }

    return selectedNodesData.map(({ columnId }) => {
      const column = columns[columnId];
      return column.group;
    });
  }
);

const getSelectedNodesAtColumns = createSelector(
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

const getUnmergedLinks = createSelector(
  [getToolLinks, getToolNodes, getToolColumns, getSelectedRecolorBy],
  (links, nodes, columns, selectedRecolorBy) => {
    if (!links || !nodes || !columns) {
      return null;
    }
    return splitLinksByColumn(links, nodes, columns, selectedRecolorBy);
  }
);

export const getFilteredLinks = createSelector(
  [
    getUnmergedLinks,
    getSelectedNodesAtColumns,
    getNodesColored,
    getToolSelectedNodesIds,
    getToolRecolorGroups
  ],
  (unmergedLinks, selectedNodesAtColumns, nodesColored, selectedNodesIds, recolorGroups) => {
    if (selectedNodesIds.length === 0 || unmergedLinks === null) {
      return null;
    }
    const { nodesColoredBySelection } = nodesColored;
    return filterLinks(
      unmergedLinks,
      selectedNodesAtColumns,
      nodesColoredBySelection,
      recolorGroups
    );
  }
);

export const getMergedLinks = createSelector(
  [getUnmergedLinks, getFilteredLinks],
  (unmergedLinks, filteredLinks) => {
    if (!unmergedLinks) {
      return null;
    }

    if (filteredLinks) {
      return mergeLinks(filteredLinks, true);
    }
    return mergeLinks(unmergedLinks);
  }
);

export const getToolLinksUrlProps = createStructuredSelector({
  selectedNodesIds: getToolSelectedNodesIds,
  selectedColumnsIds: getToolSelectedColumnsIds,
  expandedNodesIds: getToolExpandedNodesIds,
  detailedView: getToolDetailedView,
  selectedResizeByName: getToolResizeByName,
  selectedRecolorByName: getToolRecolorByName,
  selectedBiomeFilterName: getToolBiomeFilterName
});
