import { select, all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { SET_CONTEXT } from 'actions/app.actions';
import { loadMapVectorData } from 'react-components/tool/tool.actions';
import { setLoadingSpinner } from 'utils/saga-utils';
import { TOOL_LINKS__GET_COLUMNS, setToolFlowsLoading } from './tool-links.actions';
import {
  getToolColumnsData,
  getToolLinksData,
  getToolNodesByLink,
  getToolGeoColumnNodes
} from './tool-links.fetch.saga';

export function* fetchToolColumns() {
  function* performFetch() {
    const state = yield select();
    const {
      app: { selectedContext }
    } = state;

    yield put(setToolFlowsLoading(true));
    yield fork(getToolColumnsData, selectedContext);
    yield call(getToolLinksData);
    yield fork(getToolNodesByLink, selectedContext);
    yield fork(getToolGeoColumnNodes, selectedContext);

    // TODO: remove this calls, just here to split the refactor in stages
    yield put(loadMapVectorData());

    yield fork(setLoadingSpinner, 150, setToolFlowsLoading(false));
  }
  yield takeLatest([TOOL_LINKS__GET_COLUMNS, SET_CONTEXT], performFetch);
}

export default function* toolLinksSaga() {
  const sagas = [fetchToolColumns];
  yield all(sagas.map(saga => fork(saga)));
}
