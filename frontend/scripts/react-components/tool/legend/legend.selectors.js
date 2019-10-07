import { createSelector } from 'reselect';
import { getLayers } from 'react-components/tool/tool-modal/layer-modal/layer-modal.selectors';

export const hasLayers = createSelector(
  getLayers,
  layers => {
    if (!layers) return false;
    return Object.values(layers).some(l => l && l.length > 0);
  }
);
