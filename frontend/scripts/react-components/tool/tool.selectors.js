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

const getSelectedContext = state => state.app.selectedContext;
const getSelectedNodesIds = state => state.toolLinks.selectedNodesIds;
const getHighlightedNodeIds = state => state.toolLinks.highlightedNodeId;
const getToolNodes = state => state.toolLinks.data.nodes;
const getToolLinks = state => state.toolLinks.data.links;
const getToolColumns = state => state.toolLinks.data.columns;
const getToolNodeHeights = state => state.toolLinks.data.nodeHeights;
const getToolResizeBy = state => state.toolLinks.selectedResizeBy;
const getToolRecolorBy = state => state.toolLinks.selectedRecolorBy;
const getToolBiomeFilter = state => state.toolLinks.selectedBiomeFilter;
const getToolSelectedColumnsIds = state => state.toolLinks.selectedColumnsIds;
const getToolSelectedMapDimensions = state => state.toolLayers.selectedMapDimensions;
const getToolMapDimensions = state => state.toolLayers.data.mapDimensions;

export const getSelectedResizeBy = makeGetSelectedResizeBy(getToolResizeBy, getSelectedContext);
export const getSelectedRecolorBy = makeGetSelectedRecolorBy(getToolRecolorBy, getSelectedContext);

export const getSelectedColumnsIds = createSelector(
  [getSelectedContext, getToolColumns, getToolSelectedColumnsIds],
  (selectedContext, columns, selectedColumnsIds) => {
    if (selectedColumnsIds && selectedColumnsIds.length === selectedContext.defaultColumns.length) {
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

const getSelectedGeoColumn = createSelector(
  [getToolColumns, getSelectedColumnsIds],
  (columns, selectedColumnsIds) =>
    columns &&
    Object.values(columns).find(column =>
      selectedColumnsIds.some(id => id === column.id && column.isGeo)
    )
);

export const getSelectedMapDimensionsUids = createSelector(
  [getSelectedGeoColumn, getToolMapDimensions, getToolSelectedMapDimensions],
  (selectedGeoColumn, mapDimensions, selectedMapDimensions) => {
    if (selectedGeoColumn && selectedGeoColumn.isChoroplethDisabled === false) {
      const allAvailableMapDimensionsUids = new Set(Object.keys(mapDimensions));
      const selectedMapDimensionsSet = new Set(selectedMapDimensions?.filter(Boolean));
      const intersection = new Set(
        [...selectedMapDimensionsSet].filter(x => allAvailableMapDimensionsUids.has(x))
      );

      // are all currently selected map dimensions available ?
      if (
        selectedMapDimensionsSet.size > 0 &&
        intersection.size === selectedMapDimensionsSet.size
      ) {
        return selectedMapDimensions;
      }

      // use default map dimensions but only if selectedMapDimensions is null
      // we want to allow the user to disable all selections
      if (!selectedMapDimensions) {
        const uids = Object.values(mapDimensions)
          .filter(dimension => dimension.isDefault)
          .map(selectedDimension => selectedDimension.uid);
        return [uids[0] || null, uids[1] || null];
      }
    }

    return [null, null];
  }
);

export const getSelectedMapDimensionsData = createSelector(
  [getSelectedMapDimensionsUids, getToolMapDimensions],
  (selectedMapDimensionsIds, mapDimensions) =>
    selectedMapDimensionsIds.filter(Boolean).map(uid => mapDimensions[uid])
);

const getNodesGeoIds = (nodesData, columns) =>
  nodesData
    .filter(node => {
      const column = columns[node.columnId];
      return column.isGeo === true && typeof node.geoId !== 'undefined' && node.geoId !== null;
    })
    .map(node => node.geoId);

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

export const getSelectedNodesData = createSelector(
  [getSelectedNodesIds, getToolNodes],
  (selectedNodesIds, nodes) => {
    console.log('nodes', nodes);
    if (nodes) {
      return selectedNodesIds.map(id => nodes[id]).filter(Boolean);
    }
    return [];
  }
);

export const getSelectedNodesGeoIds = createSelector(
  [getSelectedNodesData, getToolColumns],
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
    getSelectedNodesIds,
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

export const getHighlightedNodesData = createSelector(
  [getHighlightedNodeIds, getToolNodes],
  (highlightedNodeId, nodes) => {
    if (nodes && highlightedNodeId) {
      return [nodes[highlightedNodeId]];
    }
    return [];
  }
);

export const getHighlightedNodesGeoIds = createSelector(
  [getHighlightedNodesData, getToolColumns],
  getNodesGeoIds
);
