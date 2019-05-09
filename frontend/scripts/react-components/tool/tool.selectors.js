import compact from 'lodash/compact';
import { createSelector } from 'reselect';
import getVisibleNodesUtil from 'reducers/helpers/getVisibleNodes';
import splitVisibleNodesByColumn from 'reducers/helpers/splitVisibleNodesByColumn';
import sortVisibleNodes from 'reducers/helpers/sortVisibleNodes';
import mergeLinks from 'reducers/helpers/mergeLinks';
import filterLinks from 'reducers/helpers/filterLinks';
import getNodesAtColumns from 'reducers/helpers/getNodesAtColumns';
import getNodesColoredBySelection from 'reducers/helpers/getNodesColoredBySelection';
import getNextRecolorGroups from 'reducers/helpers/getRecolorGroups';

const getNodeSelectedMeta = (selectedMapDimension, node, selectedResizeByLabel, visibleNode) => {
  if (!node.meta || selectedMapDimension === null) {
    return null;
  }
  const meta = node.meta[selectedMapDimension];
  if (meta && meta.name !== selectedResizeByLabel) {
    return meta;
  }
  if (
    meta &&
    visibleNode &&
    visibleNode.quant &&
    meta.rawValue !== visibleNode.quant &&
    NODE_ENV_DEV === true
  ) {
    // See https://basecamp.com/1756858/projects/12498794/todos/312319406
    console.warn(
      'Attempting to show different values two dimensions with the same name.',
      `ResizeBy: ${selectedResizeByLabel} with value ${visibleNode.quant}`,
      `Map layer: ${meta.name} with value ${meta.rawValue}`
    );
  }
  return null;
};

const getNodesData = (
  nodesIds,
  visibleNodes,
  nodesDict,
  nodesDictWithMeta,
  selectedMapDimensions,
  selectedResizeBy
) => {
  if (!nodesIds || !visibleNodes || !nodesDict) {
    return [];
  }

  return nodesIds.map(nodeId => {
    const visibleNode = visibleNodes.find(node => node.id === nodeId);
    let node = {};

    // get_nodes might still be loading at this point, in this case just skip adding metadata
    if (nodesDictWithMeta && selectedMapDimensions) {
      node = Object.assign(node, nodesDictWithMeta[nodeId]);
      // add metas from the map layers to the selected nodes data
      node.selectedMetas = compact([
        getNodeSelectedMeta(selectedMapDimensions[0], node, selectedResizeBy.label, visibleNode),
        getNodeSelectedMeta(selectedMapDimensions[1], node, selectedResizeBy.label, visibleNode)
      ]);
    }

    if (visibleNode) {
      node = Object.assign(node, visibleNode);
    } else if (nodesDict[nodeId]) {
      node = Object.assign(node, nodesDict[nodeId]);
    }

    return node;
  });
};
const getNodesGeoIds = nodesData =>
  nodesData
    .filter(node => node.isGeo === true && typeof node.geoId !== 'undefined' && node.geoId !== null)
    .map(node => node.geoId);

const getSelectedNodesIds = state => state.toolLinks.selectedNodesIds;
const getHighlightedNodesIds = state => state.toolLinks.highlightedNodesIds;
const getNodesDictWithMeta = state => state.toolLinks.nodesDictWithMeta;
const getSelectedMapDimensions = state => state.toolLayers.selectedMapDimensions;
const getSelectedResizeBy = state => state.toolLinks.selectedResizeBy;
const getNodesDict = state => state.toolLinks.nodesDict;
const getRawLinks = state => state.toolLinks.rawLinks;
const getLinksMeta = state => state.toolLinks.linksMeta;
const getSelectedColumnsIds = state => state.toolLinks.selectedColumnsIds;
const getChoropleth = state => state.toolLayers.choropleth;
const getUnmergedLinks = state => state.toolLinks.unmergedLinks;

export const getVisibleNodes = createSelector(
  [getRawLinks, getNodesDict, getLinksMeta, getSelectedColumnsIds],
  (rawLinks, nodesDict, linksMeta, selectedColumnsIds) => {
    if (!rawLinks || !nodesDict || !linksMeta || !selectedColumnsIds) {
      return [];
    }
    return getVisibleNodesUtil(rawLinks, nodesDict, linksMeta, selectedColumnsIds);
  }
);

export const getVisibleNodesByColumn = createSelector(
  getVisibleNodes,
  visibleNodes => {
    if (!visibleNodes) {
      return [];
    }
    const byColumn = splitVisibleNodesByColumn(visibleNodes);
    return sortVisibleNodes(byColumn);
  }
);

export const getSelectedNodesData = createSelector(
  [
    getSelectedNodesIds,
    getVisibleNodes,
    getNodesDict,
    getNodesDictWithMeta,
    getSelectedMapDimensions,
    getSelectedResizeBy
  ],
  getNodesData
);

export const getSelectedNodesGeoIds = createSelector(
  [getSelectedNodesData],
  getNodesGeoIds
);

export const getSelectedNodesColumnsPos = createSelector(
  [getSelectedNodesData],
  selectedNodesData => selectedNodesData.map(node => node.columnGroup)
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
  [
    getHighlightedNodesIds,
    getVisibleNodes,
    getNodesDict,
    getNodesDictWithMeta,
    getSelectedMapDimensions,
    getSelectedResizeBy
  ],
  getNodesData
);

export const getHighlightedNodesGeoIds = createSelector(
  [getHighlightedNodesData],
  getNodesGeoIds
);

export const getCurrentHighlightedChoroplethBucket = createSelector(
  [getHighlightedNodesData, getChoropleth],
  (highlightedNodesData, choropleth) => {
    if (
      highlightedNodesData.length === 1 &&
      highlightedNodesData[0].geoId !== null &&
      choropleth !== undefined
    ) {
      return choropleth[highlightedNodesData[0].geoId] || 'ch-default';
    }

    return undefined;
  }
);
