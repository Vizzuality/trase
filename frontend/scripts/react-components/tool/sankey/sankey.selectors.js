import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
import { DETAILED_VIEW_MIN_NODE_HEIGHT, DETAILED_VIEW_SCALE } from 'constants';
import wrapSVGText from 'utils/wrapSVGText';
import { translateText } from 'utils/transifex';
import {
  getNodesColored,
  getSelectedRecolorBy,
  getToolRecolorGroups,
  getVisibleNodes,
  getSelectedNodesAtColumns
} from 'react-components/tool-links/tool-links.selectors';
import uniqBy from 'lodash/uniqBy';
import { sortFlows } from 'react-components/tool/sankey/sort-flows';
import splitVisibleNodesByColumn from 'app/helpers/splitVisibleNodesByColumn';
import sortVisibleNodes from 'app/helpers/sortVisibleNodes';
import mergeLinks from 'app/helpers/mergeLinks';
import filterLinks from 'app/helpers/filterLinks';
import splitLinksByColumn from 'app/helpers/splitLinksByColumn';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';
import { getHasExtraColumn, getColumnsNumber } from 'react-components/tool/tool.selectors';
import { getExpandedNodesIds } from 'react-components/nodes-panel/nodes-panel.selectors';

const getToolNodeHeights = state => state.toolLinks.data.nodeHeights;
export const getToolColumns = state => state.toolLinks.data.columns;
const getToolLinks = state => state.toolLinks.data.links;
const getToolNodes = state => state.toolLinks.data.nodes;
const getToolSelectedNodesIds = state => state.toolLinks.selectedNodesIds;
const getSankeySize = state => state.toolLayers.sankeySize;
const getDetailedView = state => state.toolLinks.detailedView;
const getSankeyColumnsWidth = state => state.toolLinks.sankeyColumnsWidth;
const getToolFlowsLoading = state => state.toolLinks.flowsLoading;

const getExtraColumnId = createSelector(
  [getHasExtraColumn, state => state.toolLinks.extraColumn?.id],
  (hasExtraColumn, extraColumnId) => (hasExtraColumn ? extraColumnId : null)
);

export const getVisibleNodesByColumn = createSelector(
  [getVisibleNodes, getToolColumns, getToolNodeHeights, getColumnsNumber, getExtraColumnId],
  (visibleNodes, columns, nodeHeights, columnsNumber, extraColumnId) => {
    if (!visibleNodes || !columns) {
      return [];
    }
    const byColumn = splitVisibleNodesByColumn(visibleNodes, columns, extraColumnId, columnsNumber);
    return sortVisibleNodes(byColumn, nodeHeights);
  }
);

const getUnmergedLinks = createSelector(
  [
    getToolLinks,
    getToolNodes,
    getToolColumns,
    getSelectedRecolorBy,
    getToolFlowsLoading,
    getExtraColumnId
  ],
  (links, nodes, columns, selectedRecolorBy, flowsLoading, extraColumnId) => {
    if (!links || !nodes || !columns || flowsLoading) {
      return null;
    }

    return splitLinksByColumn(links, nodes, columns, selectedRecolorBy, extraColumnId);
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

export const getHasExpandedNodesIds = createSelector(
  getExpandedNodesIds,
  expandedNodesIds => expandedNodesIds.length > 0
);

export const getIsReExpand = createSelector(
  [getHasExpandedNodesIds, getToolSelectedNodesIds, getExpandedNodesIds],
  (hasExpandedNodesIds, selectedNodesIds, expandedNodesIds) =>
    hasExpandedNodesIds && !isEqual([...selectedNodesIds].sort(), [...expandedNodesIds].sort())
);

export const getGapBetweenColumns = createSelector(
  [getSankeySize, getSankeyColumnsWidth, getColumnsNumber],
  (sankeySize, sankeyColumnsWidth, columnNumber) => {
    const availableLinkSpace = sankeySize[0] - columnNumber * sankeyColumnsWidth;
    return availableLinkSpace / (columnNumber - 1);
  }
);

export const getSankeyColumns = createSelector(
  [
    getVisibleNodesByColumn,
    getSankeySize,
    getDetailedView,
    getToolNodeHeights,
    getSankeyColumnsWidth,
    getGapBetweenColumns
  ],
  (
    visibleNodesByColumn,
    sankeySize,
    detailedView,
    nodeHeights,
    sankeyColumnsWidth,
    gapBetweenColumns
  ) => {
    const sankeyColumns = [];

    visibleNodesByColumn.forEach((column, columnIndex) => {
      const newColumn = { ...column };
      let cumulativeY = 0;
      newColumn.x = columnIndex * (sankeyColumnsWidth + gapBetweenColumns);
      newColumn.values = column.values.map(node => {
        const newNode = { ...node };
        const nodeHeight = nodeHeights && nodeHeights[newNode.id];
        if (detailedView === true) {
          newNode.renderedHeight = Math.max(
            DETAILED_VIEW_MIN_NODE_HEIGHT,
            DETAILED_VIEW_SCALE * nodeHeight.height
          );
        } else {
          newNode.renderedHeight = nodeHeight.height * sankeySize[1];
        }

        newNode.x = newColumn.x;
        newNode.y = cumulativeY;
        cumulativeY += newNode.renderedHeight;

        const _labelCharWidth = 9;
        const _labelCharHeight = 16;
        const _labelMaxLines = 3;
        const _labelCharsPerLine = Math.floor(sankeyColumnsWidth / _labelCharWidth);

        newNode.label = wrapSVGText(
          translateText(newNode.name),
          newNode.renderedHeight,
          _labelCharHeight,
          _labelCharsPerLine,
          _labelMaxLines
        );
        return newNode;
      });
      newColumn.y = cumulativeY;
      sankeyColumns.push(newColumn);
    });

    return sankeyColumns;
  }
);

export const getSankeyMaxHeight = createSelector(
  [getSankeyColumns],
  columns => Math.max(...columns.map(c => Math.ceil(c.y)))
);

// compute links y and y deltas (later used by sankey.link generator)
// will be called at each relayouting (user clicks nodes, user scrolls, etc)
export const getSankeyLinks = createSelector(
  [
    getSankeyColumns,
    getMergedLinks,
    getNodesColored,
    getSelectedRecolorBy,
    getDetailedView,
    getSankeySize,
    getSankeyColumnsWidth,
    getGapBetweenColumns
  ],
  (
    sankeyColumns,
    mergedLinks,
    nodesColored,
    selectedRecolorBy,
    detailedView,
    sankeySize,
    sankeyColumnsWidth,
    gapBetweenColumns
  ) => {
    if (!mergedLinks || sankeyColumns.length === 0) {
      return null;
    }

    // Fix a race condition in which the links were still loading
    const isReady =
      !mergedLinks.length ||
      (mergedLinks[0] && mergedLinks[0].originalPath.length === sankeyColumns.length);
    if (!isReady) return null;

    const _getNode = (columnPosition, nodeId) => {
      const column = sankeyColumns[columnPosition];

      return column.values.find(node => node.id === nodeId);
    };

    // this is only used for sorting links with color groups
    let recolorGroupsOrderedByY;

    if (mergedLinks[0] && mergedLinks[0].recolorGroup !== undefined) {
      // get all links of the colored column
      let coloredColumnLinks = mergedLinks.filter(link => {
        const entry =
          nodesColored.nodesColoredAtColumn === 0
            ? link.sourceColumnPosition
            : link.targetColumnPosition;
        return entry === nodesColored.nodesColoredAtColumn;
      });
      // remove duplicates (ie links with same connected node)
      coloredColumnLinks = uniqBy(
        coloredColumnLinks,
        nodesColored.nodesColoredAtColumn === 0 ? 'sourceNodeId' : 'targetNodeId'
      );
      // sort by node Y
      coloredColumnLinks.sort((linkA, linkB) => {
        const nodeIdA =
          nodesColored.nodesColoredAtColumn === 0 ? linkA.sourceNodeId : linkA.targetNodeId;
        const nodeIdB =
          nodesColored.nodesColoredAtColumn === 0 ? linkB.sourceNodeId : linkB.targetNodeId;
        const nodes = sankeyColumns[nodesColored.nodesColoredAtColumn].values;
        return nodes.find(n => n.id === nodeIdA).y - nodes.find(n => n.id === nodeIdB).y;
      });
      // map to color groups
      recolorGroupsOrderedByY = coloredColumnLinks.map(l => l.recolorGroup);
    }

    // sort links by node source, target y positions and selectedRecolorBy group
    const sortedLinks = sortFlows(mergedLinks, sankeyColumns, selectedRecolorBy, {
      nodesColored,
      recolorGroupsOrderedByY
    });
    const sankeyLinks = [];
    // source and target are dicts (nodeIds are keys) containing the cumulated height of all links for each node
    const cumulativeYByNodeId = { source: {}, target: {} };
    sortedLinks.forEach(link => {
      const newLink = { ...link };
      newLink.width = gapBetweenColumns;
      newLink.x = sankeyColumnsWidth + sankeyColumns[link.sourceColumnPosition].x;

      if (detailedView === true) {
        newLink.renderedHeight = link.height * DETAILED_VIEW_SCALE;
      } else {
        newLink.renderedHeight = link.height * sankeySize[1];
      }
      const sId = link.sourceNodeId;
      newLink.sy = cumulativeYByNodeId.source[sId] || _getNode(newLink.sourceColumnPosition, sId).y;
      cumulativeYByNodeId.source[sId] = newLink.sy + newLink.renderedHeight;

      const tId = link.targetNodeId;
      newLink.ty = cumulativeYByNodeId.target[tId] || _getNode(newLink.targetColumnPosition, tId).y;
      cumulativeYByNodeId.target[tId] = newLink.ty + newLink.renderedHeight;

      sankeyLinks.push(newLink);
    });

    return sankeyLinks;
  }
);

export const getLastSelectedNodeLink = createSelector(
  [getToolSelectedNodesIds, getToolNodes, getToolColumns, getSelectedContext, getSelectedYears],
  (selectedNodesIds, nodes, columns, selectedContext, selectedYears) => {
    if (!nodes || !columns || !selectedContext || selectedNodesIds.length === 0) {
      return null;
    }

    const last = selectedNodesIds.length - 1;
    const lastId = selectedNodesIds[last];
    const node = nodes[lastId];
    const column = columns[(node?.columnId)];

    if (!node || !column) {
      return null;
    }

    return {
      type: node.type,
      nodeId: node.id,
      year: selectedYears[0],
      contextId: selectedContext.id,
      profileType: column.profileType
    };
  }
);
