import { createSelector } from 'reselect';
import getNodeMeta from 'app/helpers/getNodeMeta';
import { getSelectedMapDimensionsData } from 'react-components/tool-layers/tool-layers.selectors';

const getNodeAttributes = state => state.toolLinks.data.nodeAttributes || null;
export const getNodeHeights = state => state.toolLinks.data.nodeHeights || null;
export const getTooltipValues = createSelector(
  [getNodeAttributes, getSelectedMapDimensionsData, ],
  (nodeAttributes, selectedMapDimensions, nodeHeight) => {
    let values = [];
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
