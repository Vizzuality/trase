import { createSelector } from 'reselect';
import {
  getLogisticLayers
} from 'react-components/tool/mapbox-map/mapbox-map.selectors';
import { logisticLayerTemplates } from 'react-components/tool/mapbox-map/layers/logistic-layers';

export const getInspectionLevelOptions = createSelector([getLogisticLayers], (logisticLayers) => {
  if (!logisticLayers) return null;
  const logisticTemplates = Object.values(logisticLayerTemplates).flat();
  const hasInspectionLevel = logisticLayers.some(l => {
    const templateLayerInfo = logisticTemplates.find(t => t.id === l.id);
    return templateLayerInfo.hasInspectionLevel;
  });
  return hasInspectionLevel ? [
    { label: 'All', value: 'all' },
    { label: 'SIF', value: 'SIF' },
    { label: 'SIE', value: 'SIE' },
    { label: 'SIM', value: 'SIM' },
    { label: 'Unknown', value: 'Unknown' }
  ] : null;
});

export const getSelectedInspectionLevel = createSelector(
  [state => state.toolLayers.inspectionLevel, getInspectionLevelOptions],
  (inspectionLevel, options) => {
  if(!options) return null;
  if (!inspectionLevel) return options[0];
  return options.find(o => o.value === inspectionLevel) || null;
});
