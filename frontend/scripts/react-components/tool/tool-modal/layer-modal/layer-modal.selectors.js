import { LAYER_TAB_NAMES } from 'constants';
import flatten from 'lodash/flatten';

export const getLayers = state => {
  const { mapContextualLayers, mapDimensions, mapDimensionsGroups } = state.toolLayers.data;
  const unitLayers = [];
  mapDimensionsGroups.forEach(group => {
    unitLayers.push(
      group.dimensions.map(dimension => ({
        ...mapDimensions[dimension],
        groupId: group.name,
        group: true
      }))
    );
  });
  return {
    [LAYER_TAB_NAMES.contextual]: mapContextualLayers,
    [LAYER_TAB_NAMES.unit]: flatten(unitLayers)
  };
};

export const getSelectedLayers = state => {
  const { selectedMapContextualLayers, selectedMapDimensions } = state.toolLayers;
  return {
    [LAYER_TAB_NAMES.contextual]: selectedMapContextualLayers,
    [LAYER_TAB_NAMES.unit]: selectedMapDimensions
  };
};
