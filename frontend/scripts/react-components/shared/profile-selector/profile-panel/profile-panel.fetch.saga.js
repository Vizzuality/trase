import { put, call, cancelled, fork, select } from 'redux-saga/effects';
import { getPanelName } from 'utils/getProfilePanelName';
import {
  PROFILES__SET_PANEL_DATA,
  PROFILES__SET_PANEL_TABS,
  PROFILES__SET_MORE_PANEL_DATA,
  PROFILES__SET_SEARCH_RESULTS,
  setProfilesLoadingItems
} from 'react-components/shared/profile-selector/profile-selector.actions';
import {
  getURLFromParams,
  GET_DASHBOARD_OPTIONS_URL,
  GET_PROFILE_OPTIONS_TABS_URL,
  GET_DASHBOARD_SEARCH_RESULTS_URL
} from 'utils/getURLFromParams';
import { PROFILE_STEPS } from 'constants';
import { fetchWithCancel, setLoadingSpinner } from 'utils/saga-utils';
import isEmpty from 'lodash/isEmpty';
import deburr from 'lodash/deburr';
import {
  getSourcesActiveTab,
  getCompaniesActiveTab
} from 'react-components/shared/profile-selector/profile-selector.selectors';

function* getProfilesParams(step, options = {}) {
  const state = yield select();
  const {
    panels: { countries, sources, companies },
    data
  } = state.profileSelector;
  const { page } = options;
  const sourcesTab = getSourcesActiveTab(state);
  const companiesTab = getCompaniesActiveTab(state);
  const nodeTypesIds = {
    sources: sourcesTab,
    companies: companiesTab
  }[step];

  const activeItemParams = panel => panel.activeItems.join();
  const params = {
    page,
    options_type: step,
    node_types_ids: nodeTypesIds
  };

  if (step === 'sources' || step === 'companies') {
    params.countries_ids = countries.activeItems[0] || (data.countries[0] && data.countries[0].id);
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
}

export function* getProfilesData(panelName, activeTab = null) {
  const profileSelector = yield select(state => state.profileSelector);
  if (!profileSelector.activeStep || profileSelector.activeStep === PROFILE_STEPS.type) return;
  const { page } = profileSelector.panels[panelName];
  const params = yield getProfilesParams(panelName, { page });
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, { ...params, profile_only: true });
  const task = yield fork(setLoadingSpinner, 750, setProfilesLoadingItems(true, panelName));
  yield put({
    type: PROFILES__SET_PANEL_DATA,
    payload: {
      panelName,
      tab: activeTab,
      data: null
    }
  });
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    if (task.isRunning()) {
      task.cancel();
    }
    yield put({
      type: PROFILES__SET_PANEL_DATA,
      payload: {
        panelName,
        tab: activeTab,
        data: data.data
      }
    });
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) {
        console.error('Cancelled', activeTab);
      }
      if (source) {
        source.cancel();
      }
    }
    yield fork(setLoadingSpinner, 750, setProfilesLoadingItems(false, panelName));
  }
}

export function* getMoreProfilesData(profileSelector, panelName, activeTab = null) {
  const { page } = profileSelector.panels[panelName];
  const params = yield getProfilesParams(panelName, { page });
  yield put(setProfilesLoadingItems(true, panelName));
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, { ...params, profile_only: true });
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: PROFILES__SET_MORE_PANEL_DATA,
      payload: {
        key: panelName,
        tab: activeTab,
        data: data.data
      }
    });
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) {
        console.error('Cancelled', url);
      }
      if (source) {
        source.cancel();
      }
    }
    yield call(setLoadingSpinner, 150, setProfilesLoadingItems(false, panelName));
  }
}

export function* getProfilesTabs(optionsType) {
  const params = yield getProfilesParams(optionsType);
  const url = getURLFromParams(GET_PROFILE_OPTIONS_TABS_URL, { ...params });
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    const filteredData = data.data.map(section => ({
      ...section,
      tabs: section.tabs.filter(t => t.profile_type)
    }));
    yield put({
      type: PROFILES__SET_PANEL_TABS,
      payload: {
        key: optionsType,
        data: filteredData
      }
    });
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (source) {
        if (NODE_ENV_DEV) {
          console.error('Cancelled', url);
        }
        source.cancel();
      }
    }
  }
}

export function* fetchProfileSearchResults(profileSelector, query) {
  if (!query) return;
  let panelName = getPanelName(profileSelector);
  if (panelName === 'sources' && isEmpty(profileSelector.panels.countries.activeItems)) {
    panelName = 'countries';
  }
  // eslint-ignore-next-line
  const { node_types_ids: excluded, ...filters } = yield getProfilesParams(panelName);
  const params = {
    ...filters,
    q: deburr(query)
  };
  const url = getURLFromParams(GET_DASHBOARD_SEARCH_RESULTS_URL, { ...params, profile_only: true });

  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: PROFILES__SET_SEARCH_RESULTS,
      payload: {
        query,
        data: data.data
      }
    });
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) {
        console.error('Cancelled', url);
      }
      if (source) {
        source.cancel();
      }
    }
  }
}
