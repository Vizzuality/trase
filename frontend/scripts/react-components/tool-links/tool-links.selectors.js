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

import {
  getSelectedColumnsIds,
  getSelectedNodesData,
  getSelectedRecolorBy
} from 'react-components/tool/tool.selectors';

const getToolLinks = state => state.toolLinks.data.links;
const getToolNodes = state => state.toolLinks.data.nodes;
const getToolColumns = state => state.toolLinks.data.columns;
const getToolNodeHeights = state => state.toolLinks.data.nodeHeights;
const getToolSelectedNodesIds = state => state.toolLinks.selectedNodesIds;
const getToolExpandedNodesIds = state => state.toolLinks.expandedNodesIds;
const getToolSelectedColumnsIds = state => state.toolLinks.selectedColumnsIds;
const getToolDetailedView = state => state.toolLinks.detailedView;

export const getVisibleNodes = createSelector(
  [getToolLinks, getToolNodes, getSelectedColumnsIds],
  (links, nodes, selectedColumnsIds) => {
    if (!links || !nodes || !selectedColumnsIds) {
      return null;
    }
    return getVisibleNodesUtil(links, nodes, selectedColumnsIds);
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
  (selectedNodesData, columns) =>
    selectedNodesData.map(({ columnId }) => {
      const column = columns[columnId];
      return column.group;
    })
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
      return mergeLinks(filteredLinks);
    }
    return mergeLinks(unmergedLinks);
  }
);

export const getToolLinksUrlProps = createStructuredSelector({
  selectedNodesIds: getToolSelectedNodesIds,
  selectedColumnsIds: getToolSelectedColumnsIds,
  expandedNodesIds: getToolExpandedNodesIds,
  detailedView: getToolDetailedView
  // selectedResizeBy: getSelectedResizeBy,
  // selectedRecolorBy: getSelectedRecolorBy,
  // selectedBiomeFilter: getSelectedBiomeFilter
});
