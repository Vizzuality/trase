export const DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA = 'DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA';
export const DASHBOARD_ELEMENT__SET_PANEL_DATA = 'DASHBOARD_ELEMENT__SET_PANEL_DATA';
export const DASHBOARD_ELEMENT__SET_ACTIVE_PANEL = 'DASHBOARD_ELEMENT__SET_ACTIVE_PANEL';
export const DASHBOARD_ELEMENT__SET_ACTIVE_ITEM = 'DASHBOARD_ELEMENT__SET_ACTIVE_ITEM';
export const DASHBOARD_ELEMENT__SET_ACTIVE_TAB = 'DASHBOARD_ELEMENT__SET_ACTIVE_TAB';
export const DASHBOARD_ELEMENT__CLEAR_PANEL = 'DASHBOARD_ELEMENT__CLEAR_PANEL';
export const DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR = 'DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR';
export const DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR =
  'DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR';
export const DASHBOARD_ELEMENT__SET_PANEL_TABS = 'DASHBOARD_ELEMENT__SET_PANEL_TABS';
export const DASHBOARD_ELEMENT__SET_PANEL_PAGE = 'DASHBOARD_ELEMENT__SET_PANEL_PAGE';
export const DASHBOARD_ELEMENT__SET_LOADING_ITEMS = 'DASHBOARD_ELEMENT__SET_LOADING_ITEMS';
export const DASHBOARD_ELEMENT__GET_SEARCH_RESULTS = 'DASHBOARD_ELEMENT__GET_SEARCH_RESULTS';
export const DASHBOARD_ELEMENT__SET_SEARCH_RESULTS = 'DASHBOARD_ELEMENT__SET_SEARCH_RESULTS';
export const DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH =
  'DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH';

export const getDashboardPanelParams = (state, optionsType, options = {}) => {
  const {
    countriesPanel,
    sourcesPanel,
    companiesPanel,
    destinationsPanel,
    commoditiesPanel
  } = state;
  const { page } = options;
  const sourcesTab = sourcesPanel.activeTab && sourcesPanel.activeTab.id;
  const companiesTab = companiesPanel.activeTab && companiesPanel.activeTab.id;

  const nodeTypesIds = {
    sources: sourcesTab,
    companies: companiesTab
  }[optionsType];
  const params = {
    page,
    options_type: optionsType,
    node_types_ids: nodeTypesIds,
    countries_ids: countriesPanel.activeItem && countriesPanel.activeItem.id
  };

  if (optionsType !== 'sources') {
    params.sources_ids = sourcesPanel.activeItem && sourcesPanel.activeItem.id;
  }

  if (optionsType !== 'commodities') {
    params.commodities_ids = commoditiesPanel.activeItem && commoditiesPanel.activeItem.id;
  }

  if (optionsType !== 'destinations') {
    params.destinations_ids = destinationsPanel.activeItem && destinationsPanel.activeItem.id;
  }

  if (optionsType !== 'companies') {
    params.companies_ids = companiesPanel.activeItem && companiesPanel.activeItem.id;
  }
  return params;
};

export const setDashboardActivePanel = activePanelId => ({
  type: DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  payload: { activePanelId }
});

export const setDashboardPanelActiveItemWithSearch = (activeItem, panel) => ({
  type: DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH,
  payload: { panel, activeItem }
});

export const setDashboardPanelActiveItem = (activeItem, panel) => ({
  type: DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
  payload: { panel, activeItem }
});

export const setDashboardPanelActiveTab = (activeTab, panel) => ({
  type: DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
  payload: { panel, activeTab }
});

export const clearDashboardPanel = panel => ({
  type: DASHBOARD_ELEMENT__CLEAR_PANEL,
  payload: { panel }
});

export const addActiveIndicator = active => ({
  type: DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR,
  payload: { active }
});

export const removeActiveIndicator = toRemove => ({
  type: DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR,
  payload: { toRemove }
});

export const setDashboardPanelPage = (page, direction) => ({
  type: DASHBOARD_ELEMENT__SET_PANEL_PAGE,
  payload: { page, direction }
});

export const setDashboardPanelLoadingItems = loadingItems => ({
  type: DASHBOARD_ELEMENT__SET_LOADING_ITEMS,
  payload: { loadingItems }
});

export const getDashboardPanelSearchResults = query => ({
  type: DASHBOARD_ELEMENT__GET_SEARCH_RESULTS,
  payload: { query }
});
