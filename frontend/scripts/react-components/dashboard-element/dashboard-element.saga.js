import { take, select, all, fork, takeLatest, cancel } from 'redux-saga/effects';
import {
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_PANEL_PAGE,
  DASHBOARD_ELEMENT__GET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__OPEN_INDICATORS_STEP,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH
} from 'react-components/dashboard-element/dashboard-element.actions';
import {
  getDashboardPanelSectionTabs,
  getDashboardPanelData,
  getMoreDashboardPanelData,
  fetchDashboardPanelSearchResults
} from 'react-components/dashboard-element/dashboard-element.fetch.saga';

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

  // avoid calling getDashboardPanelData through getDashboardPanelSectionTabs for companies
  if (dashboardElement.activePanelId === 'companies') {
    yield fork(getDashboardPanelSectionTabs, dashboardElement, activePanelId);
  } else if (activePanelId === 'sources') {
    yield fork(getDashboardPanelData, dashboardElement, 'countries');
    // Fetch regions
    if (dashboardElement.countriesPanel.activeItem) {
      yield fork(getDashboardPanelData, dashboardElement, activePanelId);
    }
  } else {
    yield fork(getDashboardPanelData, dashboardElement, activePanelId);
  }
}

/**
 * Checks if the activeItem in one of the panels has changed, if it has changed it fetches the panel data.
 */
export function* fetchDataOnPanelChange() {
  let loaded = [];
  let previousPanelState = null;
  let task = null;
  const hasChanged = panel => {
    if (!previousPanelState) return false;
    return (
      panel.sourcesPanel.activeItem !== previousPanelState.sourcesPanel.activeItem ||
      panel.countriesPanel.activeItem !== previousPanelState.countriesPanel.activeItem ||
      panel.commoditiesPanel.activeItem !== previousPanelState.commoditiesPanel.activeItem ||
      panel.companiesPanel.activeItem !== previousPanelState.companiesPanel.activeItem ||
      panel.destinationsPanel.activeItem !== previousPanelState.destinationsPanel.activeItem
    );
  };

  while (true) {
    const activePanel = yield take(DASHBOARD_ELEMENT__SET_ACTIVE_PANEL);
    const { activePanelId } = activePanel.payload;
    const newPanelState = yield select(state => state.dashboardElement);
    const changes = hasChanged(newPanelState);
    if (changes) {
      loaded = [previousPanelState.activePanelId];
    }
    if (!previousPanelState || !loaded.includes(activePanelId)) {
      if (task !== null) {
        yield cancel(task);
      }
      task = yield fork(fetchDashboardPanelInitialData, activePanel);
      if (!loaded.includes(activePanelId)) {
        loaded.push(activePanelId);
      }
    }
    previousPanelState = newPanelState;
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
/**
 * Fetches the data for the activeTab if the data hasn't been loaded.
 */
export function* onTabChange(action) {
  const { panel } = action.payload;
  const panelName = `${panel}Panel`;
  const { dashboardElement } = yield select();
  const { activeTab } = dashboardElement[panelName] || {};
  const activePanelId = panel || dashboardElement.activePanelId;
  const currentTabId = activeTab && activeTab.id;
  if (!dashboardElement.data.sources[currentTabId]) {
    yield fork(getDashboardPanelData, dashboardElement, activePanelId);
  }
}

function* fetchDataOnTabChange() {
  yield takeLatest(
    [
      DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH,
      DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
      DASHBOARD_ELEMENT__SET_PANEL_TABS
    ],
    onTabChange
  );
}

/**
 * Listens to DASHBOARD_ELEMENT__SET_ACTIVE_ITEM and requests the tabs data every time a new country has been selected.
 */
export function* onItemChange(action) {
  const { panel } = action.payload;
  const { dashboardElement } = yield select();
  // for now, we just need to recalculate the tabs when selecting a new country
  if (panel === 'countries') {
    yield fork(getDashboardPanelSectionTabs, dashboardElement, 'sources');
  }
}

function* fetchDataOnItemChange() {
  yield takeLatest(DASHBOARD_ELEMENT__SET_ACTIVE_ITEM, onItemChange);
}

/**
 * Listens to DASHBOARD_ELEMENT__CLEAR_PANEL and fetches the necessary data after a filter clear.
 * On sources and companies we don't need to call getDashboardPanelData because getDashboardPanelSectionTabs
 * dispatches an action that trigger it.
 */
export function* onFilterClear() {
  const { dashboardElement } = yield select();
  if (dashboardElement.activePanelId === 'sources') {
    yield fork(getDashboardPanelData, dashboardElement, 'countries');
    if (dashboardElement.countriesPanel.activeItem !== null) {
      yield fork(getDashboardPanelSectionTabs, dashboardElement, dashboardElement.activePanelId);
    }
  } else if (dashboardElement.activePanelId === 'companies') {
    yield fork(getDashboardPanelSectionTabs, dashboardElement, dashboardElement.activePanelId);
  } else {
    yield fork(getDashboardPanelData, dashboardElement, dashboardElement.activePanelId);
  }
}

function* fetchDataOnFilterClear() {
  yield takeLatest(DASHBOARD_ELEMENT__CLEAR_PANEL, onFilterClear);
}

/**
 * Listens to DASHBOARD_ELEMENT__SET_PANEL_PAGE and fetches the data for the next page.
 */
export function* onPageChange(action) {
  const { direction } = action.payload;
  const { dashboardElement } = yield select();
  const panelName = `${dashboardElement.activePanelId}Panel`;
  const { activeTab } = dashboardElement[panelName];
  yield fork(
    getMoreDashboardPanelData,
    dashboardElement,
    dashboardElement.activePanelId,
    activeTab,
    direction
  );
}

function* fetchDataOnPageChange() {
  yield takeLatest(DASHBOARD_ELEMENT__SET_PANEL_PAGE, onPageChange);
}

/**
 * Listens to DASHBOARD_ELEMENT__OPEN_INDICATORS_STEP and fetches the initial data for the next step.
 */
export function* onStepChange() {
  const { dashboardElement } = yield select();
  yield fork(getDashboardPanelData, dashboardElement, 'indicators');
}

function* fetchDataOnStepChange() {
  yield takeLatest(DASHBOARD_ELEMENT__OPEN_INDICATORS_STEP, onStepChange);
}

export default function* dashboardElementSaga() {
  const sagas = [
    fetchDataOnPanelChange,
    fetchDataOnTabChange,
    fetchDataOnItemChange,
    fetchDataOnFilterClear,
    fetchDataOnPageChange,
    fetchDataOnSearch,
    fetchDataOnStepChange
  ];
  yield all(sagas.map(saga => fork(saga)));
}
