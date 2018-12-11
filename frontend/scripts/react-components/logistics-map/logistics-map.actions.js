export const LOGISTICS_MAP__SET_SELECTED_YEAR = 'LOGISTICS_MAP__SET_SELECTED_YEAR';

export const selectLogisticsMapYear = year => ({
  type: LOGISTICS_MAP__SET_SELECTED_YEAR,
  payload: { selectedYear: year }
});
