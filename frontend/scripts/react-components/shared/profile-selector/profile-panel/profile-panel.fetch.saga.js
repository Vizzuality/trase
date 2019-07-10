import { put, call, cancelled, fork, select } from 'redux-saga/effects';
import { getPanelName } from 'utils/getProfilePanelName';
import {
  PROFILES__SET_PANEL_DATA,
  PROFILES__SET_PANEL_TABS,
  PROFILES__SET_MORE_PANEL_DATA,
  PROFILES__SET_SEARCH_RESULTS,
  getProfilesParams,
  setProfilesLoadingItems
} from 'react-components/shared/profile-selector/profile-selector.actions';
import {
  getURLFromParams,
  GET_DASHBOARD_OPTIONS_URL,
  GET_DASHBOARD_OPTIONS_TABS_URL,
  GET_DASHBOARD_SEARCH_RESULTS_URL
} from 'utils/getURLFromParams';
import { PROFILE_STEPS } from 'constants';
import { fetchWithCancel, setLoadingSpinner } from 'utils/saga-utils';
import isEmpty from 'lodash/isEmpty';
import deburr from 'lodash/deburr';

export function* getProfilesData(panelName) {
  const profileSelector = yield select(state => state.profileSelector);
  if (!profileSelector.activeStep || profileSelector.activeStep === PROFILE_STEPS.types) return;
  const { page, activeTab } = profileSelector.panels[panelName];
  const tab = activeTab?.id;
  const params = getProfilesParams(profileSelector, panelName, { page });
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
  const task = yield fork(setLoadingSpinner, 750, {
    type: PROFILES__SET_PANEL_DATA,
    payload: {
      panelName,
      tab,
      data: null,
      meta: null,
      loading: true
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
        tab,
        data: data.data,
        meta: data.meta,
        loading: false
      }
    });
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) console.error('Cancelled', tab);
      if (source) {
        source.cancel();
      }
    }
  }
}

export function* getMoreProfilesData(profileSelector, panelName, activeTab, direction) {
  const { page } = profileSelector.panels[panelName];
  const params = getProfilesParams(profileSelector, panelName, { page });
  const task = yield fork(setLoadingSpinner, 350, setProfilesLoadingItems(true));
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: PROFILES__SET_MORE_PANEL_DATA,
      payload: {
        key: panelName,
        tab: activeTab && activeTab.id,
        direction,
        data: data.data
      }
    });
    if (task.isRunning()) {
      task.cancel();
    } else {
      yield call(setLoadingSpinner, 750, setProfilesLoadingItems(false));
    }
  } catch (e) {
    console.error('Error', e);
    if (task.isRunning()) {
      task.cancel();
    } else {
      yield call(setLoadingSpinner, 750, setProfilesLoadingItems(false));
    }
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) console.error('Cancelled', url);
      if (source) {
        source.cancel();
      }
    }
  }
}

export function* getProfilesTabs(optionsType) {
  const profileSelector = yield select(state => state.profileSelector);
  const params = getProfilesParams(profileSelector, optionsType);
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_TABS_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    const filteredData = data.data.map(section => ({
      ...section,
      tabs: section.tabs.filter(t => t.profileType)
    }));
    yield put({
      type: PROFILES__SET_PANEL_TABS,
      payload: {
        data: filteredData
      }
    });
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (source) {
        if (NODE_ENV_DEV) console.error('Cancelled', url);
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
  const { node_types_ids: excluded, ...filters } = getProfilesParams(profileSelector, panelName);
  const params = {
    ...filters,
    q: deburr(query)
  };
  const url = getURLFromParams(GET_DASHBOARD_SEARCH_RESULTS_URL, params);

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
      if (NODE_ENV_DEV) console.error('Cancelled', url);
      if (source) {
        source.cancel();
      }
    }
  }
}
