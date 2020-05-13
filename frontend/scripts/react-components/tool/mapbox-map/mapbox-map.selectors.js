import { createSelector } from 'reselect';
import getNodeMeta from 'app/helpers/getNodeMeta';
import formatValue from 'utils/formatValue';

import { getSelectedMapDimensionsData } from 'react-components/tool-layers/tool-layers.selectors';
import {
  getHighlightedNodesData
} from 'react-components/tool/tool.selectors';
import {
  getSelectedResizeBy
} from 'react-components/tool-links/tool-links.selectors';

const getHighlightedNodesCoordinates = state =>  state.toolLayers.highlightedNodeCoordinates;
const getNodeAttributes = state => state.toolLinks.data.nodeAttributes || null;
export const getNodeHeights = state => state.toolLinks.data.nodeHeights || null;
export const getTooltipValues = createSelector(
  [
    getNodeAttributes,
    getSelectedMapDimensionsData,
    getNodeHeights,
    getHighlightedNodesData,
    getHighlightedNodesCoordinates,
    getSelectedResizeBy
  ],
  (nodeAttributes, selectedMapDimensions, nodeHeights, nodesData, coordinates, selectedResizeBy) => {
    let values = [];

    if (!coordinates) {
      return null;
    }

    const node = nodesData[0];
    const nodeHeight = nodeHeights && nodeHeights[node.id];

    if (nodeAttributes && selectedMapDimensions && selectedMapDimensions.length > 0) {
      values = selectedMapDimensions
        .map(dimension => {
          const meta = getNodeMeta(
            dimension,
            node,
            nodeAttributes,
            selectedResizeBy,
            nodeHeights
          );
          if (!meta) {
            return null;
          }
          return {
            title: dimension.name,
            unit: dimension.unit,
            value: formatValue(meta.value, dimension.name)
          };
        })
        .filter(Boolean);
    }

    // if node is visible in sankey, quant is available
    if (nodeHeight) {
      values.push({
        title: selectedResizeBy.label,
        unit: selectedResizeBy.unit,
        value: formatValue(nodeHeight.quant, selectedResizeBy.label)
      });
    }

    return values;
});
