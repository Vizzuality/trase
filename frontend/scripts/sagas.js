import { all, fork } from 'redux-saga/effects';
import profileNode from 'react-components/profile-node/profile-node.saga';
import dashboardElement from 'react-components/dashboard-element/dashboard-element.saga';
import toolLinks from 'react-components/tool-links/tool-links.saga';
import toolLayers from 'react-components/tool-layers/tool-layers.saga';
import profilePanel from 'react-components/shared/profile-selector/profile-panel/profile-panel.saga';
import nodesPanel from 'react-components/nodes-panel/nodes-panel.saga';

const sagas = [profileNode, dashboardElement, toolLinks, toolLayers, profilePanel, nodesPanel];

export function* rootSaga() {
  yield all(sagas.map(saga => fork(saga)));
}
