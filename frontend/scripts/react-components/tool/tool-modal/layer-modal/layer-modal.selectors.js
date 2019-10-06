import { LAYER_TAB_NAMES } from 'constants';

import { createSelector } from 'reselect';
import {
  getSelectedMapDimensionsUids,
  getSelectedGeoColumn
} from 'react-components/tool-layers/tool-layers.selectors';

const getMapContextualLayers = state => state.toolLayers.data.mapContextualLayers;
const getMapDimensions = state => state.toolLayers.data.mapDimensions;
const getMapDimensionGroups = state => state.toolLayers.data.mapDimensionsGroups;
const getSelectedMapContextualLayers = state => state.toolLayers.selectedMapContextualLayers;

export const getLayers = createSelector(
  [getMapContextualLayers, getMapDimensions, getMapDimensionGroups, getSelectedGeoColumn],
  (mapContextualLayers, mapDimensions, mapDimensionsGroups, selectedGeoColumn) => {
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
      }))
    };
  }
);

export const getSelectedLayerIds = createSelector(
  [getSelectedMapDimensionsUids, getSelectedMapContextualLayers],
  (selectedMapDimensions, selectedMapContextualLayers) => ({
    [LAYER_TAB_NAMES.unit]: selectedMapDimensions.filter(Boolean),
    [LAYER_TAB_NAMES.contextual]: selectedMapContextualLayers
  })
);
