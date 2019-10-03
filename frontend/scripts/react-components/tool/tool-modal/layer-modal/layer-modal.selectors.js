import { LAYER_TAB_NAMES } from 'constants';

export const getLayers = state => {
  const { mapContextualLayers, mapDimensions, mapDimensionsGroups } = state.toolLayers.data;
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
    [LAYER_TAB_NAMES.contextual]: Object.values(mapContextualLayers).map(layer => ({
      ...layer,
      name: layer.title,
      description: layer.tooltipText
    })),
    [LAYER_TAB_NAMES.unit]: unitLayers
  };
};

export const getSelectedLayerIds = state => {
  const { selectedMapContextualLayers, selectedMapDimensions } = state.toolLayers;
  return {
    [LAYER_TAB_NAMES.contextual]: selectedMapContextualLayers,
    [LAYER_TAB_NAMES.unit]: selectedMapDimensions
  };
};
