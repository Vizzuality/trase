import { put, call, cancelled, select } from 'redux-saga/effects';
import {
  GET_COLUMNS_URL,
  getURLFromParams,
  GET_FLOWS_URL,
  GET_ALL_NODES_URL
} from 'utils/getURLFromParams';
import { fetchWithCancel } from 'utils/saga-utils';
import { getSelectedColumnsIds, getSelectedResizeBy } from 'react-components/tool/tool.selectors';
import isEmpty from 'lodash/isEmpty';
import { NUM_NODES_DETAILED, NUM_NODES_EXPANDED, NUM_NODES_SUMMARY } from 'constants';
import { setToolColumns, setToolLinks, setToolNodes, setMoreToolNodes } from './tool-links.actions';

export function* getToolLinksData() {
  const state = yield select();
  const selectedColumnsIds = yield select(getSelectedColumnsIds);
  const selectedResizeBy = yield select(getSelectedResizeBy);
  const params = {
    context_id: state.app.selectedContext.id,
    start_year: state.app.selectedYears[0],
    end_year: state.app.selectedYears[1],
    include_columns: selectedColumnsIds.join(','),
    flow_quant: selectedResizeBy.name,
    locked_nodes: state.toolLinks.selectedNodesIds
  };
  const areNodesExpanded = !isEmpty(state.toolLinks.expandedNodesIds);

  if (state.toolLinks.detailedView === true) {
    params.n_nodes = NUM_NODES_DETAILED;
  } else if (areNodesExpanded) {
    params.n_nodes = NUM_NODES_EXPANDED;
  } else {
    params.n_nodes = NUM_NODES_SUMMARY;
  }

  if (state.toolLinks.selectedRecolorBy) {
    if (state.toolLinks.selectedRecolorBy.type === 'qual') {
      params.flow_qual = state.toolLinks.selectedRecolorBy.name;
    } else if (state.toolLinks.selectedRecolorBy.type === 'ind') {
      params.flow_ind = state.toolLinks.selectedRecolorBy.name;
    }
  }

  const selectedBiomeFilter = state.toolLinks.selectedBiomeFilter;
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
      if (NODE_ENV_DEV) console.error('Cancelled');
      if (source) {
        source.cancel();
      }
    }
  }
}

export function* getToolNodesByLink(selectedContext) {
  const {
    data: { links }
  } = yield select(state => state.toolLinks);
  const nodesIds = Array.from(new Set(Object.values(links).flatMap(link => link.path))).join(',');
  const params = { context_id: selectedContext.id, nodes_ids: nodesIds };
  const url = getURLFromParams(GET_ALL_NODES_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put(setToolNodes(data.data));
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

export function* getMoreToolNodesByLink(selectedContext) {
  const {
    data: { links, nodes }
  } = yield select(state => state.toolLinks);
  const nodesInLinkPaths = Object.values(links).flatMap(link => link.path);
  const existingNodes = new Set(Object.keys(nodes));
  const difference = new Set(nodesInLinkPaths.filter(x => !existingNodes.has(x)));

  // we only want to fetch the missing nodes
  const nodesIds = Array.from(difference).join(',');
  const params = { context_id: selectedContext.id, nodes_ids: nodesIds };
  const url = getURLFromParams(GET_ALL_NODES_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put(setMoreToolNodes(data.data));
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

export function* getToolGeoColumnNodes(selectedContext) {
  const selectedColumnsIds = yield select(getSelectedColumnsIds);

  // const geoColumnId = selectedColumnsIds.find(id => columns[id] && columns[id].isGeo);
  // TODO: this is not the best way to read the geoColumn,
  //  the backend should provide it within contexts.defaultColumns
  const geoColumnId = selectedColumnsIds[0];
  const params = { context_id: selectedContext.id, node_types_ids: geoColumnId };
  const url = getURLFromParams(GET_ALL_NODES_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put(setMoreToolNodes(data.data));
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
