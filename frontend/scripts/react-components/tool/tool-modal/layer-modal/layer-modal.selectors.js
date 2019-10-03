import { LAYER_TAB_NAMES } from 'constants';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';

import { createSelector } from 'reselect';
import { getChoroplethOptions } from 'react-components/tool-layers/tool-layers.selectors';

export const getLayers = createSelector(
  [
    state => state.toolLayers.data.mapContextualLayers,
    state => state.toolLayers.data.mapDimensions,
    state => state.toolLayers.data.mapDimensionsGroups,
    getChoroplethOptions
  ],
  (mapContextualLayers, mapDimensions, mapDimensionsGroups, choroplethOptions) => {
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
      [LAYER_TAB_NAMES.unit]:
        choroplethOptions?.choropleth && !isEmpty(choroplethOptions?.choropleth)
          ? unitLayers
          : null,
      [LAYER_TAB_NAMES.contextual]: Object.values(mapContextualLayers).map(layer => ({
        ...layer,
        name: layer.title,
        description: layer.tooltipText
      }))
    };
  }
);

export const getSelectedLayerIds = state => {
  const { selectedMapContextualLayers, selectedMapDimensions } = state.toolLayers;
  return {
    [LAYER_TAB_NAMES.unit]: compact(selectedMapDimensions),
    [LAYER_TAB_NAMES.contextual]: selectedMapContextualLayers
  };
};
