import { all, fork } from 'redux-saga/effects';
import dashboardElement from 'react-components/dashboard-element/dashboard-element.saga';
import toolLinks from 'react-components/tool-links/tool-links.saga';
import toolLayers from 'react-components/tool-layers/tool-layer.saga';

const sagas = [dashboardElement, toolLinks, toolLayers];

export function* rootSaga() {
  yield all(sagas.map(saga => fork(saga)));
}
