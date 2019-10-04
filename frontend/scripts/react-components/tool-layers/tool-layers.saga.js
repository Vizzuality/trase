import { all, fork, takeLatest, select, put, call } from 'redux-saga/effects';
import {
  TOOL_LINKS__SET_SELECTED_NODES,
  TOOL_LINKS__CLEAR_SANKEY,
  TOOL_LINKS__SELECT_COLUMN,
  TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH
} from 'react-components/tool-links/tool-links.actions';
import { SET_CONTEXT, SET_CONTEXTS, APP__GET_COLUMNS } from 'actions/app.actions';
import {
  SELECT_YEARS,
  loadMapChoropleth,
  SET_NODE_ATTRIBUTES
} from 'react-components/tool/tool.actions';
import { getSelectedYears, getSelectedContext } from 'reducers/app.selectors';
import { getLinkedGeoIds, getMapDimensions } from './tool-layers.fetch.saga';

function* fetchLinkedGeoIds() {
  function* getGeoIds() {
    yield fork(getLinkedGeoIds);
  }

  yield takeLatest(
    [
      TOOL_LINKS__SET_SELECTED_NODES,
      TOOL_LINKS__CLEAR_SANKEY,
      TOOL_LINKS__SELECT_COLUMN,
      TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH,
      SET_NODE_ATTRIBUTES
    ],
    getGeoIds
  );
}

function* fetchMapDimensions() {
  function* performFetch() {
    const selectedYears = yield select(getSelectedYears);
    const selectedContext = yield select(getSelectedContext);
    const page = yield select(state => state.location.type);
    if (page !== 'tool' || selectedContext === null) {
      return;
    }

    yield call(getMapDimensions, selectedContext, selectedYears);
    // TODO remove this when mapbox comes
    yield put(loadMapChoropleth());
  }
  yield takeLatest(
    [
      SET_CONTEXTS,
      APP__GET_COLUMNS,
      SET_CONTEXT,
      SELECT_YEARS,
      TOOL_LINKS__SELECT_COLUMN,
      TOOL_LINKS__CLEAR_SANKEY
    ],
    performFetch
  );
}

export default function* toolLayersSaga() {
  const sagas = [fetchMapDimensions, fetchLinkedGeoIds];
  yield all(sagas.map(saga => fork(saga)));
}
