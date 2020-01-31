import { select, all, call, fork, put, takeLatest, cancel } from 'redux-saga/effects';
import { SET_CONTEXTS, SET_CONTEXT } from 'app/app.actions';
import { setLoadingSpinner } from 'utils/saga-utils';
import { loadMapVectorData, SELECT_YEARS } from 'react-components/tool/tool.actions';
import { getSelectedContext } from 'app/app.selectors';
import { nodesPanelActions } from 'react-components/nodes-panel/nodes-panel.register';
import {
  TOOL_LINKS__SWITCH_TOOL,
  TOOL_LINKS__SET_SELECTED_NODES,
  TOOL_LINKS__SELECT_COLUMN,
  TOOL_LINKS__SELECT_VIEW,
  TOOL_LINKS__GET_COLUMNS,
  TOOL_LINKS__EXPAND_SANKEY,
  TOOL_LINKS__COLLAPSE_SANKEY,
  TOOL_LINKS__CLEAR_SANKEY,
  TOOL_LINKS__SET_NODES,
  TOOL_LINKS__SET_SELECTED_RESIZE_BY,
  TOOL_LINKS__SET_SELECTED_RECOLOR_BY,
  TOOL_LINKS__SET_SELECTED_BIOME_FILTER,
  TOOL_LINKS__CHANGE_EXTRA_COLUMN,
  TOOL_LINKS_RESET_SANKEY,
  setToolFlowsLoading,
  selectView,
  setToolChartsLoading
} from './tool-links.actions';
import {
  getToolColumnsData,
  getToolLinksData,
  getToolNodesByLink,
  getMissingLockedNodes,
  getToolGeoColumnNodes,
  fetchToolCharts
} from './tool-links.fetch.saga';

function* fetchToolInitialData() {
  function* performFetch() {
    const state = yield select();
    const {
      location: {
        type: page,
        payload: { section }
      }
    } = state;
    const selectedContext = yield select(getSelectedContext);

    if (page !== 'tool' || selectedContext === null) {
      return;
    }
    const task = yield fork(setLoadingSpinner, 750, setToolFlowsLoading(true));
    yield call(getToolColumnsData, selectedContext);

    if (section === 'data-view') {
      yield fork(fetchToolCharts);
    } else {
      yield call(getToolLinksData);
      yield fork(getToolNodesByLink, selectedContext, {
        fetchAllNodes: state.toolLinks.detailedView
      });
    }

    yield call(getToolGeoColumnNodes, selectedContext);

    // TODO: remove this when mapbox comes
    yield put(loadMapVectorData());

    if (task.isRunning()) {
      yield cancel(task);
    } else {
      yield fork(setLoadingSpinner, 350, setToolFlowsLoading(false));
    }
  }
  yield takeLatest(
    [
      SET_CONTEXTS,
      TOOL_LINKS__GET_COLUMNS,
      SET_CONTEXT,
      nodesPanelActions.NODES_PANEL__SAVE,
      TOOL_LINKS__COLLAPSE_SANKEY
    ],
    performFetch
  );
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
    const {
      type: page,
      payload: { section }
    } = yield select(state => state.location);

    if (page !== 'tool' || section === 'data-view') {
      return;
    }

    const { selectedNodesIds } = yield select(state => state.toolLinks);

    if (action.type === TOOL_LINKS__SET_SELECTED_NODES && selectedNodesIds.length !== 0) {
      return;
    }

    const selectedContext = yield select(getSelectedContext);
    const fetchAllNodes = action.type === TOOL_LINKS__SELECT_VIEW && action.payload.detailedView;
    const task = yield fork(setLoadingSpinner, 2000, setToolFlowsLoading(true));
    yield call(getToolLinksData);
    yield call(getToolNodesByLink, selectedContext, { fetchAllNodes });
    if (task.isRunning()) {
      yield cancel(task);
    }
    yield fork(setLoadingSpinner, 350, setToolFlowsLoading(false));
  }
  yield takeLatest(
    [
      SELECT_YEARS,
      TOOL_LINKS_RESET_SANKEY,
      TOOL_LINKS__SELECT_VIEW,
      TOOL_LINKS__SWITCH_TOOL,
      TOOL_LINKS__CLEAR_SANKEY,
      TOOL_LINKS__SELECT_COLUMN,
      TOOL_LINKS__SET_SELECTED_NODES,
      TOOL_LINKS__SET_SELECTED_RESIZE_BY,
      TOOL_LINKS__SET_SELECTED_RECOLOR_BY,
      TOOL_LINKS__SET_SELECTED_BIOME_FILTER,
      TOOL_LINKS__CHANGE_EXTRA_COLUMN,
      nodesPanelActions.NODES_PANEL__SYNC_NODES_WITH_SANKEY
    ],
    performFetch
  );
}

function* fetchCharts() {
  function* performFetch() {
    const {
      type: page,
      payload: { section }
    } = yield select(state => state.location);

    if (page !== 'tool' || section !== 'data-view') {
      return;
    }
    const task = yield fork(setLoadingSpinner, 2000, setToolChartsLoading(true));
    yield fork(fetchToolCharts);
    if (task.isRunning()) {
      yield cancel(task);
    }
    yield fork(setLoadingSpinner, 350, setToolChartsLoading(false));
  }

  yield takeLatest(
    [
      SELECT_YEARS,
      TOOL_LINKS_RESET_SANKEY,
      TOOL_LINKS__SWITCH_TOOL,
      TOOL_LINKS__SET_SELECTED_NODES,
      TOOL_LINKS__SET_SELECTED_RESIZE_BY,
      TOOL_LINKS__SET_SELECTED_RECOLOR_BY,
      nodesPanelActions.NODES_PANEL__SYNC_NODES_WITH_SANKEY
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

function* fetchMissingLockedNodes() {
  function* performFetch() {
    yield fork(getMissingLockedNodes);
  }

  yield takeLatest([TOOL_LINKS__SET_NODES], performFetch);
}

export default function* toolLinksSaga() {
  const sagas = [
    fetchLinks,
    fetchCharts,
    fetchToolInitialData,
    fetchMissingLockedNodes,
    fetchToolGeoColumnNodes,
    checkForceOverviewOnCollapse,
    checkForceOverviewOnExpand
  ];
  yield all(sagas.map(saga => fork(saga)));
}
