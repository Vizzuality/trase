import { PROFILE_STEPS } from 'constants';

export const PROFILES__SET_MORE_PANEL_DATA = 'PROFILES__SET_MORE_PANEL_DATA';
export const PROFILES__SET_PANEL_DATA = 'PROFILES__SET_PANEL_DATA';
export const PROFILES__SET_ACTIVE_STEP = 'PROFILES__SET_ACTIVE_STEP';
export const PROFILES__SET_ACTIVE_ITEM = 'PROFILES__SET_ACTIVE_ITEM';
export const PROFILES__SET_ACTIVE_ITEMS = 'PROFILES__SET_ACTIVE_ITEMS';
export const PROFILES__SET_ACTIVE_TAB = 'PROFILES__SET_ACTIVE_TAB';
export const PROFILES__CLEAR_PANEL = 'PROFILES__CLEAR_PANEL';
export const PROFILES__CLEAR_PANELS = 'PROFILES__CLEAR_PANELS';
export const PROFILES__SET_PANEL_TABS = 'PROFILES__SET_PANEL_TABS';
export const PROFILES__SET_PANEL_PAGE = 'PROFILES__SET_PANEL_PAGE';
export const PROFILES__SET_LOADING_ITEMS = 'PROFILES__SET_LOADING_ITEMS';
export const PROFILES__GET_SEARCH_RESULTS = 'PROFILES__GET_SEARCH_RESULTS';
export const PROFILES__SET_SEARCH_RESULTS = 'PROFILES__SET_SEARCH_RESULTS';
export const PROFILES__SET_ACTIVE_ITEMS_WITH_SEARCH = 'PROFILES__SET_ACTIVE_ITEMS_WITH_SEARCH';

export const goToNodeProfilePage = (node, defaultYear) => dispatch =>
  dispatch({
    type: 'profileNode',
    payload: {
      query: {
        nodeId: node.id,
        contextId: node.contextId,
        year: defaultYear
      },
      profileType: node.profile
    }
  });

export const openModal = () => ({
  type: PROFILES__SET_ACTIVE_STEP,
  payload: {
    activeStep: PROFILE_STEPS.types
  }
});

export const setProfilesActiveStep = activeStep => ({
  type: PROFILES__SET_ACTIVE_STEP,
  payload: {
    activeStep
  }
});

export const setProfilesActiveItem = (activeItem, panel) => ({
  type: PROFILES__SET_ACTIVE_ITEM,
  payload: {
    panel,
    activeItem
  }
});

export const setProfilesActiveItemsWithSearch = (activeItems, panel) => ({
  type: PROFILES__SET_ACTIVE_ITEMS_WITH_SEARCH,
  payload: {
    panel,
    activeItems
  }
});

export const setProfilesActiveItems = (activeItems, panel) => ({
  type: PROFILES__SET_ACTIVE_ITEMS,
  payload: {
    panel,
    activeItems
  }
});

export const setProfilesActiveTab = (activeTab, panel) => ({
  type: PROFILES__SET_ACTIVE_TAB,
  payload: {
    panel,
    activeTab
  }
});

export const clearProfilesPanel = panel => ({
  type: PROFILES__CLEAR_PANEL,
  payload: {
    panel
  }
});

export const setProfilesPage = (page, direction) => ({
  type: PROFILES__SET_PANEL_PAGE,
  payload: {
    page,
    direction
  }
});

export const setProfilesLoadingItems = loadingItems => ({
  type: PROFILES__SET_LOADING_ITEMS,
  payload: {
    loadingItems
  }
});

export const getProfilesSearchResults = query => ({
  type: PROFILES__GET_SEARCH_RESULTS,
  payload: {
    query
  }
});

export const getProfilesParams = (state, optionsType, options = {}) => {
  const { panels } = state;
  const { sources } = panels;
  const { page } = options;
  const sourcesTab = sources.activeTab && sources.activeTab.id;
  // const companiesTab = companies.activeTab && companies.activeTab.id;
  const nodeTypesIds = {
    sources: sourcesTab
    // companies: companiesTab
  }[optionsType];
  // const activeItemParams = panel => Object.keys(panel.activeItems).join();
  const params = {
    page,
    options_type: optionsType,
    node_types_ids: nodeTypesIds
  };
  const currentStep = PROFILE_STEPS[optionsType];

  if (currentStep > PROFILE_STEPS.profiles) {
    // params.commodities_ids = activeItemParams(commodities);
  }

  return params;
};
