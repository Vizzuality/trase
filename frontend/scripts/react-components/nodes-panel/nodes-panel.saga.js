import { select, all, fork, takeLatest, takeEvery } from 'redux-saga/effects';
import {
  NODES_PANEL__GET_SEARCH_RESULTS,
  NODES_PANEL__SET_TABS,
  NODES_PANEL__FETCH_DATA,
  NODES_PANEL__SET_ACTIVE_ITEMS_WITH_SEARCH,
  NODES_PANEL__SET_ACTIVE_TAB,
  NODES_PANEL__SET_PANEL_PAGE
} from './nodes-panel.actions';
import { getData, getSectionTabs, getMoreData, fetchSearchResults } from './nodes-panel.fetch.saga';
import modules from './nodes-panel.modules';

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
  yield takeLatest([NODES_PANEL__FETCH_DATA], onFetchRequest);
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

export default function* nodesPanelSagas() {
  const sagas = [
    fetchData,
    fetchDataOnPageChange,
    fetchDataOnSearch,
    fetchDataOnTabsFetch,
    fetchDataOnTabChange
  ];
  yield all(sagas.map(saga => fork(saga)));
}
