import compact from 'lodash/compact';
import { createSelector } from 'reselect';

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
    if (nodesDictWithMeta) {
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

const getSelectedNodesIds = state => state.selectedNodesIds;
const getHighlightedNodesIds = state => state.highlightedNodesIds;
const getVisibleNodes = state => state.visibleNodes;
const getNodesDictWithMeta = state => state.nodesDictWithMeta;
const getSelectedMapDimensions = state => state.selectedMapDimensions;
const getSelectedResizeBy = state => state.selectedResizeBy;
const getNodesDict = state => state.nodesDict;
const getChoropleth = state => state.choropleth;

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

export const getSelectedNodesGeoIds = createSelector([getSelectedNodesData], getNodesGeoIds);

export const getSelectedNodesColumnsPos = createSelector(
  [getSelectedNodesData],
  selectedNodesData => selectedNodesData.map(node => node.columnGroup)
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

export const getHighlightedNodesGeoIds = createSelector([getHighlightedNodesData], getNodesGeoIds);

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
