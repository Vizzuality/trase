import { LAYER_TAB_NAMES } from 'constants';

import { createSelector } from 'reselect';
import {
  getSelectedMapDimensionsUids,
  getSelectedGeoColumn
} from 'react-components/tool-layers/tool-layers.selectors';
import { getSelectedContext } from 'app/app.selectors';
import { logisticLayerTemplates } from 'react-components/tool/mapbox-map/layers/logistic-layers';

const getMapContextualLayers = state => state.toolLayers.data.mapContextualLayers;
const getMapDimensions = state => state.toolLayers.data.mapDimensions;
const getMapDimensionGroups = state => state.toolLayers.data.mapDimensionsGroups;
const getSelectedMapContextualLayers = state => state.toolLayers.selectedMapContextualLayers;
const getSelectedMapLogisticLayers = state => state.toolLayers.selectedLogisticLayers;

export const getLogisticLayers = createSelector(
  [getSelectedContext],
  (selectedContext) => {
    if (!selectedContext || !logisticLayerTemplates[selectedContext.countryName]) return null;
    return logisticLayerTemplates[selectedContext.countryName].filter(l => l.commodityName === selectedContext.commodityName);
  }
);

export const getLayers = createSelector(
  [getMapContextualLayers, getMapDimensions, getMapDimensionGroups, getSelectedGeoColumn, getLogisticLayers],
  (mapContextualLayers, mapDimensions, mapDimensionsGroups, selectedGeoColumn, logisticLayers) => {
    const unitLayers = [];
    mapDimensionsGroups.forEach(group => {
      unitLayers.push({
        id: group.id,
        name: group.name,
        group: true
      });
      group.dimensions.forEach(dimension => {
        unitLayers.push({ ...mapDimensions[dimension], groupId: group.id });
      });
    });
    return {
      [LAYER_TAB_NAMES.unit]: selectedGeoColumn?.isChoroplethDisabled === false && unitLayers,
      [LAYER_TAB_NAMES.contextual]: Object.values(mapContextualLayers).map(layer => ({
        ...layer,
        name: layer.title,
        description: layer.tooltipText
      })),
      [LAYER_TAB_NAMES.logistic]: logisticLayers
    };
  }
);

export const getSelectedLayerIds = createSelector(
  [
    getSelectedMapDimensionsUids,
    getSelectedMapContextualLayers,
    getSelectedMapLogisticLayers
  ],
  (selectedMapDimensions, selectedMapContextualLayers, selectedMapLogisticLayers) => ({
    [LAYER_TAB_NAMES.unit]: selectedMapDimensions.filter(Boolean),
    [LAYER_TAB_NAMES.contextual]: selectedMapContextualLayers,
    [LAYER_TAB_NAMES.logistic]: selectedMapLogisticLayers
  })
);
