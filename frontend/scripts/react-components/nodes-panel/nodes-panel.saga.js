import { select, all, fork, takeLatest, takeEvery, put, call } from 'redux-saga/effects';
import {
  setFetchKey,
  NODES_PANEL__GET_MISSING_DATA,
  NODES_PANEL__GET_SEARCH_RESULTS,
  NODES_PANEL__SET_TABS,
  NODES_PANEL__FETCH_DATA,
  NODES_PANEL__SET_ACTIVE_ITEMS_WITH_SEARCH,
  NODES_PANEL__SET_ACTIVE_TAB,
  NODES_PANEL__SET_PANEL_PAGE,
  NODES_PANEL__SET_ORDER_BY
} from './nodes-panel.actions';

import modules from 'react-components/nodes-panel/nodes-panel.modules';
import {
  getSourcesPreviousSteps,
  getExportersPreviousSteps,
  getImportersPreviousSteps
} from 'react-components/nodes-panel/nodes-panel.selectors';

import { setDashboardLoading } from 'react-components/dashboard-element/dashboard-element.actions';
import { updateIndicatorsOnItemChange } from 'react-components/dashboard-element/dashboard-element.saga';

import {
  getData,
  getSectionTabs,
  getMoreData,
  fetchSearchResults,
  getMissingItems
} from './nodes-panel.fetch.saga';
import { getDashboardsContext } from 'react-components/dashboard-element/dashboard-element.selectors';

function* fetchData() {
  function* onFetchRequest(action) {
    const { name } = action.meta;
    const moduleOptions = modules[name];
    const reducer = yield select(state => state.nodesPanel[name]);

    if (moduleOptions.hasTabs) {
      yield fork(getSectionTabs, name);
    } else if (reducer.data.byId.length === 0) {
      yield fork(getData, name, reducer);
    } else {
      yield fork(getMoreData, name, reducer);
    }
  }
  yield takeLatest([NODES_PANEL__FETCH_DATA, NODES_PANEL__SET_ORDER_BY], onFetchRequest);
}

/**
 * Reads the query from the GET_SEARCH_RESULTS action
 * and calls fetchSearchResults to fetch the data.
 */
function* getSearchResults(action) {
  const { name } = action.meta;
  const moduleOptions = modules[name];
  if (moduleOptions.hasSearch) {
    const reducer = yield select(state => state.nodesPanel[name]);
    const { query } = action.payload;
    yield fork(fetchSearchResults, name, reducer, query);
  }
}

function* fetchDataOnSearch() {
  yield takeLatest(NODES_PANEL__GET_SEARCH_RESULTS, getSearchResults);
}

function* fetchDataOnTabsFetch() {
  function* onTabsFetch(action) {
    const { name } = action.meta;
    const moduleOptions = modules[name];
    if (moduleOptions.hasTabs) {
      const reducer = yield select(state => state.nodesPanel[name]);

      if (reducer.data.byId.length === 0) {
        yield fork(getData, name, reducer);
      } else {
        yield fork(getMoreData, name, reducer);
      }
    }
  }

  yield takeEvery([NODES_PANEL__SET_TABS], onTabsFetch);
}
/**
 * Fetches the data for the activeTab if the data hasn't been loaded.
 */
function* onTabChange(action) {
  const { name } = action.meta;
  const moduleOptions = modules[name];
  if (moduleOptions.hasTabs) {
    const reducer = yield select(state => state.nodesPanel[name]);

    if (reducer.data.byId.length > 0) {
      yield fork(getMoreData, name, reducer);
    }
  }
}

function* fetchDataOnTabChange() {
  yield takeLatest(
    [NODES_PANEL__SET_ACTIVE_ITEMS_WITH_SEARCH, NODES_PANEL__SET_ACTIVE_TAB],
    onTabChange
  );
}

/**
 * Listens to SET_PANEL_PAGE and fetches the data for the next page.
 */
function* onPageChange(action) {
  const { name } = action.meta;
  const reducer = yield select(state => state.nodesPanel[name]);

  yield fork(getMoreData, name, reducer);
}

function* fetchDataOnPageChange() {
  yield takeLatest(NODES_PANEL__SET_PANEL_PAGE, onPageChange);
}

export function* fetchMissingItems() {
  function* shouldFetchMissingItems() {
    function* getMissingData(name) {
      const previousStepSelector = {
        sources: getSourcesPreviousSteps,
        exporters: getExportersPreviousSteps,
        importers: getImportersPreviousSteps
      };

      // we want to avoid double fetching caused by fetching the tabs,
      // so we set a proper fetch key for panels with tabs
      let previousStep = 'preloaded';

      if (previousStepSelector[name]) {
        previousStep = yield select(previousStepSelector[name]);
      }

      yield put(setFetchKey(previousStep, name));
      yield call(getSectionTabs, name);
    }

    const nodesPanel = yield select(state => state.nodesPanel);
    const selectedContext = yield select(getDashboardsContext);
    const tasks = [];
    if (nodesPanel.countries.selectedNodeId) {
      yield put(setFetchKey(true, 'countries'));
      tasks.push(call(getData, 'countries', nodesPanel.countries));
    }

    if (nodesPanel.commodities.selectedNodeId) {
      yield put(setFetchKey('preloaded', 'commodities'));
      tasks.push(call(getData, 'commodities', nodesPanel.commodities));
    }

    const hasMissingData = name =>
      nodesPanel[name].draftSelectedNodesIds.length > 0 &&
      nodesPanel.sources.data.byId.length === 0;
    if (
      selectedContext &&
      Object.keys(modules)
        .filter(name => !['countries', 'commodities'].includes(name))
        .some(name => hasMissingData(name))
    ) {
      tasks.push(call(getMissingItems, nodesPanel, selectedContext));
    }

    yield all(tasks);

    if (tasks.length > 0 && selectedContext) {
      const subtasks = [];
      Object.keys(modules)
        .filter(name => !['countries', 'commodities'].includes(name))
        .forEach(name => {
          if (hasMissingData(name)) {
            subtasks.push(call(getMissingData, name));
          }
        });
      yield all(subtasks);
      // TODO: Remove when we delete the legacy dashboards
      yield call(updateIndicatorsOnItemChange);
    }
    // TODO: Remove when we delete the legacy dashboards
    yield put(setDashboardLoading(false));
  }

  yield takeLatest([NODES_PANEL__GET_MISSING_DATA], shouldFetchMissingItems);
}

export default function* nodesPanelSagas() {
  const sagas = [
    fetchData,
    fetchDataOnPageChange,
    fetchDataOnSearch,
    fetchDataOnTabsFetch,
    fetchDataOnTabChange,
    fetchMissingItems
  ];
  yield all(sagas.map(saga => fork(saga)));
}
