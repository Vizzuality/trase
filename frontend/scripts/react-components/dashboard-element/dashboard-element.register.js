import reducerRegistry from 'reducer-registry';
import reducer from './dashboard-element.reducer';

reducerRegistry.register('dashboardElement', reducer);

// not ideal because you have to change in two, but still better than changing across all app
export {
  DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_SELECTED_COUNTRY_ID,
  DASHBOARD_ELEMENT__SET_SELECTED_COMMODITY_ID,
  DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_PANEL_PAGE,
  DASHBOARD_ELEMENT__SET_LOADING_ITEMS,
  DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH,
  DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
  DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY,
  DASHBOARD_ELEMENT__SET_CHARTS,
  DASHBOARD_ELEMENT__EDIT_DASHBOARD,
  DASHBOARD_ELEMENT__GO_TO_DASHBOARD,
  DASHBOARD_ELEMENT__SET_LOADING,
  setDashboardPanelActiveItemsWithSearch,
  clearDashboardPanel,
  setDashboardSelectedYears,
  setDashboardSelectedResizeBy,
  setDashboardSelectedRecolorBy,
  setDashboardCharts,
  setDashboardLoading,
  editDashboard,
  goToDashboard
} from './dashboard-element.actions';
