import { all, fork } from 'redux-saga/effects';
import dashboardElementLegacy from 'react-components/dashboard-element-legacy/dashboard-element.saga';
import toolLinks from 'react-components/tool-links/tool-links.saga';
import toolLayers from 'react-components/tool-layers/tool-layers.saga';
import toolSearch from 'react-components/tool/tool-search/tool-search.saga';
import profilePanel from 'react-components/shared/profile-selector/profile-panel/profile-panel.saga';

const sagas = [dashboardElementLegacy, toolLinks, toolLayers, toolSearch, profilePanel];

export function* rootSaga() {
  yield all(sagas.map(saga => fork(saga)));
}
