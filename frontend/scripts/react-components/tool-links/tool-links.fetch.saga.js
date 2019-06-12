import { put, call, cancelled, fork } from 'redux-saga/effects';
import { GET_COLUMNS_URL, GET_ALL_NODES_URL, getURLFromParams } from 'utils/getURLFromParams';
import { setLoadingSpinner } from 'utils/saga-utils';
import fetchWithCancel from 'utils/fetchWithCancel';
import { setToolFlowsLoading, setToolNodesAndColumns } from './tool-links.actions';

export function* getToolNodesAndColumnsData(selectedContext) {
  const params = {
    context_id: selectedContext.id
  };
  const nodesUrl = getURLFromParams(GET_ALL_NODES_URL, params);
  const columnsUrl = getURLFromParams(GET_COLUMNS_URL, params);
  const task = yield fork(setLoadingSpinner, 750, setToolFlowsLoading(true));
  const { source: nodesSource, fetchPromise: nodesFetchPromise } = fetchWithCancel(nodesUrl);
  const { source: columnsSource, fetchPromise: columnsFetchPromise } = fetchWithCancel(columnsUrl);
  try {
    const { data: nodesResponse } = yield call(nodesFetchPromise);
    const { data: columnsResponse } = yield call(columnsFetchPromise);
    if (task.isRunning()) {
      task.cancel();
    }
    yield put(setToolNodesAndColumns(nodesResponse.data, columnsResponse.data));
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) console.error('Cancelled');
      if (nodesSource) {
        nodesSource.cancel();
      }
      if (columnsSource) {
        columnsSource.cancel();
      }
    }
  }
}
