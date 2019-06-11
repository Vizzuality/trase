import { all, fork, takeLatest, select } from 'redux-saga/effects';
import {
  TOOL_LINKS__SET_SELECTED_NODES,
  TOOL_LINKS__CLEAR_SANKEY,
  TOOL_LINKS__SELECT_COLUMN
} from 'react-components/tool-links/tool-links.actions';
import { getLinkedGeoIds } from './tool-layers.fetch.saga';

function* fetchLinkedGeoIds() {
  function* getGeoIds(action) {
    if (action.type === TOOL_LINKS__SET_SELECTED_NODES) {
      const { nodeIds } = action.payload;
      const { nodes } = yield select(state => state.toolLinks.data);
      const isAggregated = nodeIds.every(id => nodes[id].isAggregated);
      if (!isAggregated) {
        // load related geoIds to show on the map
        yield fork(getLinkedGeoIds);
      }
    } else {
      yield fork(getLinkedGeoIds);
    }
  }

  yield takeLatest(
    [TOOL_LINKS__SET_SELECTED_NODES, TOOL_LINKS__CLEAR_SANKEY, TOOL_LINKS__SELECT_COLUMN],
    getGeoIds
  );
}

export default function* toolLayersSaga() {
  const sagas = [fetchLinkedGeoIds];
  yield all(sagas.map(saga => fork(saga)));
}
