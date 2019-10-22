import deburr from 'lodash/deburr';
import pickBy from 'lodash/pickBy';
import { put, call, cancelled, select, fork } from 'redux-saga/effects';
import {
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  setDashboardLoading,
  setMoreDashboardPanelData,
  setMissingDashboardPanelItems,
  setDashboardPanelLoadingItems,
  DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__SET_CHARTS
} from 'react-components/dashboard-element-legacy/dashboard-element.actions';
import {
  getCountriesActiveItems,
  getSourcesActiveItems,
  getDestinationsActiveItems,
  getCompaniesActiveItems,
  getSourcesActiveTab,
  getCompaniesActiveTab,
  getDashboardSelectedYears,
  getDashboardSelectedResizeBy,
  getDashboardSelectedRecolorBy
} from 'react-components/dashboard-element-legacy/dashboard-element.selectors';
import {
  getURLFromParams,
  GET_DASHBOARD_OPTIONS_URL,
  GET_DASHBOARD_OPTIONS_TABS_URL,
  GET_DASHBOARD_SEARCH_RESULTS_URL,
  GET_DASHBOARD_PARAMETRISED_CHARTS_URL,
  GET_ALL_NODES_URL
} from 'utils/getURLFromParams';
import { fetchWithCancel, setLoadingSpinner } from 'utils/saga-utils';
import { DASHBOARD_STEPS } from 'constants';

function* getDashboardPanelParams(optionsType, options = {}) {
  const state = yield select();
  const { page, isOverview } = options;

  const sourcesActiveItems = yield select(getSourcesActiveItems);
  const destinationsActiveItems = yield select(getDestinationsActiveItems);
  const companiesActiveItems = yield select(getCompaniesActiveItems);

  const sourcesTab = getSourcesActiveTab(state);
  const companiesTab = getCompaniesActiveTab(state);
  const nodeTypesIds = {
    sources: sourcesTab || null,
    companies: companiesTab || null
  }[optionsType];
  const activeItemParams = items => items.map(i => i.id).join() || undefined;
  const params = {
    page,
    options_type: optionsType,
    node_types_ids: nodeTypesIds
  };
  const currentStep = DASHBOARD_STEPS[optionsType];
  if (currentStep === DASHBOARD_STEPS.sources) {
    params.countries_ids = state.dashboardElement.selectedCountryId;
  }

  if (currentStep > DASHBOARD_STEPS.sources || isOverview) {
    params.countries_ids = state.dashboardElement.selectedCountryId;
    params.sources_ids = activeItemParams(sourcesActiveItems);
  }

  if (currentStep > DASHBOARD_STEPS.commodities || isOverview) {
    params.commodities_ids = state.dashboardElement.selectedCommodityId;
  }

  if (currentStep > DASHBOARD_STEPS.destinations || isOverview) {
    params.destinations_ids = activeItemParams(destinationsActiveItems);
  }

  if (currentStep > DASHBOARD_STEPS.companies || isOverview) {
    params.companies_ids = activeItemParams(companiesActiveItems);
  }
  return params;
}

export function* getDashboardPanelData(dashboardElement, optionsType, options) {
  const page = dashboardElement.pages[optionsType];

  const params = yield getDashboardPanelParams(optionsType, {
    page,
    ...options
  });
  if (params.node_types_ids === null) {
    return;
  }
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
  const task = yield fork(setLoadingSpinner, 750, setDashboardPanelLoadingItems(true));
  yield put({
    type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
    payload: {
      key: optionsType,
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
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: {
        key: optionsType,
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
    yield fork(setLoadingSpinner, 750, setDashboardPanelLoadingItems(false));
  }
}

export function* getDashboardPanelSectionTabs(optionsType) {
  const params = yield getDashboardPanelParams(optionsType);

  // eslint-disable-next-line
  const { node_types_ids, options_type, ...urlParams } = params;
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_TABS_URL, urlParams);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: DASHBOARD_ELEMENT__SET_PANEL_TABS,
      payload: {
        data: data.data,
        key: optionsType
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

export function* getMoreDashboardPanelData(dashboardElement, optionsType) {
  const page = dashboardElement.pages[optionsType];
  const params = yield getDashboardPanelParams(optionsType, { page });
  if (params.node_types_ids === null) {
    return;
  }
  yield put(setDashboardPanelLoadingItems(true));
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put(
      setMoreDashboardPanelData({
        data: data.data,
        key: optionsType
      })
    );
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
    yield call(setLoadingSpinner, 150, setDashboardPanelLoadingItems(false));
  }
}

export function* getMissingDashboardPanelItems(dashboardElement, selectedContext) {
  const nodesIds = [
    ...dashboardElement.sources,
    ...dashboardElement.destinations,
    ...dashboardElement.companies
  ];
  const params = {
    context_id: selectedContext.id,
    nodes_ids: nodesIds.join(',')
  };
  if (nodesIds.length === 0) {
    return;
  }
  const url = getURLFromParams(GET_ALL_NODES_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put(setMissingDashboardPanelItems(data.data));
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) {
        console.error('Cancelled');
      }
      if (source) {
        source.cancel();
      }
    }
  }
}

export function* fetchDashboardPanelSearchResults(dashboardElement, query) {
  if (!query) return;
  const countriesActiveItems = yield select(getCountriesActiveItems);
  let optionsType = dashboardElement.activePanelId;
  if (optionsType === 'sources' && countriesActiveItems.length === 0) {
    optionsType = 'countries';
  }
  // eslint-disable-next-line
  const { node_types_ids, ...filters } = yield getDashboardPanelParams(optionsType);
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
      if (NODE_ENV_DEV) {
        console.error('Cancelled', url);
      }
      if (source) {
        source.cancel();
      }
    }
  }
}

export function* fetchDashboardCharts() {
  const selectedResizeBy = yield select(getDashboardSelectedResizeBy);
  const selectedRecolorBy = yield select(getDashboardSelectedRecolorBy);
  const selectedYears = yield select(getDashboardSelectedYears);
  const {
    countries_ids: countryId,
    commodities_ids: commodityId,
    ...options
  } = yield getDashboardPanelParams(null, { isOverview: true });
  const params = pickBy(
    {
      ...options,
      country_id: countryId,
      commodity_id: commodityId,
      cont_attribute_id: selectedResizeBy?.attributeId,
      ncont_attribute_id: selectedRecolorBy?.attributeId,
      start_year: selectedYears[0],
      end_year: selectedYears[1]
    },
    x => !!x
  );

  if (!params.commodity_id || !params.country_id || !params.start_year || !params.end_year) {
    return;
  }
  const url = getURLFromParams(GET_DASHBOARD_PARAMETRISED_CHARTS_URL, params);

  yield put(setDashboardLoading(true));
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: DASHBOARD_ELEMENT__SET_CHARTS,
      payload: { charts: data }
    });
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) {
        console.error('Cancelled', params);
      }
      if (source) {
        source.cancel();
      }
    }
    yield call(setLoadingSpinner, 750, setDashboardLoading(false));
  }
}
