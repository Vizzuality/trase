import { select, all, fork, takeLatest, takeEvery } from 'redux-saga/effects';
import { createNodesPanelActions } from 'react-components/nodes-panel/nodes-panel.actions';
import { createNodesPanelFetchSaga } from 'react-components/nodes-panel/nodes-panel.fetch.saga';

export function createNodesPanelSaga(name, moduleOptions) {
  const {
    SET_SELECTED_ID,
    SET_MISSING_DATA,
    GET_SEARCH_RESULTS,
    SET_PANEL_TABS,
    FETCH_DATA,
    SET_ACTIVE_ITEMS_WITH_SEARCH,
    SET_ACTIVE_TAB,
    SET_PANEL_PAGE
  } = createNodesPanelActions(name);
  const { getData, getSectionTabs, getMoreData, fetchSearchResults } = createNodesPanelFetchSaga(
    name
  );

  function* fetchDataMissingItemDownload() {
    function* onMissingItemDownload() {
      yield fork(getSectionTabs, name);
    }

    yield takeLatest([SET_MISSING_DATA], onMissingItemDownload);
  }

  function* fetchData() {
    function* onFetchRequest() {
      const reducer = yield select(state => state.nodesPanel[name]);

      function* fetchPanelData() {
        if (reducer.data.byId.length > 0) {
          yield fork(getMoreData, reducer);
        } else {
          yield fork(getData, reducer);
        }
      }

      if (moduleOptions.hasTabs) {
        yield fork(getSectionTabs, name);
      }
      yield fork(fetchPanelData);
    }
    yield takeLatest([FETCH_DATA], onFetchRequest);
  }

  /**
   * Reads the query from the GET_SEARCH_RESULTS action
   * and calls fetchSearchResults to fetch the data.
   */
  function* getSearchResults(action) {
    const reducer = yield select(state => state.nodesPanel[name]);
    const { query } = action.payload;
    yield fork(fetchSearchResults, reducer, query);
  }

  function* fetchDataOnSearch() {
    yield takeLatest(GET_SEARCH_RESULTS, getSearchResults);
  }

  function* fetchDataOnTabsFetch() {
    function* onTabsFetch() {
      const reducer = yield select(state => state.nodesPanel[name]);

      if (reducer.data.byId.length === 0) {
        yield fork(getData, reducer);
      } else {
        yield fork(getMoreData, reducer);
      }
    }

    yield takeEvery([SET_PANEL_TABS], onTabsFetch);
  }
  /**
   * Fetches the data for the activeTab if the data hasn't been loaded.
   */
  function* onTabChange() {
    const reducer = yield select(state => state.nodesPanel[name]);

    if (reducer.data.byId.length > 0) {
      yield fork(getMoreData, reducer);
    }
  }

  function* fetchDataOnTabChange() {
    yield takeLatest([SET_ACTIVE_ITEMS_WITH_SEARCH, SET_ACTIVE_TAB], onTabChange);
  }

  /**
   * Listens to SET_SELECTED_COUNTRY_ID and requests the tabs data every time a new country has been selected.
   */
  function* onItemChange(action) {
    const { activeItem } = action.payload;
    // for now, we just need to recalculate the tabs when selecting a new country
    if (activeItem) {
      yield fork(getSectionTabs, name);
    }
  }

  function* fetchDataOnItemChange() {
    yield takeLatest([SET_SELECTED_ID], onItemChange);
  }

  /**
   * Listens to SET_PANEL_PAGE and fetches the data for the next page.
   */
  function* onPageChange() {
    const reducer = yield select(state => state.nodesPanel[name]);

    yield fork(getMoreData, reducer);
  }

  function* fetchDataOnPageChange() {
    yield takeLatest(SET_PANEL_PAGE, onPageChange);
  }

  return [
    fetchData,
    fetchDataOnTabsFetch,
    fetchDataOnTabChange,
    fetchDataOnItemChange,
    fetchDataOnPageChange,
    fetchDataOnSearch,
    fetchDataMissingItemDownload
  ];
}

export default function* nodesPanelSagas() {
  const sagas = [
    ...createNodesPanelSaga('countries'),
    ...createNodesPanelSaga('commodities'),
    ...createNodesPanelSaga('sourcing', { hasSearch: true, hasMultipleSelection: true }),
    ...createNodesPanelSaga('destinations', { hasSearch: true, hasMultipleSelection: true }),
    ...createNodesPanelSaga('importers', { hasSearch: true, hasMultipleSelection: true }),
    ...createNodesPanelSaga('exporters', { hasSearch: true, hasMultipleSelection: true })
  ];
  yield all(sagas.map(saga => fork(saga)));
}
