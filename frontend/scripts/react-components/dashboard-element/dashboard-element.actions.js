export const DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA = 'DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA';
export const DASHBOARD_ELEMENT__SET_PANEL_DATA = 'DASHBOARD_ELEMENT__SET_PANEL_DATA';
export const DASHBOARD_ELEMENT__SET_ACTIVE_PANEL = 'DASHBOARD_ELEMENT__SET_ACTIVE_PANEL';
export const DASHBOARD_ELEMENT__SET_ACTIVE_ITEM = 'DASHBOARD_ELEMENT__SET_ACTIVE_ITEM';
export const DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS = 'DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS';
export const DASHBOARD_ELEMENT__SET_ACTIVE_TAB = 'DASHBOARD_ELEMENT__SET_ACTIVE_TAB';
export const DASHBOARD_ELEMENT__CLEAR_PANEL = 'DASHBOARD_ELEMENT__CLEAR_PANEL';
export const DASHBOARD_ELEMENT__CLEAR_PANELS = 'DASHBOARD_ELEMENT__CLEAR_PANELS';
export const DASHBOARD_ELEMENT__SET_PANEL_TABS = 'DASHBOARD_ELEMENT__SET_PANEL_TABS';
export const DASHBOARD_ELEMENT__SET_PANEL_PAGE = 'DASHBOARD_ELEMENT__SET_PANEL_PAGE';
export const DASHBOARD_ELEMENT__SET_LOADING_ITEMS = 'DASHBOARD_ELEMENT__SET_LOADING_ITEMS';
export const DASHBOARD_ELEMENT__GET_SEARCH_RESULTS = 'DASHBOARD_ELEMENT__GET_SEARCH_RESULTS';
export const DASHBOARD_ELEMENT__SET_SEARCH_RESULTS = 'DASHBOARD_ELEMENT__SET_SEARCH_RESULTS';
export const DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH =
  'DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH';
export const DASHBOARD_ELEMENT__SET_SELECTED_YEARS = 'DASHBOARD_ELEMENT__SET_SELECTED_YEARS';
export const DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY =
  'DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY';
export const DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY =
  'DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY';
export const DASHBOARD_ELEMENT__SET_CHARTS = 'DASHBOARD_ELEMENT__SET_CHARTS';
export const DASHBOARD_ELEMENT__EDIT_DASHBOARD = 'DASHBOARD_ELEMENT__EDIT_DASHBOARD';
export const DASHBOARD_ELEMENT__GO_TO_DASHBOARD = 'DASHBOARD_ELEMENT__GO_TO_DASHBOARD';
export const DASHBOARD_ELEMENT__GET_MISSING_DATA = 'DASHBOARD_ELEMENT__GET_MISSING_DATA';
export const DASHBOARD_ELEMENT__SET_MISSING_DATA = 'DASHBOARD_ELEMENT__SET_MISSING_DATA';
export const DASHBOARD_ELEMENT__SET_LOADING = 'DASHBOARD_ELEMENT__SET_LOADING';

export const setDashboardActivePanel = activePanelId => ({
  type: DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  payload: { activePanelId }
});

export const setDashboardPanelActiveItem = (activeItem, panel) => ({
  type: DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
  payload: { panel, activeItem }
});

export const setDashboardPanelActiveItemsWithSearch = (activeItems, panel) => ({
  type: DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH,
  payload: { panel, activeItems }
});

export const setDashboardPanelActiveItems = (activeItems, panel) => ({
  type: DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS,
  payload: { panel, activeItems }
});

export const setDashboardPanelActiveTab = (activeTab, panel) => ({
  type: DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
  payload: { panel, activeTab }
});

export const clearDashboardPanel = panel => ({
  type: DASHBOARD_ELEMENT__CLEAR_PANEL,
  payload: { panel }
});

export const clearDashboardPanels = panels => ({
  type: DASHBOARD_ELEMENT__CLEAR_PANELS,
  payload: { panels }
});

export const setDashboardPanelPage = page => ({
  type: DASHBOARD_ELEMENT__SET_PANEL_PAGE,
  payload: { page }
});

export const setDashboardPanelLoadingItems = (loadingItems, panelId) => ({
  type: DASHBOARD_ELEMENT__SET_LOADING_ITEMS,
  payload: { loadingItems, panelId }
});

export const getDashboardPanelSearchResults = query => ({
  type: DASHBOARD_ELEMENT__GET_SEARCH_RESULTS,
  payload: { query }
});

export const setDashboardSelectedYears = years => ({
  type: DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
  payload: { years }
});

export const setDashboardSelectedResizeBy = indicator => ({
  type: DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  payload: { indicator }
});

export const setDashboardSelectedRecolorBy = indicator => ({
  type: DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY,
  payload: { indicator }
});

export const setDashboardCharts = charts => ({
  type: DASHBOARD_ELEMENT__SET_CHARTS,
  payload: { charts }
});

export const setDashboardLoading = loading => ({
  type: DASHBOARD_ELEMENT__SET_LOADING,
  payload: { loading }
});

export const editDashboard = () => ({
  type: DASHBOARD_ELEMENT__EDIT_DASHBOARD
});

export const goToDashboard = payload => ({
  type: DASHBOARD_ELEMENT__GO_TO_DASHBOARD,
  payload
});

export const setMoreDashboardPanelData = ({ key, tab, data }) => ({
  type: DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
  payload: { data, key, tab }
});

export const setMissingDashboardPanelItems = (key, data, tab) => ({
  type: DASHBOARD_ELEMENT__SET_MISSING_DATA,
  payload: { key, tab, data }
});

export const getDashboardMissingPanelItems = () => ({
  type: DASHBOARD_ELEMENT__GET_MISSING_DATA
});
