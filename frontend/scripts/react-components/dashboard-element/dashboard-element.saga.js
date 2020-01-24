import { select, all, fork, takeLatest } from 'redux-saga/effects';
import {
  DASHBOARD_ELEMENT__GO_TO_DASHBOARD,
  DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
  DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY
} from 'react-components/dashboard-element/dashboard-element.register';
import { fetchDashboardCharts } from 'react-components/dashboard-element/dashboard-element.fetch.saga';
import { getDashboardsContext } from 'react-components/dashboard-element/dashboard-element.selectors';

export function* updateIndicatorsOnItemChange() {
  const selectedContext = yield select(getDashboardsContext);
  if (selectedContext) {
    yield fork(fetchDashboardCharts);
  }
}

function* fetchChartsOnItemChange() {
  yield takeLatest([DASHBOARD_ELEMENT__GO_TO_DASHBOARD], updateIndicatorsOnItemChange);
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
  const sagas = [fetchChartsOnIndicatorsChange, fetchChartsOnItemChange];
  yield all(sagas.map(saga => fork(saga)));
}
