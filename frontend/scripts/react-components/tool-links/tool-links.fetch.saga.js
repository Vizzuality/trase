import { put, call, cancelled, select } from 'redux-saga/effects';
import {
  GET_COLUMNS_URL,
  getURLFromParams,
  GET_FLOWS_URL,
  GET_ALL_NODES_URL
} from 'utils/getURLFromParams';
import { fetchWithCancel } from 'utils/saga-utils';
import { getSelectedColumnsIds } from 'react-components/tool/tool.selectors';
import { NUM_NODES_DETAILED, NUM_NODES_EXPANDED, NUM_NODES_SUMMARY } from 'constants';
import { getSelectedContext, getSelectedYears } from 'reducers/app.selectors';
import {
  getSelectedResizeBy,
  getSelectedRecolorBy,
  getSelectedBiomeFilter
} from 'react-components/tool-links/tool-links.selectors';
import {
  setToolColumns,
  setToolLinks,
  setToolNodes,
  setNoLinksFound,
  setMissingLockedNodes
} from './tool-links.actions';

export function* getToolLinksData() {
  const state = yield select();
  const selectedYears = yield select(getSelectedYears);
  const selectedContext = yield select(getSelectedContext);
  const selectedColumnsIds = yield select(getSelectedColumnsIds);
  const selectedResizeBy = yield select(getSelectedResizeBy);
  const selectedRecolorBy = yield select(getSelectedRecolorBy);
  const selectedBiomeFilter = yield select(getSelectedBiomeFilter);
  if (!selectedResizeBy) {
    return;
  }
  const params = {
    context_id: selectedContext.id,
    start_year: selectedYears[0],
    end_year: selectedYears[1],
    include_columns: selectedColumnsIds.join(','),
    cont_attribute_id: selectedResizeBy.attributeId,
    locked_nodes: state.toolLinks.selectedNodesIds
  };
  const areNodesExpanded = state.toolLinks.expandedNodesIds.length > 0;

  if (state.toolLinks.detailedView === true) {
    params.n_nodes = NUM_NODES_DETAILED;
  } else if (areNodesExpanded) {
    params.n_nodes = NUM_NODES_EXPANDED;
  } else {
    params.n_nodes = NUM_NODES_SUMMARY;
  }

  if (selectedRecolorBy) {
    if (selectedRecolorBy.type === 'qual') {
      params.ncont_attribute_id = selectedRecolorBy.attributeId;
    } else if (selectedRecolorBy.type === 'ind') {
      params.ncont_attribute_id = selectedRecolorBy.attributeId;
    }
  }

  if (selectedBiomeFilter && selectedBiomeFilter.name && selectedBiomeFilter.name !== 'none') {
    params.biome_filter_id = selectedBiomeFilter.nodeId;
  }

  if (areNodesExpanded) {
    params.selected_nodes = state.toolLinks.expandedNodesIds.join(',');
  }

  const url = getURLFromParams(GET_FLOWS_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);

  try {
    const { data } = yield call(fetchPromise);
    yield put(setToolLinks(data.data, data.include));
  } catch (e) {
    if (e.response?.data?.error === 'No flows found') {
      console.error('Error', e.response.data);
      yield put(setNoLinksFound(true));
    }
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

export function* getToolColumnsData(selectedContext) {
  const params = { context_id: selectedContext.id };
  const columnsUrl = getURLFromParams(GET_COLUMNS_URL, params);
  const { source, fetchPromise } = fetchWithCancel(columnsUrl);
  try {
    const { data: columnsResponse } = yield call(fetchPromise);
    yield put(setToolColumns(columnsResponse.data));
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

export function* getToolNodesByLink(selectedContext, { fetchAllNodes } = {}) {
  let nodesIds;
  let nodeTypesIds;
  if (!fetchAllNodes) {
    const {
      data: { links, nodes }
    } = yield select(state => state.toolLinks);
    const nodesInLinkPaths = (links || []).flatMap(link => link.path);
    const existingNodes = new Set(Object.keys(nodes || {}));
    const difference = new Set(nodesInLinkPaths.filter(x => !existingNodes.has(`${x}`)));

    if (difference.size === 0) {
      if (NODE_ENV_DEV) {
        console.log('All necessary nodes have been downloaded');
      }
      return;
    }
    // we only want to fetch the missing nodes
    nodesIds = Array.from(difference).join(',');
  } else {
    const selectedColumnsIds = yield select(getSelectedColumnsIds);
    nodeTypesIds = selectedColumnsIds.join(',');
  }

  const params = {
    context_id: selectedContext.id,
    nodes_ids: nodesIds,
    node_types_ids: nodeTypesIds
  };
  const url = getURLFromParams(GET_ALL_NODES_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put(setToolNodes(data.data));
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

export function* getToolGeoColumnNodes(selectedContext) {
  const selectedColumnsIds = yield select(getSelectedColumnsIds);

  // TODO: this is not the best way to read the geoColumn,
  //  the backend should provide it within contexts.defaultColumns
  const geoColumnId = selectedColumnsIds[0];
  const params = { context_id: selectedContext.id, node_types_ids: geoColumnId };
  const url = getURLFromParams(GET_ALL_NODES_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put(setToolNodes(data.data));
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

export function* getMissingLockedNodes() {
  const {
    selectedNodesIds,
    expandedNodesIds,
    data: { nodes }
  } = yield select(state => state.toolLinks);
  const selectedContext = yield select(getSelectedContext);
  const lockedNodes = new Set([...selectedNodesIds, ...expandedNodesIds]);
  const nodesIds = Array.from(lockedNodes).filter(lockedNode => !nodes[lockedNode]);

  if (nodesIds.length === 0) {
    if (NODE_ENV_DEV) {
      console.log('No missing nodes.');
    }
    return;
  }
  if (NODE_ENV_DEV) {
    console.log('Fetching missing nodes: ', nodesIds);
  }

  const params = {
    context_id: selectedContext.id,
    nodes_ids: nodesIds.join(',')
  };
  const url = getURLFromParams(GET_ALL_NODES_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put(setMissingLockedNodes(data.data));
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
