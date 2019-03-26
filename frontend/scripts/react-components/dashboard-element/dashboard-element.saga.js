import { take, select, all, fork, put, takeLatest, cancel } from 'redux-saga/effects';
import isEmpty from 'lodash/isEmpty';
import {
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS,
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_PANEL_PAGE,
  DASHBOARD_ELEMENT__GET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH,
  DASHBOARD_ELEMENT__CLEAR_PANELS,
  DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
  DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY
} from 'react-components/dashboard-element/dashboard-element.actions';
import {
  getDashboardPanelSectionTabs,
  getDashboardPanelData,
  getMoreDashboardPanelData,
  fetchDashboardPanelSearchResults,
  fetchDashboardCharts
} from 'react-components/dashboard-element/dashboard-element.fetch.saga';
import { DASHBOARD_STEPS } from 'constants';

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

  // avoid dispatching getDashboardPanelData through getDashboardPanelSectionTabs for companies
  if (dashboardElement.activePanelId === 'companies') {
    yield fork(getDashboardPanelSectionTabs, dashboardElement, activePanelId);
  } else if (activePanelId === 'sources') {
    yield fork(getDashboardPanelData, dashboardElement, 'countries');
    // Fetch regions
    if (!isEmpty(dashboardElement.countriesPanel.activeItems)) {
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
      panel.sourcesPanel.activeItems !== previousPanelState.sourcesPanel.activeItems ||
      panel.countriesPanel.activeItems !== previousPanelState.countriesPanel.activeItems ||
      panel.commoditiesPanel.activeItems !== previousPanelState.commoditiesPanel.activeItems ||
      panel.companiesPanel.activeItems !== previousPanelState.companiesPanel.activeItems ||
      panel.destinationsPanel.activeItems !== previousPanelState.destinationsPanel.activeItems
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
      DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH,
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
  const { panel, activeItem } = action.payload;
  const { dashboardElement } = yield select();
  // for now, we just need to recalculate the tabs when selecting a new country
  if (panel === 'countries' && !isEmpty(activeItem)) {
    yield fork(getDashboardPanelSectionTabs, dashboardElement, 'sources');
  }
}

function* fetchDataOnItemChange() {
  yield takeLatest(
    [DASHBOARD_ELEMENT__SET_ACTIVE_ITEM, DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS],
    onItemChange
  );
}

/**
 * Listens to actions that remove or clear panel items and deletes all subsequent selections if the panel is changed
 */

export function* onChangePanel(action) {
  const { panel } = action.payload;
  const dashboardElement = yield select(state => state.dashboardElement);
  const dashboardStepName = panel === 'countries' ? 'sources' : panel;
  const panelIndex = DASHBOARD_STEPS[dashboardStepName];
  const nextPanels = Object.keys(DASHBOARD_STEPS).slice(panelIndex + 1);

  const panelsToClear = nextPanels
    .map(p => ({ name: p, items: dashboardElement[`${p}Panel`].activeItems }))
    .filter(p => p.items.length > 0)
    .map(p => p.name);

  if (panelsToClear.length > 0) {
    yield put({
      type: DASHBOARD_ELEMENT__CLEAR_PANELS,
      payload: { panels: nextPanels }
    });
  }
}

function* clearSubsequentPanels() {
  yield takeLatest(
    [
      DASHBOARD_ELEMENT__CLEAR_PANEL,
      DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
      DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS,
      DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH
    ],
    onChangePanel
  );
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
    fetchDataOnTabChange,
    fetchDataOnItemChange,
    clearSubsequentPanels,
    fetchDataOnPageChange,
    fetchDataOnSearch,
    fetchChartsOnIndicatorsChange
  ];
  yield all(sagas.map(saga => fork(saga)));
}
