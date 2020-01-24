import { all, fork, takeLatest, select, put, call } from 'redux-saga/effects';
import {
  TOOL_LINKS__GET_COLUMNS,
  TOOL_LINKS__SET_SELECTED_NODES,
  TOOL_LINKS__CLEAR_SANKEY,
  TOOL_LINKS__SELECT_COLUMN,
  TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH
} from 'react-components/tool-links/tool-links.register';
import {
  NODES_PANEL__SAVE,
  NODES_PANEL__SYNC_NODES_WITH_SANKEY
} from 'react-components/nodes-panel/nodes-panel.register';
import { SET_CONTEXT, SET_CONTEXTS } from 'app/app.register';
import {
  SELECT_YEARS,
  loadMapChoropleth,
  SET_NODE_ATTRIBUTES,
  TOGGLE_MAP_DIMENSION
} from 'react-components/tool/tool.actions';
import { getSelectedYears, getSelectedContext } from 'app/app.selectors';
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
      TOOL_LINKS__GET_COLUMNS,
      TOGGLE_MAP_DIMENSION,
      SET_CONTEXT,
      NODES_PANEL__SAVE,
      SELECT_YEARS,
      TOOL_LINKS__SELECT_COLUMN,
      TOOL_LINKS__CLEAR_SANKEY,
      NODES_PANEL__SYNC_NODES_WITH_SANKEY
    ],
    performFetch
  );
}

export default function* toolLayersSaga() {
  const sagas = [fetchMapDimensions, fetchLinkedGeoIds];
  yield all(sagas.map(saga => fork(saga)));
}
