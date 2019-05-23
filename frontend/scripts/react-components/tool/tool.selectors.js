import { createSelector } from 'reselect';
import { makeGetSelectedResizeBy, makeGetSelectedRecolorBy } from 'selectors/indicators.selectors';
import getVisibleNodesUtil from 'reducers/helpers/getVisibleNodes';
import splitVisibleNodesByColumn from 'reducers/helpers/splitVisibleNodesByColumn';
import sortVisibleNodes from 'reducers/helpers/sortVisibleNodes';
import mergeLinks from 'reducers/helpers/mergeLinks';
import filterLinks from 'reducers/helpers/filterLinks';
import getNodesAtColumns from 'reducers/helpers/getNodesAtColumns';
import getNodesColoredBySelection from 'reducers/helpers/getNodesColoredBySelection';
import getNextRecolorGroups from 'reducers/helpers/getRecolorGroups';
import splitLinksByColumn from 'reducers/helpers/splitLinksByColumn';

const getSelectedNodesIds = state => state.toolLinks.selectedNodesIds;
const getHighlightedNodesIds = state => state.toolLinks.highlightedNodesIds;
const getToolNodes = state => state.toolLinks.data.nodes;
const getToolLinks = state => state.toolLinks.data.links;
const getToolColumns = state => state.toolLinks.data.columns;
const getSelectedColumnsIds = state => state.toolLinks.selectedColumnsIds;
const getToolResizeBy = state => state.toolLinks.selectedResizeBy;
const getToolRecolorBy = state => state.toolLinks.selectedRecolorBy;
const getToolBiomeFilter = state => state.toolLinks.selectedBiomeFilter;
const getSelectedContext = state => state.app.selectedContext;
const getSelectedMapDimensionsUids = state => state.toolLayers.selectedMapDimensions;
const getMapDimensions = state => state.toolLayers.mapDimensions;

export const getSelectedResizeBy = makeGetSelectedResizeBy(getToolResizeBy, getSelectedContext);
export const getSelectedRecolorBy = makeGetSelectedRecolorBy(getToolRecolorBy, getSelectedContext);

export const getSelectedBiomeFilter = createSelector(
  [getToolBiomeFilter, getSelectedContext],
  (selectedBiomeFilter, selectedContext) => {
    if (!selectedContext || !selectedContext.filterBy.length > 0) {
      return { value: 'none' };
    }
    return (
      selectedContext.filterBy[0].nodes.find(
        filterBy => filterBy.name === selectedBiomeFilter?.name
      ) || { value: 'none', name: 'none' }
    );
  }
);

export const getSelectedMapDimensions = createSelector(
  [getSelectedMapDimensionsUids, getMapDimensions],
  (selectedMapDimensionsIds, mapDimensions) =>
    selectedMapDimensionsIds.filter(Boolean).map(uid => mapDimensions[uid])
);

const getNodesGeoIds = nodesData =>
  nodesData
    .filter(node => node.isGeo === true && typeof node.geoId !== 'undefined' && node.geoId !== null)
    .map(node => node.geoId);

export const getVisibleNodes = createSelector(
  [getToolLinks, getToolNodes, getSelectedColumnsIds],
  (links, nodes, selectedColumnsIds) => {
    if (!links || !nodes || !selectedColumnsIds) {
      return [];
    }
    return getVisibleNodesUtil(links, nodes, selectedColumnsIds);
  }
);

export const getVisibleNodesByColumn = createSelector(
  [getVisibleNodes, getToolColumns],
  (visibleNodes, columns) => {
    if (!visibleNodes) {
      return [];
    }
    const byColumn = splitVisibleNodesByColumn(visibleNodes, columns);
    return sortVisibleNodes(byColumn);
  }
);

export const getSelectedNodesData = createSelector(
  [getSelectedNodesIds, getToolNodes],
  (selectedNodesIds, nodes) => selectedNodesIds.map(id => nodes[id])
);

export const getSelectedNodesGeoIds = createSelector(
  [getSelectedNodesData],
  getNodesGeoIds
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
  [getSelectedNodesIds, getSelectedNodesColumnsPos],
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
  (links, nodes, columns, selectedRecolorBy) =>
    splitLinksByColumn(links, nodes, columns, selectedRecolorBy)
);

export const getFilteredLinks = createSelector(
  [
    getUnmergedLinks,
    getSelectedNodesAtColumns,
    getNodesColored,
    getSelectedNodesIds,
    getToolRecolorGroups
  ],
  (unmergedLinks, selectedNodesAtColumns, nodesColored, selectedNodesIds, recolorGroups) => {
    if (selectedNodesIds.length === 0) {
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
    if (filteredLinks) {
      return mergeLinks(filteredLinks);
    }
    return mergeLinks(unmergedLinks);
  }
);

export const getHighlightedNodesData = createSelector(
  [getHighlightedNodesIds, getToolNodes],
  (highlightedNodesIds, nodes) => highlightedNodesIds.map(id => nodes[id])
);

export const getHighlightedNodesGeoIds = createSelector(
  [getHighlightedNodesData],
  getNodesGeoIds
);
