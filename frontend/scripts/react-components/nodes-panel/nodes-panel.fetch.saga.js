import deburr from 'lodash/deburr';
import { put, call, cancelled, select, fork } from 'redux-saga/effects';
import {
  getURLFromParams,
  GET_DASHBOARD_OPTIONS_URL,
  GET_DASHBOARD_OPTIONS_TABS_URL,
  GET_DASHBOARD_SEARCH_RESULTS_URL,
  GET_ALL_NODES_URL
} from 'utils/getURLFromParams';
import { fetchWithCancel, setLoadingSpinner } from 'utils/saga-utils';
import { DASHBOARD_STEPS } from 'constants';
import {
  setMoreData,
  setLoadingItems,
  setMissingItems,
  setSearchResults,
  setData,
  setTabs,
  setNoData
} from './nodes-panel.actions';
import { makeGetActiveTab } from './nodes-panel.selectors';

const getSourcesTab = makeGetActiveTab('sources');
const getExportersTab = makeGetActiveTab('exporters');
const getImportersTab = makeGetActiveTab('importers');

export function* getPanelParams(optionsType, options = {}) {
  const state = yield select();
  const { page, isOverview } = options;

  const sourcesTab = getSourcesTab(state);
  const exportersTab = getExportersTab(state);
  const importersTab = getImportersTab(state);
  const nodeTypesIds = {
    sources: sourcesTab || null,
    exporters: exportersTab || null,
    importers: importersTab || null
  }[optionsType];
  const activeItemParams = items => items.join() || undefined;
  const params = {
    page,
    options_type: optionsType,
    node_types_ids: nodeTypesIds
  };
  const currentStep = DASHBOARD_STEPS[optionsType];

  if (currentStep === DASHBOARD_STEPS.sources && optionsType !== 'countries') {
    params.countries_ids = state.nodesPanel.countries.selectedNodeId;
  }

  if (currentStep > DASHBOARD_STEPS.sources || isOverview) {
    params.countries_ids = state.nodesPanel.countries.selectedNodeId;
    params.sources_ids = activeItemParams(state.nodesPanel.sources.selectedNodesIds);
  }

  if (currentStep > DASHBOARD_STEPS.commodities || isOverview) {
    params.commodities_ids = state.nodesPanel.commodities.selectedNodeId;
  }

  if (currentStep > DASHBOARD_STEPS.destinations || isOverview) {
    params.destinations_ids = activeItemParams(state.nodesPanel.destinations.selectedNodesIds);
  }

  if (currentStep > DASHBOARD_STEPS.exporters || isOverview) {
    params.exporters_ids = activeItemParams(state.nodesPanel.exporters.selectedNodesIds);
  }
  return params;
}

export function* getData(name, reducer, options) {
  const { page } = reducer;

  const params = yield getPanelParams(name, {
    page,
    ...options
  });

  if (params.node_types_ids === null) {
    yield put(setNoData(true, name));
    return;
  }

  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
  const task = yield fork(setLoadingSpinner, 750, setLoadingItems(true, name));
  yield put(setData(null, name));
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    if (task.isRunning()) {
      task.cancel();
    }
    yield put(setData(data.data, name));
    yield put(setNoData(!data.data?.length, name));
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
    yield fork(setLoadingSpinner, 750, setLoadingItems(false, name));
  }
}

export function* getSectionTabs(name) {
  const params = yield getPanelParams(name);

  // eslint-disable-next-line
  const { node_types_ids, options_type, ...urlParams } = params;

  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_TABS_URL, urlParams);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put(setTabs(data.data, name));
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

export function* getMoreData(name, reducer) {
  const { page } = reducer;
  const params = yield getPanelParams(name, { page });
  if (params.node_types_ids === null) {
    return;
  }
  yield put(setLoadingItems(true, name));
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put(setMoreData(data.data, name));
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
    yield call(setLoadingSpinner, 150, setLoadingItems(false, name));
  }
}

export function* getMissingItems(name, reducer, selectedContext) {
  const nodesIds = reducer.selectedNodesIds;
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
    yield put(setMissingItems(data.data, name));
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

export function* fetchSearchResults(name, reducer, query) {
  if (!query) {
    yield put(setSearchResults(query, [], name));
    return;
  }
  // eslint-disable-next-line
  const { node_types_ids, ...filters } = yield getPanelParams(name);
  const params = {
    ...filters,
    q: deburr(query)
  };
  const url = getURLFromParams(GET_DASHBOARD_SEARCH_RESULTS_URL, params);

  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put(setSearchResults(query, data.data, name));
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
