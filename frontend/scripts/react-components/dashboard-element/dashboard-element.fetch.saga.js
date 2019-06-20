import deburr from 'lodash/deburr';
import pickBy from 'lodash/pickBy';
import { put, call, cancelled, select, fork } from 'redux-saga/effects';
import isEmpty from 'lodash/isEmpty';
import {
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
  setDashboardChartsLoading,
  getDashboardPanelParams,
  setDashboardPanelLoadingItems,
  DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__SET_CHARTS
} from 'react-components/dashboard-element/dashboard-element.actions';
import {
  getURLFromParams,
  GET_DASHBOARD_OPTIONS_URL,
  GET_DASHBOARD_OPTIONS_TABS_URL,
  GET_DASHBOARD_SEARCH_RESULTS_URL,
  GET_DASHBOARD_PARAMETRISED_CHARTS_URL
} from 'utils/getURLFromParams';
import { fetchWithCancel, setLoadingSpinner } from 'utils/saga-utils';

export function* getDashboardPanelData(dashboardElement, optionsType, options) {
  const { page, activeTab } = dashboardElement[`${dashboardElement.activePanelId}Panel`];
  const tab = activeTab && activeTab.id;
  const params = getDashboardPanelParams(dashboardElement, optionsType, {
    page,
    ...options
  });
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
  const task = yield fork(setLoadingSpinner, 750, {
    type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
    payload: {
      key: optionsType,
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
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: {
        key: optionsType,
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
      if (NODE_ENV_DEV) console.error('Cancelled', url);
      if (source) {
        source.cancel();
      }
    }
  }
}

export function* getMoreDashboardPanelData(dashboardElement, optionsType, activeTab, direction) {
  const { page } = dashboardElement[`${dashboardElement.activePanelId}Panel`];
  const params = getDashboardPanelParams(dashboardElement, optionsType, {
    page
  });
  const task = yield fork(setLoadingSpinner, 350, setDashboardPanelLoadingItems(true));
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
      payload: {
        key: optionsType,
        tab: activeTab && activeTab.id,
        direction,
        data: data.data
      }
    });
    if (task.isRunning()) {
      task.cancel();
    } else {
      yield call(setLoadingSpinner, 750, setDashboardPanelLoadingItems(false));
    }
  } catch (e) {
    console.error('Error', e);
    if (task.isRunning()) {
      task.cancel();
    } else {
      yield call(setLoadingSpinner, 750, setDashboardPanelLoadingItems(false));
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

export function* fetchDashboardPanelSearchResults(dashboardElement, query) {
  if (!query) return;
  let optionsType = dashboardElement.activePanelId;
  if (optionsType === 'sources' && isEmpty(dashboardElement.countriesPanel.activeItems)) {
    optionsType = 'countries';
  }
  // eslint-ignore-next-line
  const { node_types_ids: excluded, ...filters } = getDashboardPanelParams(
    dashboardElement,
    optionsType
  );
  const params = {
    ...filters,
    q: deburr(query)
  };
  const url = getURLFromParams(GET_DASHBOARD_SEARCH_RESULTS_URL, params);

  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
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

export function* fetchDashboardCharts() {
  const dashboardElement = yield select(state => state.dashboardElement);
  const {
    countries_ids: countryId,
    commodities_ids: commodityId,
    ...options
  } = getDashboardPanelParams(dashboardElement, null, { isOverview: true });
  const params = pickBy(
    {
      ...options,
      country_id: countryId,
      commodity_id: commodityId,
      cont_attribute_id: dashboardElement.selectedResizeBy,
      ncont_attribute_id: dashboardElement.selectedRecolorBy,
      start_year: dashboardElement.selectedYears[0],
      end_year: dashboardElement.selectedYears[1]
    },
    x => !!x
  );
  const url = getURLFromParams(GET_DASHBOARD_PARAMETRISED_CHARTS_URL, params);

  yield put(setDashboardChartsLoading(true));
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: DASHBOARD_ELEMENT__SET_CHARTS,
      payload: { charts: data.data }
    });
    yield call(setLoadingSpinner, 750, setDashboardChartsLoading(false));
  } catch (e) {
    console.error('Error', e);
    yield call(setLoadingSpinner, 750, setDashboardChartsLoading(false));
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) console.error('Cancelled', params);
      if (source) {
        source.cancel();
      }
    }
  }
}
