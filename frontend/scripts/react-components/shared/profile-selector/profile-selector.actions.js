import { redirect } from 'redux-first-router';
import isEmpty from 'lodash/isEmpty';

import { PROFILE_STEPS } from 'constants';

export const PROFILES__SET_MORE_PANEL_DATA = 'PROFILES__SET_MORE_PANEL_DATA';
export const PROFILES__SET_PANEL_DATA = 'PROFILES__SET_PANEL_DATA';
export const PROFILES__SET_ACTIVE_STEP = 'PROFILES__SET_ACTIVE_STEP';
export const PROFILES__SET_ACTIVE_ITEM = 'PROFILES__SET_ACTIVE_ITEM';
export const PROFILES__SET_ACTIVE_TAB = 'PROFILES__SET_ACTIVE_TAB';
export const PROFILES__CLEAR_PANEL = 'PROFILES__CLEAR_PANEL';
export const PROFILES__CLEAR_PANELS = 'PROFILES__CLEAR_PANELS';
export const PROFILES__SET_PANEL_TABS = 'PROFILES__SET_PANEL_TABS';
export const PROFILES__SET_PANEL_PAGE = 'PROFILES__SET_PANEL_PAGE';
export const PROFILES__SET_LOADING_ITEMS = 'PROFILES__SET_LOADING_ITEMS';
export const PROFILES__GET_SEARCH_RESULTS = 'PROFILES__GET_SEARCH_RESULTS';
export const PROFILES__SET_SEARCH_RESULTS = 'PROFILES__SET_SEARCH_RESULTS';
export const PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH = 'PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH';

export const openModal = () => ({
  type: PROFILES__SET_ACTIVE_STEP,
  payload: {
    activeStep: PROFILE_STEPS.types
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

export const setProfilesActiveItemWithSearch = (activeItems, panel) => ({
  type: PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH,
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
export const goToProfile = () => (dispatch, getState) => {
  const { profileSelector, app } = getState();
  const { contexts } = app;
  const hasCompanies = !isEmpty(profileSelector.panels.companies.activeItems);
  const profileType = hasCompanies ? 'actor' : 'place';
  const profileSelection = hasCompanies
    ? Object.values(profileSelector.panels.companies.activeItems)[0]
    : Object.values(profileSelector.panels.sources.activeItems)[0];
  const query = {
    nodeId: profileSelection.id
  };
  const commodity = Object.values(profileSelector.panels.commodities.activeItems)[0];
  if (commodity) {
    const country = Object.values(profileSelector.panels.countries.activeItems)[0];
    const contextId = contexts.find(
      c => c.countryId === country.id && c.commodityId === commodity.id
    )?.id;
    if (contextId) query.contextId = contextId;
  }

  dispatch(
    redirect({
      type: 'profileNode',
      payload: {
        profileType,
        query
      }
    })
  );
  dispatch(closeModal());
};

export const getProfilesSearchResults = query => ({
  type: PROFILES__GET_SEARCH_RESULTS,
  payload: {
    query
  }
});

export const getProfilesParams = (state, step, options = {}) => {
  const { panels } = state;
  const { countries, sources, companies } = panels;
  const { page } = options;
  const activeItemParams = panel => Object.keys(panel.activeItems).join();
  const params = {
    page,
    options_type: step,
    node_types_ids: panels[step].activeTab?.id
  };

  if (step === 'sources' || step === 'companies') {
    params.countries_ids = activeItemParams(countries);
  }

  if (step === 'commodities') {
    if (sources) {
      params.sources_ids = activeItemParams(sources);
    } else if (countries) {
      params.countries_ids = activeItemParams(countries);
    }
    if (companies) {
      params.companies_ids = activeItemParams(companies);
    }
  }

  return params;
};
