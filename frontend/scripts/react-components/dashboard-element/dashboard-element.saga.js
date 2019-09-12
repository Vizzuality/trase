import {
  take,
  select,
  all,
  fork,
  takeLatest,
  cancel,
  put,
  call,
  takeEvery
} from 'redux-saga/effects';
import {
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
  DASHBOARD_ELEMENT__SET_SELECTED_COUNTRY_ID,
  DASHBOARD_ELEMENT__SET_SELECTED_COMMODITY_ID,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS,
  DASHBOARD_ELEMENT__SET_PANEL_PAGE,
  DASHBOARD_ELEMENT__GET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH,
  DASHBOARD_ELEMENT__CLEAR_PANELS,
  DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
  DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY,
  DASHBOARD_ELEMENT__SET_MISSING_DATA,
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__GET_MISSING_DATA,
  setDashboardLoading
} from 'react-components/dashboard-element/dashboard-element.actions';
import {
  getMissingDashboardPanelItems,
  getDashboardPanelSectionTabs,
  getDashboardPanelData,
  getMoreDashboardPanelData,
  fetchDashboardPanelSearchResults,
  fetchDashboardCharts
} from 'react-components/dashboard-element/dashboard-element.fetch.saga';
import {
  getCountriesActiveItems,
  getSourcesActiveItems,
  getCommoditiesActiveItems,
  getDestinationsActiveItems,
  getCompaniesActiveItems,
  getDashboardsContext
} from 'react-components/dashboard-element/dashboard-element.selectors';

function* updateIndicatorsOnItemChange() {
  const selectedContext = yield select(getDashboardsContext);
  if (selectedContext) {
    yield fork(fetchDashboardCharts);
  }
}

function* fetchChartsOnItemChange() {
  yield takeLatest(
    [
      DASHBOARD_ELEMENT__CLEAR_PANEL,
      DASHBOARD_ELEMENT__CLEAR_PANELS,
      DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS,
      DASHBOARD_ELEMENT__SET_SELECTED_COUNTRY_ID,
      DASHBOARD_ELEMENT__SET_SELECTED_COMMODITY_ID,
      DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH
    ],
    updateIndicatorsOnItemChange
  );
}

export function* fetchMissingDashboardPanelItems() {
  function* fetchMissingItems() {
    const dashboardElement = yield select(state => state.dashboardElement);
    const selectedContext = yield select(getDashboardsContext);

    const tasks = [];
    if (dashboardElement.selectedCountryId) {
      tasks.push(call(getDashboardPanelData, dashboardElement, 'countries'));
      if (!selectedContext) {
        tasks.push(call(getDashboardPanelSectionTabs, 'sources'));
      }
    }

    if (dashboardElement.selectedCommodityId) {
      tasks.push(call(getDashboardPanelData, dashboardElement, 'commodities'));
    }

    if (
      selectedContext &&
      ((dashboardElement.data.sources.length === 0 && dashboardElement.sources.length > 0) ||
        (dashboardElement.data.destinations.length === 0 &&
          dashboardElement.destinations.length > 0) ||
        (dashboardElement.data.companies.length === 0 && dashboardElement.companies.length > 0))
    ) {
      tasks.push(call(getMissingDashboardPanelItems, dashboardElement, selectedContext));
    }

    yield all(tasks);

    if (tasks.length > 0 && selectedContext) {
      yield call(updateIndicatorsOnItemChange);
    }
    yield put(setDashboardLoading(false));
  }

  yield takeLatest([DASHBOARD_ELEMENT__GET_MISSING_DATA], fetchMissingItems);
}

export function* onMissingItemDownload() {
  yield fork(getDashboardPanelSectionTabs, 'sources');
  yield fork(getDashboardPanelSectionTabs, 'companies');
}

function* fetchDataMissingItemDownload() {
  yield takeLatest([DASHBOARD_ELEMENT__SET_MISSING_DATA], onMissingItemDownload);
}

/**
 * Should receive the DASHBOARD_ELEMENT__SET_ACTIVE_PANEL action and depending on which panel it is on fetch the necessary data.
 * - Sources panel => Load countries data
 *                 => If a country is selected, load the next level's data
 *
 * - Companies panel => Load the companies available tabs
 * - Commodities/Destinations panel => Load data
 */
export function* fetchDashboardPanelInitialData(action) {
  const { activePanelId } = action.payload;
  const state = yield select();
  const { dashboardElement } = state;
  const countriesActiveItems = yield select(getCountriesActiveItems);
  const sourcesActiveItems = yield select(getSourcesActiveItems);
  const companiesActiveItems = yield select(getCompaniesActiveItems);

  function* fetchTabPanelData() {
    if (
      (activePanelId === 'companies' && companiesActiveItems.length > 0) ||
      (activePanelId === 'sources' && sourcesActiveItems.length > 0)
    ) {
      yield fork(getMoreDashboardPanelData, dashboardElement, activePanelId);
    } else {
      yield fork(getDashboardPanelData, dashboardElement, activePanelId);
    }
  }

  if (dashboardElement.activePanelId === 'companies') {
    yield fork(getDashboardPanelSectionTabs, activePanelId);
    yield fork(fetchTabPanelData);
  } else if (activePanelId === 'sources') {
    const countriesSaga =
      countriesActiveItems.length > 0 ? getMoreDashboardPanelData : getDashboardPanelData;
    yield fork(countriesSaga, dashboardElement, 'countries');
    // Fetch regions
    if (countriesActiveItems.length > 0) {
      yield fork(fetchTabPanelData);
    }
  } else {
    yield fork(getDashboardPanelData, dashboardElement, activePanelId);
  }
}

/**
 * Checks if the activeItem in one of the panels has changed, if it has changed it fetches the panel data.
 */
export function* fetchDataOnPanelChange() {
  const panelsOrder = ['sources', 'commodities', 'destinations', 'companies'];
  let loaded = [];
  let previousPanelStateItems = null;
  let task = null;
  const hasChangedAt = panel => {
    if (!previousPanelStateItems) return -1;
    return [
      panel.countries !== previousPanelStateItems.countries ||
        panel.sources !== previousPanelStateItems.sources,
      panel.commodities !== previousPanelStateItems.commodities,
      panel.destinations !== previousPanelStateItems.destinations,
      panel.companies !== previousPanelStateItems.companies
    ].findIndex(value => value === true);
  };

  while (true) {
    const activePanel = yield take(DASHBOARD_ELEMENT__SET_ACTIVE_PANEL);
    const { activePanelId } = activePanel.payload;

    const newPanelState = yield select(state => state.dashboardElement);

    const countriesActiveItems = yield select(getCountriesActiveItems);
    const sourcesActiveItems = yield select(getSourcesActiveItems);
    const commoditiesActiveItems = yield select(getCommoditiesActiveItems);
    const destinationsActiveItems = yield select(getDestinationsActiveItems);
    const companiesActiveItems = yield select(getCompaniesActiveItems);

    const itemsByPanel = {
      countries: countriesActiveItems,
      sources: sourcesActiveItems,
      commodities: commoditiesActiveItems,
      destinations: destinationsActiveItems,
      companies: companiesActiveItems
    };

    const changedAt = hasChangedAt(itemsByPanel);
    if (changedAt !== -1) {
      loaded = panelsOrder.slice(0, changedAt + 1);
    }

    const newPanelData = newPanelState.data[activePanelId];
    const isEmpty = Array.isArray(newPanelState)
      ? newPanelData.length === 0
      : Object.keys(newPanelData).length === 0;

    if (!previousPanelStateItems || !loaded.includes(activePanelId) || isEmpty) {
      if (task !== null) {
        yield cancel(task);
      }
      task = yield fork(fetchDashboardPanelInitialData, activePanel);
      if (!loaded.includes(activePanelId)) {
        loaded.push(activePanelId);
      }
    }
    previousPanelStateItems = itemsByPanel;
  }
}

/**
 * Reads the query from the DASHBOARD_ELEMENT__GET_SEARCH_RESULTS action
 * and calls fetchDashboardPanelSearchResults to fetch the data.
 */
export function* getSearchResults(action) {
  const state = yield select();
  const { query } = action.payload;
  const { dashboardElement } = state;
  yield fork(fetchDashboardPanelSearchResults, dashboardElement, query);
}

function* fetchDataOnSearch() {
  yield takeLatest(DASHBOARD_ELEMENT__GET_SEARCH_RESULTS, getSearchResults);
}

export function* fetchDataOnTabsFetch() {
  function* onTabsFetch(action) {
    const { key } = action.payload;
    const { dashboardElement } = yield select();

    if (dashboardElement.data[key].length === 0) {
      yield fork(getDashboardPanelData, dashboardElement, key);
    } else {
      yield fork(getMoreDashboardPanelData, dashboardElement, key);
    }
  }

  yield takeEvery([DASHBOARD_ELEMENT__SET_PANEL_TABS], onTabsFetch);
}
/**
 * Fetches the data for the activeTab if the data hasn't been loaded.
 */
export function* onTabChange(action) {
  const { panel } = action.payload;
  const { dashboardElement } = yield select();
  const activePanelId = panel || dashboardElement.activePanelId;

  if (activePanelId) {
    if (dashboardElement.data[panel] && dashboardElement.data[panel].length > 0) {
      yield fork(getMoreDashboardPanelData, dashboardElement, activePanelId);
    }
  }
}

function* fetchDataOnTabChange() {
  yield takeLatest(
    [DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH, DASHBOARD_ELEMENT__SET_ACTIVE_TAB],
    onTabChange
  );
}

/**
 * Listens to DASHBOARD_ELEMENT__SET_SELECTED_COUNTRY_ID and requests the tabs data every time a new country has been selected.
 */
export function* onItemChange(action) {
  const { activeItem } = action.payload;
  // for now, we just need to recalculate the tabs when selecting a new country
  if (activeItem) {
    yield fork(getDashboardPanelSectionTabs, 'sources');
  }
}

function* fetchDataOnItemChange() {
  yield takeLatest([DASHBOARD_ELEMENT__SET_SELECTED_COUNTRY_ID], onItemChange);
}

/**
 * Listens to DASHBOARD_ELEMENT__SET_PANEL_PAGE and fetches the data for the next page.
 */
export function* onPageChange() {
  const { dashboardElement } = yield select();

  yield fork(getMoreDashboardPanelData, dashboardElement, dashboardElement.activePanelId);
}

function* fetchDataOnPageChange() {
  yield takeLatest(DASHBOARD_ELEMENT__SET_PANEL_PAGE, onPageChange);
}

function* fetchChartsOnIndicatorsChange() {
  yield takeLatest(
    [
      DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
      DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
      DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY
    ],
    fetchDashboardCharts
  );
}

export default function* dashboardElementSaga() {
  const sagas = [
    fetchDataOnPanelChange,
    fetchDataOnTabsFetch,
    fetchDataOnTabChange,
    fetchDataOnItemChange,
    fetchDataOnPageChange,
    fetchDataOnSearch,
    fetchChartsOnIndicatorsChange,
    fetchChartsOnItemChange,
    fetchDataMissingItemDownload,
    fetchMissingDashboardPanelItems
  ];
  yield all(sagas.map(saga => fork(saga)));
}
