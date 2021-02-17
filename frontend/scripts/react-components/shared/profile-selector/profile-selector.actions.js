import { PROFILE_STEPS, NODE_TYPES } from 'constants';

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
  const { panels, data } = profileSelector;
  const hasCompanies = panels.companies.activeItems.length > 0;
  const isDestinationCountryProfile = panels.destinations.activeItems.length > 0;
  const isProductionCountryProfile =
    panels.sources.activeItems.length > 0 &&
    data.sources[panels.sources.activeTab] &&
    data.sources[panels.sources.activeTab][0] &&
    data.sources[panels.sources.activeTab][0].nodeType === NODE_TYPES.countryOfProduction;
  const isCountryProfile = isDestinationCountryProfile || isProductionCountryProfile;
  const getProfileType = () => {
    if (isCountryProfile) return 'country';
    return hasCompanies ? 'actor' : 'place';
  };
  const getNodeId = () => {
    if (isCountryProfile) {
      return panels.destinations.activeItems[0] || panels.sources.activeItems[0];
    }
    if (hasCompanies) {
      return panels.companies.activeItems[0];
    }
    return panels.sources.activeItems[0];
  };

  const query = { nodeId: getNodeId() };

  const commodityId = panels.commodities.activeItems[0];
  if (commodityId) {
    const country = panels.countries.activeItems[0];
    const contextId = contexts.find(c => c.countryId === country && c.commodityId === commodityId)
      ?.id;
    if (contextId && !isDestinationCountryProfile) {
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
