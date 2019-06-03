import { select, all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { SET_CONTEXT } from 'actions/app.actions';
import { loadLinks, loadMapVectorData } from 'react-components/tool/tool.actions';
import { TOOL_LINKS__GET_LINKS_AND_COLUMNS } from './tool-links.actions';
import { getToolLinksAndColumnsData } from './tool-links.fetch.saga';

export function* fetchToolNodesAndColumns() {
  function* performFetch() {
    const state = yield select();
    const {
      app: { selectedContext }
    } = state;
    yield call(getToolLinksAndColumnsData, selectedContext);

    // TODO: remove this calls, just here to split the refactor in stages
    yield put(loadLinks());
    yield put(loadMapVectorData());
  }
  yield takeLatest([TOOL_LINKS__GET_LINKS_AND_COLUMNS, SET_CONTEXT], performFetch);
}

export default function* toolLinksSaga() {
  const sagas = [fetchToolNodesAndColumns];
  yield all(sagas.map(saga => fork(saga)));
}
