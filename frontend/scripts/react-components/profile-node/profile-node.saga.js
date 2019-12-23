import { select, fork, takeLatest, cancel, all } from 'redux-saga/effects';
import {
  PROFILE_NODE__GET_COLUMNS,
  setColumnsLoading
} from 'react-components/profile-node/profile-node.actions';
import { SET_CONTEXT, SET_CONTEXTS } from 'app/app.actions';
import { setLoadingSpinner } from 'utils/saga-utils';
import { getColumnsData } from 'react-components/profile-node/profile-node-fetch.saga';

function* fetchColumns() {
  function* performFetch() {
    const {
      location,
      app: { contexts }
    } = yield select();

    if (location.type !== 'profileNode') return;
    const { contextId } = location.query;
    const selectedContext = contextId ? contexts.find(c => c.id === contextId) : null;
    if (selectedContext === null) return;
    const task = yield fork(setLoadingSpinner, 750, setColumnsLoading(true));
    yield fork(getColumnsData, selectedContext);

    if (task.isRunning()) {
      yield cancel(task);
    } else {
      yield fork(setLoadingSpinner, 350, setColumnsLoading(false));
    }
  }
  yield takeLatest([SET_CONTEXTS, PROFILE_NODE__GET_COLUMNS, SET_CONTEXT], performFetch);
}

export default function* appSaga() {
  const sagas = [fetchColumns];
  yield all(sagas.map(saga => fork(saga)));
}
