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
import { createNodesPanelActions } from 'react-components/nodes-panel/nodes-panel.actions';
import { createNodesPanelSelectors } from 'react-components/nodes-panel/nodes-panel.selectors';

const sourcesSelector = createNodesPanelSelectors('sources', { hasTabs: true });
const exportersSelector = createNodesPanelSelectors('sources', { hasTabs: true });
const importersSelector = createNodesPanelSelectors('sources', { hasTabs: true });

export function* getPanelParams(optionsType, options = {}) {
  const state = yield select();
  const { page, isOverview } = options;

  const { activeTab: sourcesTab } = sourcesSelector(state);
  const { activeTab: exportersTab } = exportersSelector(state);
  const { activeTab: importersTab } = importersSelector(state);
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

  if (currentStep === DASHBOARD_STEPS.sources) {
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

export function createNodesPanelFetchSaga(name, moduleOptions = {}) {
  const {
    SET_TABS,
    SET_DATA,
    SET_SEARCH_RESULTS,
    setMoreData,
    setLoadingItems,
    setMissingItems
  } = createNodesPanelActions(name, moduleOptions);

  function* getData(reducer, options) {
    const { page } = reducer;

    const params = yield getPanelParams(name, {
      page,
      ...options
    });

    if (params.node_types_ids === null) {
      return;
    }
    const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
    const task = yield fork(setLoadingSpinner, 750, setLoadingItems(true));
    yield put({
      type: SET_DATA,
      payload: {
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
        type: SET_DATA,
        payload: {
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
      yield fork(setLoadingSpinner, 750, setLoadingItems(false));
    }
  }

  function* getSectionTabs() {
    const params = yield getPanelParams(name);

    // eslint-disable-next-line
    const { node_types_ids, options_type, ...urlParams } = params;
    console.log(urlParams);
    const url = getURLFromParams(GET_DASHBOARD_OPTIONS_TABS_URL, urlParams);
    const { source, fetchPromise } = fetchWithCancel(url);
    try {
      const { data } = yield call(fetchPromise);
      yield put({
        type: SET_TABS,
        payload: {
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

  function* getMoreData(reducer) {
    const { page } = reducer;
    const params = yield getPanelParams(name, { page });
    if (params.node_types_ids === null) {
      return;
    }
    yield put(setLoadingItems(true));
    const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
    const { source, fetchPromise } = fetchWithCancel(url);
    try {
      const { data } = yield call(fetchPromise);
      yield put(
        setMoreData({
          data: data.data
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
      yield call(setLoadingSpinner, 150, setLoadingItems(false));
    }
  }

  function* getMissingItems(reducer, selectedContext) {
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
      yield put(setMissingItems(data.data));
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

  function* fetchSearchResults(reducer, query) {
    if (!query) return;
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
      yield put({
        type: SET_SEARCH_RESULTS,
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

  const sagas = {
    getData,
    getMoreData,
    getMissingItems
  };

  if (moduleOptions.hasSearch) {
    sagas.fetchSearchResults = fetchSearchResults;
  }

  if (moduleOptions.hasTabs) {
    sagas.getSectionTabs = getSectionTabs;
  }

  return sagas;
}
