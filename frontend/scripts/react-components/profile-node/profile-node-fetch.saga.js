import { cancelled, call, put } from 'redux-saga/effects';
import { GET_COLUMNS_URL, getURLFromParams } from 'utils/getURLFromParams';
import { fetchWithCancel } from 'utils/saga-utils';
import { setColumns } from 'react-components/profile-node/profile-node.actions';

export function* getColumnsData(selectedContext) {
  const params = { context_id: selectedContext.id };
  const columnsUrl = getURLFromParams(GET_COLUMNS_URL, params);
  const { source, fetchPromise } = fetchWithCancel(columnsUrl);
  try {
    const { data: columnsResponse } = yield call(fetchPromise);
    yield put(setColumns(columnsResponse.data));
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) {
        console.error('Cancelled');
      }
      if (source) {
        source.cancel();
      }
    }
  }
}
