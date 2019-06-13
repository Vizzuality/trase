import { all, fork, takeLatest, select, put, call } from 'redux-saga/effects';
import {
  TOOL_LINKS__GET_COLUMNS,
  TOOL_LINKS__SET_SELECTED_NODES,
  TOOL_LINKS__CLEAR_SANKEY,
  TOOL_LINKS__SELECT_COLUMN
} from 'react-components/tool-links/tool-links.actions';
import { SET_CONTEXT } from 'actions/app.actions';
import { SELECT_YEARS, loadMapChoropleth } from 'react-components/tool/tool.actions';
import { getLinkedGeoIds, getMapDimensions } from './tool-layers.fetch.saga';

function* fetchLinkedGeoIds() {
  function* getGeoIds() {
    yield fork(getLinkedGeoIds);
  }

  yield takeLatest(
    [TOOL_LINKS__SET_SELECTED_NODES, TOOL_LINKS__CLEAR_SANKEY, TOOL_LINKS__SELECT_COLUMN],
    getGeoIds
  );
}

function* fetchMapDimensions() {
  function* performFetch() {
    const page = yield select(state => state.location.type);
    if (page !== 'tool') {
      return;
    }

    yield call(getMapDimensions);
    // TODO remove this when mapbox comes
    yield put(loadMapChoropleth());
  }
  yield takeLatest([TOOL_LINKS__GET_COLUMNS, SET_CONTEXT, SELECT_YEARS], performFetch);
}

export default function* toolLayersSaga() {
  const sagas = [fetchMapDimensions, fetchLinkedGeoIds];
  yield all(sagas.map(saga => fork(saga)));
}
