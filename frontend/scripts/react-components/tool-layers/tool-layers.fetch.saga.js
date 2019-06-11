import { put, call, cancelled, select } from 'redux-saga/effects';
import { getURLFromParams, GET_LINKED_GEO_IDS_URL } from 'utils/getURLFromParams';
import { fetchWithCancel } from 'utils/saga-utils';
import {
  getSelectedColumnsIds,
  getSelectedNodesColumnsPos
} from 'react-components/tool/tool.selectors';
import { setLinkedGeoIds } from 'react-components/tool-layers/tool-layers.actions';

export function* getLinkedGeoIds() {
  const {
    toolLinks: { selectedNodesIds },
    app
  } = yield select();
  const selectedColumnsIds = yield select(getSelectedColumnsIds);
  const selectedNodesColumnsPos = yield select(getSelectedNodesColumnsPos);

  const selectedNonGeoNodeIds = selectedNodesIds.filter(
    (nodeId, index) => selectedNodesColumnsPos[index] !== 0
  );
  // when selection only contains geo nodes (column 0), we should not call get_linked_geoids
  if (selectedNonGeoNodeIds.length === 0) {
    yield put(setLinkedGeoIds([]));
    return;
  }
  const params = {
    context_id: app.selectedContext.id,
    years: Array.from(new Set([app.selectedYears[0], app.selectedYears[1]])),
    nodes_ids: selectedNodesIds,
    target_column_id: selectedColumnsIds[0]
  };
  const url = getURLFromParams(GET_LINKED_GEO_IDS_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);

  try {
    const { data } = yield call(fetchPromise);
    yield put(setLinkedGeoIds(data.nodes));
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) console.error('Cancelled');
      if (source) {
        source.cancel();
      }
    }
  }
}
