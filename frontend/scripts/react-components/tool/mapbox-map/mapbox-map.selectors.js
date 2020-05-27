import { createSelector } from 'reselect';
import formatValue from 'utils/formatValue';

import { getSelectedMapDimensionsData } from 'react-components/tool-layers/tool-layers.selectors';
import {
  getHighlightedNodesData
} from 'react-components/tool/tool.selectors';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';
import {
  getSelectedResizeBy
} from 'react-components/tool-links/tool-links.selectors';

export const getContexts = state => state.app.contexts || null;
export const getUnitLayersData = state => state.toolLayers.data.mapUnitLayersData || null;
export const getCountryName = createSelector(
  [getSelectedContext], (selectedContext) => selectedContext?.countryName || null
);

const getHighlightedNodesCoordinates = state =>  state.toolLayers.highlightedNodeCoordinates;
const getNodeAttributes = state => state.toolLinks.data.nodeAttributes || null;
export const getNodeHeights = state => state.toolLinks.data.nodeHeights || null;

const getValue = (unitLayerValues, selectedYears, dimension) => {
  if (!selectedYears) {
    return null;
  }
  const [firstYear, lastYear] = selectedYears;

  let value = 0;
  for (let i = firstYear; i <= lastYear; i++) {
    if (unitLayerValues.years[i]) {
      value += unitLayerValues.years[i];
    }
  }

  // Non-temporal indicator values are stored in year 0
  if (!value && unitLayerValues.years['0']) {
    return unitLayerValues.years['0'];
  }

  if (dimension.unit === '%' || dimension.type === "ind") {
    // Average of the year range
    value /= (lastYear - firstYear + 1);
  }

  return value;
};

export const getTooltipValues = createSelector(
  [
    getNodeAttributes,
    getSelectedMapDimensionsData,
    getNodeHeights,
    getHighlightedNodesData,
    getHighlightedNodesCoordinates,
    getSelectedResizeBy,
    getSelectedYears,
    getUnitLayersData
  ],
  (
    nodeAttributes,
    selectedMapDimensions,
    nodeHeights,
    nodesData,
    coordinates,
    selectedResizeBy,
    selectedYears,
    unitLayersData
  ) => {
    let values = [];
    const node = nodesData && nodesData[0];
    if (!coordinates || !unitLayersData || !node) {
      return null;
    }
    const nodeHeight = nodeHeights && nodeHeights[node.id];
    if (nodeAttributes && selectedMapDimensions && selectedMapDimensions.length > 0) {
      values = selectedMapDimensions
        .map(dimension => {
          const unitLayerValues = unitLayersData.find(d => d.geo_id === node.geoId && d.attribute_id === dimension.attributeId);
          if (!unitLayerValues) {
            return null;
          }
          const indicatorValue = getValue(unitLayerValues, selectedYears, dimension)
          return {
            title: dimension.name,
            unit: dimension.unit,
            value: formatValue(indicatorValue, dimension.name)
          };
        })
        .filter(Boolean);
    }

    // if node is visible in sankey, quant is available. E.g. Trade Volume
    if (nodeHeight) {
      values.push({
        title: selectedResizeBy.label,
        unit: selectedResizeBy.unit,
        value: formatValue(nodeHeight.quant, selectedResizeBy.label)
      });
    }

    return values;
  }
);
