import { all, fork } from 'redux-saga/effects';
import dashboardElement from 'react-components/dashboard-element/dashboard-element.saga';

const sagas = [dashboardElement];

export function* rootSaga() {
  yield all(sagas.map(saga => fork(saga)));
}
