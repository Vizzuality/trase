import { all, fork } from 'redux-saga/effects';
import dashboardElement from 'react-components/dashboard-element/dashboard-element.saga';
import toolLinks from 'react-components/tool-links/tool-links.saga';

const sagas = [dashboardElement, toolLinks];

export function* rootSaga() {
  yield all(sagas.map(saga => fork(saga)));
}
