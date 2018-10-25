import { select, put, all, fork, takeLatest } from 'redux-saga/effects';
import {
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
  getDashboardPanelData,
  getMoreDashboardPanelData,
  getDashboardPanelSectionTabs,
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_PANEL_PAGE
} from 'react-components/dashboard-element/dashboard-element.actions';
import { getDirtyBlocks } from 'react-components/dashboard-element/dashboard-element.selectors';

function* fetchDataOnPanelChange() {
  function* fetchDashboardPanelInitialData(action) {
    const { activePanelId } = action.payload;
    const initialData = activePanelId === 'sources' ? 'countries' : activePanelId;
    const state = yield select();
    const { dashboardElement } = state;
    const panelName = `${dashboardElement.activePanelId}Panel`;
    const { activeTab } = dashboardElement[panelName];
    const refetchPanel = getDirtyBlocks(state)[activePanelId];

    if (dashboardElement.activePanelId === 'companies') {
      yield put(getDashboardPanelSectionTabs(dashboardElement.activePanelId));
    }
    yield put(getDashboardPanelData(initialData, activeTab, { refetchPanel }));
  }

  yield takeLatest(DASHBOARD_ELEMENT__SET_ACTIVE_PANEL, fetchDashboardPanelInitialData);
}

function* fetchDataOnTabChange() {
  function* onTabChange(action) {
    const { activeTab, panel } = action.payload;
    const { dashboardElement } = yield select();
    const activePanelId = panel || dashboardElement.activePanelId;
    const activeTabId = activeTab || dashboardElement[`${activePanelId}Panel`].activeTab;
    yield put(getDashboardPanelData(activePanelId, activeTabId));
  }

  yield takeLatest(
    [DASHBOARD_ELEMENT__SET_ACTIVE_TAB, DASHBOARD_ELEMENT__SET_PANEL_TABS],
    onTabChange
  );
}

function* fetchDataOnItemChange() {
  function* onItemChange(action) {
    const { activeItem, panel } = action.payload;
    const { dashboardElement } = yield select();
    const panelName = `${dashboardElement.activePanelId}Panel`;
    const { activeTab } = dashboardElement[panelName];
    const data = dashboardElement.data[dashboardElement.activePanelId];
    const items = typeof activeTab !== 'undefined' ? data[activeTab] : data;
    const activeItemExists = !!items && items.find(i => i.id === activeItem);

    // for now, we just need to recalculate the tabs when selecting a new country
    if (panel === 'countries') {
      yield put(getDashboardPanelSectionTabs(panel));
    }

    if (items && !activeItemExists) {
      yield put(
        getDashboardPanelData(panel, activeTab, {
          refetchPanel: true
        })
      );
    }
  }

  yield takeLatest(DASHBOARD_ELEMENT__SET_ACTIVE_ITEM, onItemChange);
}

function* fetchDataOnFilterClear() {
  function* onFilterClear() {
    const { dashboardElement } = yield select();
    const panelName = `${dashboardElement.activePanelId}Panel`;
    const { activeTab } = dashboardElement[panelName];
    yield put(getDashboardPanelData(dashboardElement.activePanelId, activeTab));

    if (dashboardElement.activePanelId) {
      yield put(getDashboardPanelData('countries'));
    }
    yield put(getDashboardPanelSectionTabs(dashboardElement.activePanelId));
  }

  yield takeLatest(DASHBOARD_ELEMENT__CLEAR_PANEL, onFilterClear);
}

function* fetchDataOnPageChange() {
  function* onPageChange(action) {
    const { direction } = action.payload;
    const { dashboardElement } = yield select();
    const panelName = `${dashboardElement.activePanelId}Panel`;
    const { activeTab } = dashboardElement[panelName];

    yield put(getMoreDashboardPanelData(dashboardElement.activePanelId, activeTab, direction));
  }

  yield takeLatest(DASHBOARD_ELEMENT__SET_PANEL_PAGE, onPageChange);
}

export default function* dashboardElementSaga() {
  const sagas = [
    fetchDataOnPanelChange,
    fetchDataOnTabChange,
    fetchDataOnItemChange,
    fetchDataOnFilterClear,
    fetchDataOnPageChange
  ];
  yield all(sagas.map(saga => fork(saga)));
}
