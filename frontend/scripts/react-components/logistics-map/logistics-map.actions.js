export const LOGISTICS_MAP__SET_SELECTED_YEAR = 'LOGISTICS_MAP__SET_SELECTED_YEAR';
export const LOGISTICS_MAP__SET_LAYER_ACTIVE = 'LOGISTICS_MAP__SET_LAYER_ACTIVE';

export const selectLogisticsMapYear = year => ({
  type: LOGISTICS_MAP__SET_SELECTED_YEAR,
  payload: { selectedYear: year }
});

export const setLayerActive = (layerId, active) => ({
  type: LOGISTICS_MAP__SET_LAYER_ACTIVE,
  payload: { layerId, active }
});
