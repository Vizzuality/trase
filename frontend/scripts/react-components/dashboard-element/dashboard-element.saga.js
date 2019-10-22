import { select, all, fork, takeLatest } from 'redux-saga/effects';
import { fetchDashboardCharts } from 'react-components/dashboard-element/dashboard-element.fetch.saga';
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
      // Add Tool Actions
    ],
    updateIndicatorsOnItemChange
  );
}

function* fetchChartsOnIndicatorsChange() {
  yield takeLatest(
    [
      // Add Tool actions
    ],
    fetchDashboardCharts
  );
}

export default function* dashboardElementSaga() {
  const sagas = [fetchChartsOnIndicatorsChange, fetchChartsOnItemChange];
  yield all(sagas.map(saga => fork(saga)));
}
