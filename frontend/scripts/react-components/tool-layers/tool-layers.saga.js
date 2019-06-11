import { all, fork, takeLatest, select } from 'redux-saga/effects';
import {
  TOOL_LINKS__GET_COLUMNS,
  TOOL_LINKS__SET_SELECTED_NODES,
  TOOL_LINKS__CLEAR_SANKEY,
  TOOL_LINKS__SELECT_COLUMN
} from 'react-components/tool-links/tool-links.actions';
import { SET_CONTEXT } from 'actions/app.actions';
import { SELECT_YEARS } from 'react-components/tool/tool.actions';
import { getLinkedGeoIds, getMapDimensions } from './tool-layers.fetch.saga';

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

function* fetchMapDimensions() {
  function* performFetch() {
    yield fork(getMapDimensions);
  }
  yield takeLatest([TOOL_LINKS__GET_COLUMNS, SET_CONTEXT, SELECT_YEARS], performFetch);
}

export default function* toolLayersSaga() {
  const sagas = [fetchMapDimensions, fetchLinkedGeoIds];
  yield all(sagas.map(saga => fork(saga)));
}
