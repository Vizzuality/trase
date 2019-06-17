import { SET_SELECTED_NODES_BY_SEARCH } from 'react-components/tool/tool.actions';
import { all, fork, takeLatest, select, put } from 'redux-saga/effects';
import { getVisibleNodes } from 'react-components/tool/tool.selectors';
import { expandSankey, selectColumn } from 'react-components/tool-links/tool-links.actions';

function* selectSearchNodes() {
  function* changeColumn(toolLinks, ids) {
    const node = toolLinks.data.nodes[ids[0]];
    const columnId = node?.columnId;
    if (columnId) {
      const nodeColumn = toolLinks.data.columns[columnId];
      const selectedColumnsIds = toolLinks.selectedColumnsIds;
      if (
        (nodeColumn.isDefault === false && !selectedColumnsIds) ||
        (nodeColumn.isDefault === false && !selectedColumnsIds[nodeColumn.group]) ||
        (selectedColumnsIds && selectedColumnsIds[nodeColumn.group] !== columnId)
      ) {
        yield put(selectColumn(nodeColumn.group, columnId));
      }
    }
  }

  function* selectAndExpandNodes({ payload }) {
    const { ids } = payload;
    const state = yield select();

    yield changeColumn(state.toolLinks, ids);

    const visibleNodes = getVisibleNodes(state);
    const visibleNodesById = visibleNodes.reduce((acc, next) => ({ ...acc, [next.id]: true }), {});
    const hasInvisibleNodes = ids.some(id => !visibleNodesById[id]);
    if (hasInvisibleNodes) {
      yield put(expandSankey());
    }
  }

  yield takeLatest([SET_SELECTED_NODES_BY_SEARCH], selectAndExpandNodes);
}

export default function* toolSearchSaga() {
  const sagas = [selectSearchNodes];
  yield all(sagas.map(saga => fork(saga)));
}
