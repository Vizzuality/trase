import { select, all, fork, takeLatest, takeEvery, put, call } from 'redux-saga/effects';
import modules from 'react-components/nodes-panel/nodes-panel.modules';
import { setDashboardLoading } from 'react-components/dashboard-element/dashboard-element.actions';

import { updateIndicatorsOnItemChange } from 'react-components/dashboard-element/dashboard-element.saga';
import { getDashboardsContext } from 'react-components/dashboard-element/dashboard-element.selectors';
import { TOOL_LINKS__EXPAND_SANKEY } from 'react-components/tool-links/tool-links.actions';

import {
  syncNodesWithSankey,
  NODES_PANEL__GET_MISSING_DATA,
  NODES_PANEL__GET_SEARCH_RESULTS,
  NODES_PANEL__SET_TABS,
  NODES_PANEL__FETCH_DATA,
  NODES_PANEL__SET_ACTIVE_ITEMS_WITH_SEARCH,
  NODES_PANEL__SET_ACTIVE_TAB,
  NODES_PANEL__SET_PANEL_PAGE,
  NODES_PANEL__SET_ORDER_BY
} from './nodes-panel.actions';
import {
  getData,
  getSectionTabs,
  getMoreData,
  fetchSearchResults,
  getMissingItems
} from './nodes-panel.fetch.saga';

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
    const nodesPanel = yield select(state => state.nodesPanel);
    const selectedContext = yield select(getDashboardsContext);
    const tasks = [];

    if (selectedContext) {
      tasks.push(call(getData, 'countries', nodesPanel.countries));
      tasks.push(call(getData, 'commodities', nodesPanel.commodities));
    }

    const hasMissingData = Object.keys(modules)
      .filter(name => !['countries', 'commodities'].includes(name))
      .some(
        name =>
          nodesPanel[name].selectedNodesIds.length > 0 && nodesPanel.sources.data.byId.length === 0
      );

    if (selectedContext && hasMissingData) {
      tasks.push(call(getMissingItems, nodesPanel, selectedContext));
    }

    yield all(tasks);

    // TODO: Remove when we delete the legacy dashboards
    yield call(updateIndicatorsOnItemChange);
  }
  // TODO: Remove when we delete the legacy dashboards
  yield put(setDashboardLoading(false));

  yield takeLatest([NODES_PANEL__GET_MISSING_DATA], shouldFetchMissingItems);
}

function* syncSelectedNodes() {
  function* onExpandSankey() {
    const {
      selectedNodesIds,
      data: { nodes, columns }
    } = yield select(state => state.toolLinks);
    const nodesByRole = selectedNodesIds.reduce((acc, nodeId) => {
      const node = nodes[nodeId];
      const column = columns[node.columnId];
      const role = `${column.role}s`;
      if (!acc[role]) {
        acc[role] = [];
      }

      acc[role].push(node.id);
      return acc;
    }, {});

    yield put(syncNodesWithSankey(nodesByRole));
  }
  yield takeLatest([TOOL_LINKS__EXPAND_SANKEY], onExpandSankey);
}

export default function* nodesPanelSagas() {
  const sagas = [
    fetchData,
    fetchDataOnPageChange,
    fetchDataOnSearch,
    fetchDataOnTabsFetch,
    fetchDataOnTabChange,
    fetchMissingItems,
    syncSelectedNodes
  ];
  yield all(sagas.map(saga => fork(saga)));
}
