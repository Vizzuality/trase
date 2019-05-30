import { select, all, fork, takeLatest } from 'redux-saga/effects';
import { TOOL_LINKS__GET_NODES_AND_COLUMNS } from './tool-links.actions';
import { getToolNodesAndColumnsData } from './tool-links.fetch.saga';

export function* fetchToolNodesAndColumns() {
  function* performFetch() {
    const state = yield select();
    const {
      app: { selectedContext }
    } = state;
    yield fork(getToolNodesAndColumnsData, selectedContext);
  }
  yield takeLatest(TOOL_LINKS__GET_NODES_AND_COLUMNS, performFetch);
}

export default function* toolLinksSaga() {
  const sagas = [fetchToolNodesAndColumns];
  yield all(sagas.map(saga => fork(saga)));
}
