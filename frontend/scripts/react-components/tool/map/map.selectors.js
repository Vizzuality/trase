import { createSelector } from 'reselect';
import formatValue from 'utils/formatValue';
import { getHighlightedNodesData } from 'react-components/tool/tool.selectors';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';
import {
  getSelectedMapDimensionsData,
  getSelectedMapContextualLayersData,
  getMapDimensionsWarnings,
  getUnitLayerWarnings
} from 'react-components/tool-layers/tool-layers.selectors';
import { getContextualLayersTemplates, getRasterLayerTemplate } from './layers/contextual-layers';
import { getLogisticMapLayerTemplates } from './layers/logistic-layers';

const getSelectedLogisticLayers = state => state.toolLayers.selectedLogisticLayers;

export const getContexts = state => state.app.contexts || null;
export const getUnitLayersData = state => state.toolLayers.data.mapUnitLayersData || null;
export const getCountryName = createSelector(
  [getSelectedContext],
  selectedContext => selectedContext?.countryName || null
);
export const getCommodityName = createSelector(
  [getSelectedContext],
  selectedContext => selectedContext?.commodityName || null
);

const getNodeAttributes = state => state.toolLinks.data.nodeAttributes || null;
const getHighlightedNodesCoordinates = state => state.toolLayers.highlightedNodeCoordinates;
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

  if (dimension.aggregationMethod === 'AVG' || dimension.unit === '%' || dimension.type === 'ind') {
    // Average of the year range
    value /= lastYear - firstYear + 1;
  }

  return value;
};

export const getTooltipValues = createSelector(
  [
    getNodeAttributes,
    getSelectedMapDimensionsData,
    getHighlightedNodesData,
    getHighlightedNodesCoordinates,
    getSelectedYears,
    getUnitLayersData
  ],
  (
    nodeAttributes,
    selectedMapDimensions,
    nodesData,
    coordinates,
    selectedYears,
    unitLayersData
  ) => {
    let values = [];
    const node = nodesData && nodesData[0];
    if (!coordinates || !unitLayersData || !node) {
      return null;
    }

    if (nodeAttributes && selectedMapDimensions && selectedMapDimensions.length > 0) {
      values = selectedMapDimensions
        .map(dimension => {
          const unitLayerValues = unitLayersData.find(
            d => d.geo_id === node.geoId && d.attribute_id === dimension.attributeId
            // && d.node_type_id === nodeTypeId - If we need to find the selected values for a specific nodeTypeId
          );
          if (!unitLayerValues) {
            return null;
          }

          const indicatorValue = getValue(unitLayerValues, selectedYears, dimension);
          return {
            title: dimension.name,
            unit: dimension.unit,
            value: formatValue(indicatorValue, dimension.name)
          };
        })
        .filter(Boolean);
    }

    return values;
  }
);

export const getContextualLayers = createSelector(
  [getSelectedMapContextualLayersData],
  selectedMapContextualLayersData => {
    let layers = [];
    const cartoLayerTemplates = getContextualLayersTemplates();

    selectedMapContextualLayersData.forEach(layerData => {
      const { identifier, cartoLayers } = layerData;
      const cartoData = cartoLayers[0];

      if (cartoData && cartoData.rasterUrl) {
        layers.push(getRasterLayerTemplate(identifier, `${cartoData.rasterUrl}{z}/{x}/{y}.png`));
      } else {
        const layerStyle = cartoLayerTemplates[identifier];
        if (layerStyle) {
          layers = layers.concat(layerStyle);
        }
      }
    });
    return layers;
  }
);

export const getLogisticLayers = createSelector(
  [getSelectedLogisticLayers, getLogisticMapLayerTemplates],
  (selectedLogisticLayers, logisticMapLayerTemplates) => {
    if (!selectedLogisticLayers) return [];
    const cartoLayerTemplates = logisticMapLayerTemplates.flat();
    return selectedLogisticLayers
      .map(l => cartoLayerTemplates.find(i => i.id === l))
      .filter(Boolean);
  }
);

export const getWarnings = createSelector(
  [getMapDimensionsWarnings,
    getUnitLayerWarnings],
  (dimensionsWarnings, unitLayersWarnings) => {
    if(!dimensionsWarnings?.length && !unitLayersWarnings?.length) return null;
    return [...(dimensionsWarnings || []), ...(unitLayersWarnings || [])];
  });
