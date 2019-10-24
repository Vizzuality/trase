import { select, all, fork, takeLatest, put, call } from 'redux-saga/effects';
import {
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__SET_SELECTED_COUNTRY_ID,
  DASHBOARD_ELEMENT__SET_SELECTED_COMMODITY_ID,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH,
  DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
  DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY,
  DASHBOARD_ELEMENT__GET_MISSING_DATA,
  setDashboardLoading
} from 'react-components/dashboard-element/dashboard-element.actions';
import {
  getMissingDashboardPanelItems,
  fetchDashboardCharts
} from 'react-components/dashboard-element/dashboard-element.fetch.saga';
import { getDashboardsContext } from 'react-components/dashboard-element/dashboard-element.selectors';

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
    const nodesPanel = yield select(state => state.nodesPanel);
    const selectedContext = yield select(getDashboardsContext);

    const tasks = [];

    if (
      selectedContext &&
      ((nodesPanel.sources.data.byId.length === 0 &&
        nodesPanel.sources.selectedNodesIds.length > 0) ||
        (nodesPanel.destinations.data.byId.length === 0 &&
          nodesPanel.destinations.selectedNodesIds.length > 0) ||
        (nodesPanel.importers.data.byId.length === 0 &&
          nodesPanel.importers.selectedNodesIds.length > 0) ||
        (nodesPanel.exporters.data.byId.length === 0 &&
          nodesPanel.exporters.selectedNodesIds.length > 0))
    ) {
      tasks.push(call(getMissingDashboardPanelItems, nodesPanel, selectedContext));
    }

    yield all(tasks);

    if (tasks.length > 0 && selectedContext) {
      yield call(updateIndicatorsOnItemChange);
    }
    yield put(setDashboardLoading(false));
  }

  yield takeLatest([DASHBOARD_ELEMENT__GET_MISSING_DATA], fetchMissingItems);
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
    fetchChartsOnIndicatorsChange,
    fetchChartsOnItemChange,
    fetchMissingDashboardPanelItems
  ];
  yield all(sagas.map(saga => fork(saga)));
}
