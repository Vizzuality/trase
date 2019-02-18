import { select, all, fork, takeLatest } from 'redux-saga/effects';
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
    if (dashboardElement.countriesPanel.activeItem) {
      yield fork(getDashboardPanelData, dashboardElement, activePanelId);
    }
  } else {
    yield fork(getDashboardPanelData, dashboardElement, activePanelId);
  }
}
export function* fetchDataOnPanelChange() {
  yield takeLatest(DASHBOARD_ELEMENT__SET_ACTIVE_PANEL, fetchDashboardPanelInitialData);
}

export function* getSearchResults(action) {
  const state = yield select();
  const { query } = action.payload;
  const { dashboardElement } = state;
  yield fork(fetchDashboardPanelSearchResults, dashboardElement, query);
}

function* fetchDataOnSearch() {
  yield takeLatest(DASHBOARD_ELEMENT__GET_SEARCH_RESULTS, getSearchResults);
}

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

export function* onItemChange(action) {
  const { activeItem, panel } = action.payload;
  const { dashboardElement } = yield select();
  const panelName = `${panel}Panel`;
  const { activeTab } = dashboardElement[panelName];
  const panelData = dashboardElement.data[panel];
  const items = typeof activeTab !== 'undefined' ? panelData[activeTab && activeTab.id] : panelData;
  const activeItemExists = !!items && items.find(i => i.id === (activeItem && activeItem.id));
  // for now, we just need to recalculate the tabs when selecting a new country
  if (panel === 'countries') {
    yield fork(getDashboardPanelSectionTabs, dashboardElement, panel);
  } else if (items && !activeItemExists) {
    yield fork(getDashboardPanelData, dashboardElement, panel);
  }
}

function* fetchDataOnItemChange() {
  yield takeLatest(DASHBOARD_ELEMENT__SET_ACTIVE_ITEM, onItemChange);
}

export function* onFilterClear() {
  const { dashboardElement } = yield select();
  if (dashboardElement.activePanelId === 'sources') {
    yield fork(getDashboardPanelData, dashboardElement, 'countries');
    if (dashboardElement.countriesPanel.activeItem !== null) {
      yield fork(getDashboardPanelData, dashboardElement, 'sources');
    }
  } else {
    yield fork(getDashboardPanelData, dashboardElement, dashboardElement.activePanelId);
  }
}

function* fetchDataOnFilterClear() {
  yield takeLatest(DASHBOARD_ELEMENT__CLEAR_PANEL, onFilterClear);
}

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

function* fetchDataOnStepChange() {
  function* onStepChange() {
    const { dashboardElement } = yield select();
    yield fork(getDashboardPanelData, dashboardElement, 'indicators');
  }

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
