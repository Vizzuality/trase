import { put, call, cancelled, delay } from 'redux-saga/effects';
import {
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
  getDashboardPanelParams,
  setDashboardPanelLoadingItems,
  DASHBOARD_ELEMENT__SET_SEARCH_RESULTS
} from 'react-components/dashboard-element/dashboard-element.actions';
import {
  getURLFromParams,
  GET_DASHBOARD_OPTIONS_URL,
  GET_DASHBOARD_OPTIONS_TABS_URL,
  GET_DASHBOARD_SEARCH_RESULTS_URL
} from 'utils/getURLFromParams';
import { isDevelopment } from 'utils/environment';
import { fetchWithCancel } from './fetch-with-cancel';

export function* getDashboardPanelData(dashboardElement, optionsType, options) {
  const { page, activeTab } = dashboardElement[`${dashboardElement.activePanelId}Panel`];
  const tab = activeTab && activeTab.id;
  const params = getDashboardPanelParams(dashboardElement, optionsType, {
    page,
    ...options
  });
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
  const key = optionsType !== 'attributes' ? optionsType : 'indicators'; // FIXME
  yield put({
    type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
    payload: {
      key,
      tab,
      data: null,
      meta: null,
      loading: true
    }
  });
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: {
        key,
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
      if (isDevelopment) console.error('Cancelled', tab);
      if (source) {
        source.cancel();
      }
    }
  }
}

export function* getDashboardPanelSectionTabs(dashboardElement, optionsType) {
  const params = getDashboardPanelParams(dashboardElement, optionsType);
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_TABS_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: DASHBOARD_ELEMENT__SET_PANEL_TABS,
      payload: {
        data: data.data
      }
    });
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (isDevelopment) console.error('Cancelled', url);
      if (source) {
        source.cancel();
      }
    }
  }
}

function* removeLoadingSpinner() {
  yield delay(1000);
  yield put(setDashboardPanelLoadingItems(false));
}

export function* getMoreDashboardPanelData(dashboardElement, optionsType, activeTab, direction) {
  const { page } = dashboardElement[`${dashboardElement.activePanelId}Panel`];
  const params = getDashboardPanelParams(dashboardElement, optionsType, {
    page
  });
  yield put(setDashboardPanelLoadingItems(true));
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
  const key = optionsType !== 'attributes' ? optionsType : 'indicators'; // FIXME
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
      payload: {
        key,
        tab: activeTab && activeTab.id,
        direction,
        data: data.data
      }
    });
    yield call(removeLoadingSpinner);
  } catch (e) {
    console.error('Error', e);
    yield call(removeLoadingSpinner);
  } finally {
    if (yield cancelled()) {
      if (isDevelopment) console.error('Cancelled', url);
      if (source) {
        source.cancel();
      }
      yield call(removeLoadingSpinner);
    }
  }
}

export function* fetchDashboardPanelSearchResults(dashboardElement, query) {
  if (!query) return;
  let optionsType = dashboardElement.activePanelId;
  if (
    optionsType === 'sources' &&
    dashboardElement.sourcesPanel.activeItem === null &&
    dashboardElement.sourcesPanel.activeTab === null
  ) {
    optionsType = 'countries';
  }
  const filters = {
    ...getDashboardPanelParams(dashboardElement, optionsType),
    node_types_ids: undefined
  };
  const params = {
    ...filters,
    q: query
  };
  const url = getURLFromParams(GET_DASHBOARD_SEARCH_RESULTS_URL, params);

  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
      payload: {
        data: data.data
      }
    });
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (isDevelopment) console.error('Cancelled', url);
      if (source) {
        source.cancel();
      }
    }
  }
}
