import { createSelector } from 'reselect';
import formatValue from 'utils/formatValue';
import { getSelectedMapContextualLayersData } from 'react-components/tool-layers/tool-layers.selectors';
import { getHighlightedNodesData } from 'react-components/tool/tool.selectors';
import { getSelectedContext } from 'app/app.selectors';
import { getSelectedResizeBy } from 'react-components/tool-links/tool-links.selectors';
import { getContextualLayersTemplates, getRasterLayerTemplate } from './layers/contextual-layers';
import { getLogisticMapLayerTemplates } from './layers/logistic-layers';

const getSelectedLogisticLayers = state => state.toolLayers.selectedLogisticLayers;

export const getContexts = state => state.app.contexts || null;
export const getUnitLayersData = state => state.toolLayers.data.mapUnitLayersData || null;
export const getCountryName = createSelector(
  [getSelectedContext],
  selectedContext => selectedContext?.countryName || null
);

const getHighlightedNodesCoordinates = state => state.toolLayers.highlightedNodeCoordinates;
export const getNodeHeights = state => state.toolLinks.data.nodeHeights || null;

export const getTooltipValues = createSelector(
  [
    getNodeHeights,
    getHighlightedNodesData,
    getHighlightedNodesCoordinates,
    getSelectedResizeBy,
    getUnitLayersData
  ],
  (nodeHeights, nodesData, coordinates, selectedResizeBy, unitLayersData) => {
    const values = [];
    const node = nodesData && nodesData[0];
    if (!coordinates || !unitLayersData || !node) {
      return null;
    }
    const nodeHeight = nodeHeights && nodeHeights[node.id];

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

export const getContextualLayers = createSelector(
  [getSelectedMapContextualLayersData],
  selectedMapContextualLayersData => {
    let layers = [];
    const cartoLayerTemplates = getContextualLayersTemplates();

    selectedMapContextualLayersData.forEach(layerData => {
      const { identifier, cartoLayers } = layerData;
      const cartoData = cartoLayers[0];

      if (cartoData.rasterUrl) {
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
