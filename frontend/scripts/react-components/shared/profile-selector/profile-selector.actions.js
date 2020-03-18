import { PROFILE_STEPS } from 'constants';

export const PROFILES__SET_MORE_PANEL_DATA = 'PROFILES__SET_MORE_PANEL_DATA';
export const PROFILES__SET_PANEL_DATA = 'PROFILES__SET_PANEL_DATA';
export const PROFILES__SET_ACTIVE_STEP = 'PROFILES__SET_ACTIVE_STEP';
export const PROFILES__SET_ACTIVE_ITEM = 'PROFILES__SET_ACTIVE_ITEM';
export const PROFILES__SET_ACTIVE_TAB = 'PROFILES__SET_ACTIVE_TAB';
export const PROFILES__SET_PANEL_TABS = 'PROFILES__SET_PANEL_TABS';
export const PROFILES__SET_PANEL_PAGE = 'PROFILES__SET_PANEL_PAGE';
export const PROFILES__SET_LOADING_ITEMS = 'PROFILES__SET_LOADING_ITEMS';
export const PROFILES__GET_SEARCH_RESULTS = 'PROFILES__GET_SEARCH_RESULTS';
export const PROFILES__SET_SEARCH_RESULTS = 'PROFILES__SET_SEARCH_RESULTS';
export const PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH = 'PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH';

export const openModal = () => ({
  type: PROFILES__SET_ACTIVE_STEP,
  payload: {
    activeStep: PROFILE_STEPS.type
  }
});

export const closeModal = () => ({
  type: PROFILES__SET_ACTIVE_STEP,
  payload: {
    activeStep: null
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

export const setProfilesActiveItemWithSearch = (activeItem, panel) => ({
  type: PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH,
  payload: {
    panel,
    activeItem
  }
});

export const setProfilesActiveTab = (activeTab, panel) => ({
  type: PROFILES__SET_ACTIVE_TAB,
  payload: {
    panel,
    activeTab
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

export const goToProfile = () => (dispatch, getState) => {
  const { profileSelector, app } = getState();
  const { contexts } = app;
  const hasCompanies = profileSelector.panels.companies.activeItems.length > 0;
  const hasDestinations = profileSelector.panels.destinations.activeItems.length > 0;
  const getProfileType = () => {
    if (hasDestinations) return 'country';
    return hasCompanies ? 'actor' : 'place';
  };
  const getNodeId = () => {
    if (hasDestinations) return profileSelector.panels.destinations.activeItems[0];
    if (hasCompanies) return profileSelector.panels.companies.activeItems[0];
    return profileSelector.panels.sources.activeItems[0];
  };

  const query = { nodeId: getNodeId() };

  const commodityId = profileSelector.panels.commodities.activeItems[0];
  if (commodityId) {
    const country = profileSelector.panels.countries.activeItems[0];
    const contextId = contexts.find(c => c.countryId === country && c.commodityId === commodityId)
      ?.id;
    if (contextId) {
      query.contextId = contextId;
    } else {
      query.commodityId = commodityId; // Destination profiles only have commodityId
    }
  }

  dispatch({ type: 'profile', payload: { profileType: getProfileType(), query } });
  dispatch(closeModal());
};

export const getProfilesSearchResults = query => ({
  type: PROFILES__GET_SEARCH_RESULTS,
  payload: {
    query
  }
});
