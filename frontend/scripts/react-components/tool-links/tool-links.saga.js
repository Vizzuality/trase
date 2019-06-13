import { select, all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { SET_CONTEXT } from 'actions/app.actions';
import { setLoadingSpinner } from 'utils/saga-utils';
import {
  loadMapVectorData,
  SELECT_RECOLOR_BY,
  SELECT_RESIZE_BY,
  SELECT_BIOME_FILTER,
  SELECT_YEARS
} from 'react-components/tool/tool.actions';
import {
  TOOL_LINKS__SELECT_COLUMN,
  TOOL_LINKS__SELECT_VIEW,
  TOOL_LINKS__GET_COLUMNS,
  TOOL_LINKS__EXPAND_SANKEY,
  TOOL_LINKS__COLLAPSE_SANKEY,
  TOOL_LINKS__CLEAR_SANKEY,
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
      app: { selectedContext }
    } = state;
    yield put(setToolFlowsLoading(true));
    yield fork(getToolColumnsData, selectedContext);
    yield call(getToolLinksData);
    yield call(getToolNodesByLink, selectedContext);
    yield call(getToolGeoColumnNodes, selectedContext);

    // TODO: remove this call, just here to split the refactor in stages
    yield put(loadMapVectorData());

    yield fork(setLoadingSpinner, 150, setToolFlowsLoading(false));
  }
  yield takeLatest([TOOL_LINKS__GET_COLUMNS, SET_CONTEXT], performFetch);
}

function* fetchLinks() {
  function* performFetch(action) {
    const page = yield select(state => state.location.type);
    if (page !== 'tool') {
      return;
    }

    const { selectedContext } = yield select(state => state.app);
    const fetchAllNodes = action.type === TOOL_LINKS__SELECT_VIEW && action.payload.detailedView;
    yield put(setToolFlowsLoading(true));
    yield call(getToolLinksData);
    yield call(getMoreToolNodesByLink, selectedContext, fetchAllNodes);
    yield put(setToolFlowsLoading(false));
  }
  yield takeLatest(
    [
      SELECT_YEARS,
      TOOL_LINKS__SELECT_COLUMN,
      TOOL_LINKS__SELECT_VIEW,
      TOOL_LINKS__CLEAR_SANKEY,
      SELECT_RECOLOR_BY,
      SELECT_RESIZE_BY,
      SELECT_BIOME_FILTER,
      TOOL_LINKS__COLLAPSE_SANKEY,
      TOOL_LINKS__EXPAND_SANKEY
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
    checkForceOverviewOnCollapse,
    checkForceOverviewOnExpand
  ];
  yield all(sagas.map(saga => fork(saga)));
}
