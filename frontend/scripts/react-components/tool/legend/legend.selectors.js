import { createSelector } from 'reselect';
import { getLayers } from 'react-components/tool/tool-modal/layer-modal/layer-modal.selectors';
import { getLogisticLayers } from 'react-components/tool/mapbox-map/mapbox-map.selectors';
import { logisticLayerTemplates } from 'react-components/tool/mapbox-map/layers/logistic-layers';
import pick from 'lodash/pick';

export const hasLayers = createSelector(
  getLayers,
  layers => {
    if (!layers) return false;
    return Object.values(layers).some(l => l && l.length > 0);
  }
);

export const getSelectedLogisticLayers = createSelector(
  getLogisticLayers,
  layers => {
    if (!layers) return null;
    const templates = Object.values(logisticLayerTemplates).flat();
    return layers.map(l => {
      const template = templates.find(t => t.id === l.id);
      return pick(template, ['name', 'color', 'categoryName']);
    });
  }
);
