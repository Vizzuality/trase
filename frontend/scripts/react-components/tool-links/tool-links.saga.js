import { select, all, call, fork, put, takeLatest, cancel } from 'redux-saga/effects';
import { SET_CONTEXT, SET_CONTEXTS, APP__GET_COLUMNS } from 'actions/app.actions';
import { setLoadingSpinner } from 'utils/saga-utils';
import { loadMapVectorData, SELECT_YEARS } from 'react-components/tool/tool.actions';
import { getSelectedContext } from 'reducers/app.selectors';
import {
  TOOL_LINKS__SET_SELECTED_NODES,
  TOOL_LINKS__SELECT_COLUMN,
  TOOL_LINKS__SELECT_VIEW,
  TOOL_LINKS__EXPAND_SANKEY,
  TOOL_LINKS__COLLAPSE_SANKEY,
  TOOL_LINKS__CLEAR_SANKEY,
  TOOL_LINKS__SET_NODES,
  TOOL_LINKS__SET_SELECTED_RESIZE_BY,
  TOOL_LINKS__SET_SELECTED_RECOLOR_BY,
  TOOL_LINKS__SET_SELECTED_BIOME_FILTER,
  TOOL_LINKS_RESET_SANKEY,
  setToolFlowsLoading,
  selectView
} from './tool-links.actions';
import {
  getToolColumnsData,
  getToolLinksData,
  getToolNodesByLink,
  getMissingLockedNodes,
  getToolGeoColumnNodes
} from './tool-links.fetch.saga';

function* fetchToolColumns() {
  function* findSelectedContext(location, contexts) {
    switch (location.type) {
      case 'profileNode': {
        const { contextId } = location.query;
        return contextId ? contexts.find(c => c.id === contextId) : null;
      }
      case 'dashboardElement': {
        if (!location.query) return null;
        const { selectedCountryId, selectedCommodityId } = location.query;
        if (!selectedCountryId || !selectedCommodityId) return null;
        return contexts.find(
          c => c.countryId === selectedCountryId && c.commodityId === selectedCommodityId
        );
      }
      case 'explore':
      case 'tool':
        return yield select(getSelectedContext);
      default:
        return null;
    }
  }

  function* performFetch() {
    const {
      toolLinks,
      location,
      app: { contexts }
    } = yield select();
    const selectedContext = yield findSelectedContext(location, contexts);
    if (selectedContext === null) return;

    const task = yield fork(setLoadingSpinner, 750, setToolFlowsLoading(true));
    yield fork(getToolColumnsData, selectedContext);
    yield fork(getToolGeoColumnNodes, selectedContext);
    if (location.type === 'tool') {
      yield call(getToolLinksData);
      yield call(getToolNodesByLink, selectedContext, {
        fetchAllNodes: toolLinks.detailedView
      });

      // TODO: remove this call, just here to split the refactor in stages
      yield put(loadMapVectorData());
    }

    if (task.isRunning()) {
      yield cancel(task);
    } else {
      yield fork(setLoadingSpinner, 350, setToolFlowsLoading(false));
    }
  }
  yield takeLatest([SET_CONTEXTS, APP__GET_COLUMNS, SET_CONTEXT], performFetch);
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
      TOOL_LINKS__CLEAR_SANKEY,
      TOOL_LINKS__SELECT_COLUMN,
      TOOL_LINKS__EXPAND_SANKEY,
      TOOL_LINKS__COLLAPSE_SANKEY,
      TOOL_LINKS__SET_SELECTED_NODES,
      TOOL_LINKS__SET_SELECTED_RESIZE_BY,
      TOOL_LINKS__SET_SELECTED_RECOLOR_BY,
      TOOL_LINKS__SET_SELECTED_BIOME_FILTER
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
    fetchToolColumns,
    fetchMissingLockedNodes,
    fetchToolGeoColumnNodes,
    checkForceOverviewOnCollapse,
    checkForceOverviewOnExpand
  ];
  yield all(sagas.map(saga => fork(saga)));
}
