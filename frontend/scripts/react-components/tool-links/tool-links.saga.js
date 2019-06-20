import { select, all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { SET_CONTEXT, SET_CONTEXTS } from 'actions/app.actions';
import { setLoadingSpinner } from 'utils/saga-utils';
import {
  loadMapVectorData,
  SELECT_RESIZE_BY,
  SELECT_BIOME_FILTER,
  SELECT_YEARS
} from 'react-components/tool/tool.actions';
import { getSelectedContext } from 'reducers/app.selectors';
import {
  TOOL_LINKS__SET_SELECTED_NODES,
  TOOL_LINKS__SELECT_COLUMN,
  TOOL_LINKS__SELECT_VIEW,
  TOOL_LINKS__GET_COLUMNS,
  TOOL_LINKS__EXPAND_SANKEY,
  TOOL_LINKS__COLLAPSE_SANKEY,
  TOOL_LINKS__CLEAR_SANKEY,
  TOOL_LINKS__SET_SELECTED_RECOLOR_BY,
  setToolFlowsLoading,
  selectView
} from './tool-links.actions';
import {
  getToolColumnsData,
  getToolLinksData,
  getToolNodesByLink,
  getToolGeoColumnNodes,
  getMoreToolNodesByLink
} from './tool-links.fetch.saga';

function* fetchToolColumns() {
  function* performFetch() {
    const state = yield select();
    const {
      location: { type: page }
    } = state;
    const selectedContext = yield select(getSelectedContext);

    if (page !== 'tool' || selectedContext === null) {
      return;
    }

    yield put(setToolFlowsLoading(true));
    yield fork(getToolColumnsData, selectedContext);
    yield call(getToolLinksData);
    yield call(getToolNodesByLink, selectedContext);
    yield call(getToolGeoColumnNodes, selectedContext);

    // TODO: remove this call, just here to split the refactor in stages
    yield put(loadMapVectorData());

    yield fork(setLoadingSpinner, 150, setToolFlowsLoading(false));
  }
  yield takeLatest([SET_CONTEXTS, TOOL_LINKS__GET_COLUMNS, SET_CONTEXT], performFetch);
}

function* fetchToolGeoColumnNodes() {
  function* performFetch(action) {
    const {
      toolLinks: {
        data: { columns }
      }
    } = yield select(state => state);
    const selectedContext = yield select(getSelectedContext);
    const { columnId } = action.payload;

    if (columns[columnId] && columns[columnId].isGeo) {
      yield fork(getToolGeoColumnNodes, selectedContext);
    }
  }

  yield takeLatest([TOOL_LINKS__SELECT_COLUMN], performFetch);
}

function* fetchLinks() {
  function* performFetch(action) {
    const page = yield select(state => state.location.type);
    if (page !== 'tool') {
      return;
    }

    const { selectedNodesIds } = yield select(state => state.toolLinks);

    if (action.type === TOOL_LINKS__SET_SELECTED_NODES && selectedNodesIds.length !== 0) {
      return;
    }

    const selectedContext = yield select(getSelectedContext);
    const fetchAllNodes = action.type === TOOL_LINKS__SELECT_VIEW && action.payload.detailedView;
    yield put(setToolFlowsLoading(true));
    yield call(getToolLinksData);
    yield call(getMoreToolNodesByLink, selectedContext, fetchAllNodes);
    yield put(setToolFlowsLoading(false));
  }
  yield takeLatest(
    [
      SELECT_YEARS,
      SELECT_RESIZE_BY,
      SELECT_BIOME_FILTER,
      TOOL_LINKS__SELECT_VIEW,
      TOOL_LINKS__CLEAR_SANKEY,
      TOOL_LINKS__SELECT_COLUMN,
      TOOL_LINKS__EXPAND_SANKEY,
      TOOL_LINKS__COLLAPSE_SANKEY,
      TOOL_LINKS__SET_SELECTED_NODES,
      TOOL_LINKS__SET_SELECTED_RECOLOR_BY
    ],
    performFetch
  );
}

function* checkForceOverviewOnCollapse() {
  function* onCollapse() {
    const { forcedOverview } = yield select(state => state.toolLinks);

    // if shrinking, and if overview was previously forced, go back to detailed
    if (forcedOverview) {
      yield put(selectView(true, false));
    }
  }
  yield takeLatest([TOOL_LINKS__COLLAPSE_SANKEY], onCollapse);
}

// TODO: talk about this feature, I don't like it
//  I would prefer to show the expanded nodes in a detailed view. If that's not an option then,
//  the view mode selector should be disabled when forceOverview === true
function* checkForceOverviewOnExpand() {
  function* onExpand() {
    const { detailedView } = yield select(state => state.toolLinks);

    // if expanding, and if in detailed mode, toggle to overview mode
    if (detailedView) {
      yield put(selectView(false, true));
    }
  }
  yield takeLatest([TOOL_LINKS__EXPAND_SANKEY], onExpand);
}

export default function* toolLinksSaga() {
  const sagas = [
    fetchLinks,
    fetchToolColumns,
    fetchToolGeoColumnNodes,
    checkForceOverviewOnCollapse,
    checkForceOverviewOnExpand
  ];
  yield all(sagas.map(saga => fork(saga)));
}
