import { select, put, all, fork, takeLatest } from 'redux-saga/effects';
import {
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  DASHBOARD_ELEMENT__SET_ACTIVE_ID,
  getDashboardPanelData,
  getDashboardPanelSectionTabs,
  DASHBOARD_ELEMENT__SET_PANEL_TABS
} from 'react-components/dashboard-element/dashboard-element.actions';
import { getActiveTab } from 'react-components/dashboard-element/dashboard-element.selectors';

function* fetchDataOnPanelChange() {
  function* fetchDashboardPanelInitialData(action) {
    const { activePanelId } = action.payload;
    const initialData = activePanelId === 'sources' ? 'countries' : activePanelId;
    const { dashboardElement } = yield select();

    if (dashboardElement.activePanelId === 'companies') {
      yield put(getDashboardPanelSectionTabs(dashboardElement.activePanelId));
    }

    yield put(getDashboardPanelData(initialData));
  }

  yield takeLatest(DASHBOARD_ELEMENT__SET_ACTIVE_PANEL, fetchDashboardPanelInitialData);
}

function* fetchDataOnFilterChange() {
  function* onFilterChange(action) {
    const { type } = action.payload;
    const { dashboardElement } = yield select();
    const { activeTab } = getActiveTab(dashboardElement);

    if (type === 'item') {
      yield put(getDashboardPanelSectionTabs(dashboardElement.activePanelId));
    }
    yield put(getDashboardPanelData(dashboardElement.activePanelId, activeTab));
  }

  yield takeLatest(DASHBOARD_ELEMENT__SET_ACTIVE_ID, onFilterChange);
}

function* fetchDataOnFilterClear() {
  function* onFilterClear() {
    const { dashboardElement } = yield select();
    const { activeTab } = getActiveTab(dashboardElement);
    yield put(getDashboardPanelData(dashboardElement.activePanelId, activeTab));

    if (dashboardElement.activePanelId) {
      yield put(getDashboardPanelData('countries'));
    }
    yield put(getDashboardPanelSectionTabs(dashboardElement.activePanelId));
  }

  yield takeLatest(DASHBOARD_ELEMENT__CLEAR_PANEL, onFilterClear);
}

function* setActiveTabOnDataFetch() {
  function* setFirstTab(action) {
    const { data } = action.payload;
    const { dashboardElement } = yield select();
    const getTabId = d => {
      const current = d.find(t => t.section.toLowerCase() === dashboardElement.activePanelId);
      return current && current.tabs.length > 0 ? current.tabs[0].id : null;
    };
    const active = data && getTabId(data);
    const section = {
      sources: 'source',
      companies: 'nodeType'
    }[dashboardElement.activePanelId];
    if (active && section) {
      yield put({
        type: DASHBOARD_ELEMENT__SET_ACTIVE_ID,
        payload: {
          active,
          section,
          type: 'tab',
          panel: dashboardElement.activePanelId
        }
      });
    }
  }

  yield takeLatest(DASHBOARD_ELEMENT__SET_PANEL_TABS, setFirstTab);
}

export default function* dashboardElementSaga() {
  const sagas = [
    fetchDataOnPanelChange,
    setActiveTabOnDataFetch,
    fetchDataOnFilterChange,
    fetchDataOnFilterClear
  ];
  yield all(sagas.map(saga => fork(saga)));
}
