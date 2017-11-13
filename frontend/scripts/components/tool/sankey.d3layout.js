import _ from 'lodash';
import wrapSVGText from 'utils/wrapSVGText';
import { NUM_COLUMNS, DETAILED_VIEW_MIN_NODE_HEIGHT, DETAILED_VIEW_SCALE } from 'constants';
import { interpolateNumber as d3_interpolateNumber } from 'd3-interpolate';

const sankeyLayout = function() {
  const sankeyLayout = {};

  // in
  let viewportWidth;
  let viewportHeight;
  let columnWidth;

  // data
  let columns;
  let links;
  let detailedView;
  let maxHeight;
  let recolorBy;
  let nodesColoredAtColumn;

  // layout
  let linksColumnWidth;
  let _labelCharsPerLine;
  const _labelCharWidth = 9;
  const _labelCharHeight = 16;
  const _labelMaxLines = 3;

  sankeyLayout.setViewportSize = (size) => {
    viewportWidth = size[0];
    viewportHeight = size[1];
  };

  sankeyLayout.setLinksPayload = (payload) => {
    columns = payload.visibleNodesByColumn;
    links = payload.links;
    detailedView = payload.detailedView;
    recolorBy = payload.selectedRecolorBy;
    nodesColoredAtColumn = payload.nodesColoredAtColumn;
  };

  sankeyLayout.columnWidth = _ => {
    if (!_) return columnWidth;
    columnWidth = +_;
    _labelCharsPerLine = Math.floor(columnWidth/_labelCharWidth);
    return sankeyLayout;
  };

  sankeyLayout.columns = () => {
    return columns;
  };

  sankeyLayout.links = () => {
    return links;
  };

  sankeyLayout.isReady = () => {
    return viewportWidth && columns && recolorBy;
  };

  sankeyLayout.relayout = () => {
    if (!sankeyLayout.isReady()) {
      console.warn('not ready');
      return false;
    }

    _computeNodeCoords();
    _computeLinksCoords();
    _setNodeLabels();

    return true;
  };

  // using precomputed dimensions on links objects, this will generate SVG paths for links
  sankeyLayout.link = function() {
    function link(d) {
      var x0 = d.x,
        x1 = d.x + d.width,
        xi = d3_interpolateNumber(x0, x1),
        x2 = xi(.75),
        x3 = xi(.25),
        y0 = d.sy + d.renderedHeight / 2,
        y1 = d.ty + d.renderedHeight / 2;
      const path = 'M' + x0 + ',' + y0
           + 'C' + x2 + ',' + y0
           + ' ' + x3 + ',' + y1
           + ' ' + x1 + ',' + y1;
      return path;
    }

    return link;
  };

  sankeyLayout.getMaxHeight = () => {
    return maxHeight;
  };

  const _computeNodeCoords = () => {
    const availableLinkSpace = viewportWidth - NUM_COLUMNS * columnWidth;
    linksColumnWidth = availableLinkSpace/(NUM_COLUMNS - 1);

    maxHeight = 0;

    columns.forEach((column, i) => {
      column.x = _getColumnX(i);
      let columnY = 0;
      column.values.forEach(node => {
        node.x = column.x;
        node.y = columnY;
        if (detailedView === true) {
          node.renderedHeight = Math.max(DETAILED_VIEW_MIN_NODE_HEIGHT, DETAILED_VIEW_SCALE * node.height);
        } else {
          node.renderedHeight = node.height * viewportHeight;
        }
        columnY += node.renderedHeight;
      });
      if (columnY > maxHeight) {
        maxHeight = columnY;
      }
    });
  };

  const _setNodeLabels = () => {
    columns.forEach(column => {
      column.values.forEach(node => {
        node.label = wrapSVGText(node.name, node.renderedHeight, _labelCharHeight, _labelCharsPerLine, _labelMaxLines);
      });
    });
  };

  // compute links y and y deltas (later used by sankey.link generator)
  // will be called at each relayouting (user clicks nodes, user scrolls, etc)
  const _computeLinksCoords = () => {

    // source and target are dicts (nodeIds are keys) containing the cumulated height of all links for each node
    const stackedHeightsByNodeId = { source:{},target:{} };

    // retrieve node ys to bootstrap stackedHeights
    links.forEach(link => {
      const sId = link.sourceNodeId;
      stackedHeightsByNodeId.source[sId] = _getNode(link.sourceColumnPosition, sId).y;

      const tId = link.targetNodeId;
      stackedHeightsByNodeId.target[tId] = _getNode(link.targetColumnPosition, tId).y;
    });

    // this is only used for sorting links with color groups
    let recolorGroupsOrderedByY;

    if (links[0].recolorGroup !== undefined) {
      // get all links of the colored column
      let coloredColumnLinks = links.filter(link => {
        const entry = (nodesColoredAtColumn === 0) ? link.sourceColumnPosition : link.targetColumnPosition;
        return entry === nodesColoredAtColumn;
      });
      // remove duplicates (ie links with same connected node)
      coloredColumnLinks = _.uniqBy(coloredColumnLinks, (nodesColoredAtColumn === 0) ? 'sourceNodeId' : 'targetNodeId');
      // sort by node Y
      coloredColumnLinks.sort((linkA, linkB) => {
        const nodeIdA = (nodesColoredAtColumn === 0) ? linkA.sourceNodeId : linkA.targetNodeId;
        const nodeIdB = (nodesColoredAtColumn === 0) ? linkB.sourceNodeId : linkB.targetNodeId;
        const nodes = columns[nodesColoredAtColumn].values;
        return nodes.find(n => n.id === nodeIdA).y - nodes.find(n => n.id === nodeIdB).y;
      });
      // map to color groups
      recolorGroupsOrderedByY = coloredColumnLinks.map(l => l.recolorGroup);
    }


    // sort links by node source and target y positions
    // TODO move sorting to reducer
    links.sort((linkA, linkB) => {
      const sIdAY = stackedHeightsByNodeId.source[linkA.sourceNodeId];
      const sIdBY = stackedHeightsByNodeId.source[linkB.sourceNodeId];
      const tIdAY = stackedHeightsByNodeId.target[linkA.targetNodeId];
      const tIdBY = stackedHeightsByNodeId.target[linkB.targetNodeId];
      const defaultSort = sIdAY - sIdBY || tIdAY - tIdBY;

      if (recolorBy.name !== 'none') {
        // sorts alphabetically with quals, numerically with inds
        // TODO for quals use the order presented in the color by menu
        if (linkA.recolorBy === linkB.recolorBy) {
          return defaultSort;
        }
        let recolorBySort;
        if (linkA.recolorBy === null) {
          recolorBySort = 1;
        } else if  (linkB.recolorBy === null) {
          recolorBySort = -1;
        } else {
          recolorBySort = (recolorBy.type === 'ind') ?  linkA.recolorBy - linkB.recolorBy : linkA.recolorBy.charCodeAt(0) - linkB.recolorBy.charCodeAt(0);
        }
        return recolorBySort;
      } else if (links[0].recolorGroup !== undefined) {
        // When using a recolorGroup
        // For columns outside of adjacent columns, links should be sorted by the original *y order of recolored nodes*
        // (mapped to recolor groups before sorting, see recolorGroupsOrderedByY bit above)
        // Columns directly adjacent to the column where nodes are selected
        // are sorted by y coords (source or target, depedning on if column is at the left or the right of the selected colun).
        if (linkA.sourceColumnPosition > nodesColoredAtColumn || linkA.targetColumnPosition < nodesColoredAtColumn) {
          const recolorGroupsYA = recolorGroupsOrderedByY.indexOf(linkA.recolorGroup);
          const recolorGroupsYB = recolorGroupsOrderedByY.indexOf(linkB.recolorGroup);
          return (recolorGroupsYA === recolorGroupsYB) ? defaultSort : recolorGroupsYA - recolorGroupsYB;
        } else {
          if (linkA.targetColumnPosition <= nodesColoredAtColumn) {
            return tIdAY - tIdBY || sIdAY - sIdBY;
          } else if (linkA.sourceColumnPosition >= nodesColoredAtColumn) {
            return sIdAY - sIdBY || tIdAY - tIdBY;
          }
        }
        return defaultSort;
      } else {
        return defaultSort;
      }
    });

    links.forEach(link => {
      link.width = linksColumnWidth;
      link.x = columnWidth + _getColumnX(link.sourceColumnPosition);

      if (detailedView === true) {
        link.renderedHeight = link.height * DETAILED_VIEW_SCALE;
      } else {
        link.renderedHeight = link.height * (viewportHeight);
      }

      const sId = link.sourceNodeId;
      link.sy = stackedHeightsByNodeId.source[sId];
      stackedHeightsByNodeId.source[sId] = link.sy + link.renderedHeight;

      const tId = link.targetNodeId;
      link.ty = stackedHeightsByNodeId.target[tId];
      stackedHeightsByNodeId.target[tId] = link.ty + link.renderedHeight;
    });
  };

  const _getColumnX = (columnIndex) => columnIndex * (columnWidth + linksColumnWidth);

  const _getNode = (columnPosition, nodeId) => {
    const column = columns[columnPosition];
    return column.values.find(node => node.id === nodeId);
  };

  return sankeyLayout;
};

export default sankeyLayout;
