import { all, fork, takeLatest, select, put } from 'redux-saga/effects';
import {
  expandSankey,
  TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH
} from 'react-components/tool-links/tool-links.actions';
import { getVisibleNodes } from 'react-components/tool-links/tool-links.selectors';

function* checkExpandNode() {
  function* performCheckExpandNode({ payload }) {
    const { results } = payload;
    const ids = results.map(n => n.id);
    const visibleNodes = yield select(getVisibleNodes);
    const visibleNodesById = visibleNodes.reduce((acc, next) => ({ ...acc, [next.id]: true }), {});
    const hasInvisibleNodes = ids.some(id => !visibleNodesById[id]);
    if (hasInvisibleNodes) {
      yield put(expandSankey());
    }
  }

  yield takeLatest([TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH], performCheckExpandNode);
}

export default function* toolSearchSaga() {
  const sagas = [checkExpandNode];
  yield all(sagas.map(saga => fork(saga)));
}
