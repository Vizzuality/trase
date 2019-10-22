export const DASHBOARD_ELEMENT__SET_CHARTS = 'DASHBOARD_ELEMENT__SET_CHARTS';
export const DASHBOARD_ELEMENT__SET_LOADING = 'DASHBOARD_ELEMENT__SET_LOADING';

export const setDashboardCharts = charts => ({
  type: DASHBOARD_ELEMENT__SET_CHARTS,
  payload: { charts }
});

export const setDashboardLoading = loading => ({
  type: DASHBOARD_ELEMENT__SET_LOADING,
  payload: { loading }
});
