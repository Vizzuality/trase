import { put, call, cancelled, select } from 'redux-saga/effects';
import {
  GET_COLUMNS_URL,
  getURLFromParams,
  GET_FLOWS_URL,
  GET_ALL_NODES_URL,
  GET_DASHBOARD_PARAMETRISED_CHARTS_URL
} from 'utils/getURLFromParams';
import { fetchWithCancel } from 'utils/saga-utils';
import { getSelectedColumnsIds } from 'react-components/tool/tool.selectors';
import { NUM_NODES_DETAILED, NUM_NODES_EXPANDED, NUM_NODES_SUMMARY } from 'constants';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';
import { getSelectedGeoColumn } from 'react-components/tool-layers/tool-layers.selectors';
import {
  getSelectedResizeBy,
  getSelectedRecolorBy,
  getSelectedColumnFilterNode
} from 'react-components/tool-links/tool-links.selectors';
import {
  getExpandedNodesIds,
  getExpandedAndExcludedNodes
} from 'react-components/nodes-panel/nodes-panel.selectors';
import { getPanelParams } from 'react-components/nodes-panel/nodes-panel.fetch.saga';
import pickBy from 'lodash/pickBy';
import {
  setToolCharts,
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
  const selectedColumnFilterNode = yield select(getSelectedColumnFilterNode);
  const { expandedNodesIds, excludedNodesIds } = yield select(getExpandedAndExcludedNodes);
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
  const areNodesExpanded = expandedNodesIds.length > 0;
  const areNodesExcluded = excludedNodesIds.length > 0;

  if (state.toolLinks.detailedView === true) {
    params.n_nodes = NUM_NODES_DETAILED;
  } else if (areNodesExpanded || areNodesExcluded) {
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

  if (selectedColumnFilterNode && selectedColumnFilterNode.id) {
    // TODO: Change this to params.extra_column_node_id
    params.biome_filter_id = selectedColumnFilterNode.nodeId;
  }

  if (areNodesExpanded) {
    params.selected_nodes = expandedNodesIds.join(',');
  }

  if (areNodesExcluded) {
    params.excluded_nodes = excludedNodesIds.join(',');
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
        // eslint-disable-next-line
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
  if (
    (params.nodes_ids && params.nodes_ids.length === 0) ||
    (params.node_types_ids && params.node_types_ids.length === 0)
  ) {
    console.error(new Error('Race condition detected! Will fetch all nodes.'));
  }
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
  const geoColumn = yield select(getSelectedGeoColumn);
  const params = { context_id: selectedContext.id, node_types_ids: geoColumn?.id };
  if (!params.node_types_ids) {
    return;
  }
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
    data: { nodes }
  } = yield select(state => state.toolLinks);
  const expandedNodesIds = yield select(getExpandedNodesIds);
  const selectedContext = yield select(getSelectedContext);
  const lockedNodes = new Set([...selectedNodesIds, ...expandedNodesIds]);
  const nodesIds = Array.from(lockedNodes).filter(lockedNode => !nodes[lockedNode]);

  if (nodesIds.length === 0) {
    if (NODE_ENV_DEV) {
      // eslint-disable-next-line
      console.log('No missing nodes.');
    }
    return;
  }
  if (NODE_ENV_DEV) {
    // eslint-disable-next-line
    console.log('Fetching missing nodes: ', nodesIds);
  }

  const params = {
    context_id: selectedContext.id,
    nodes_ids: nodesIds.join(',')
  };
  if (params.nodes_ids.length === 0) {
    console.error(new Error('Race condition detected! Will fetch all nodes.'));
  }
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

export function* fetchToolCharts() {
  const selectedResizeBy = yield select(getSelectedResizeBy);
  const selectedRecolorBy = yield select(getSelectedRecolorBy);
  const selectedYears = yield select(getSelectedYears);

  const {
    countries_ids: countryId,
    commodities_ids: commodityId,
    ...options
  } = yield getPanelParams(null, { isOverview: true });

  const params = pickBy(
    {
      ...options,
      country_id: countryId,
      commodity_id: commodityId,
      cont_attribute_id: selectedResizeBy?.attributeId,
      ncont_attribute_id: selectedRecolorBy?.attributeId,
      start_year: selectedYears[0],
      end_year: selectedYears[1]
    },
    x => !!x
  );

  if (!params.commodity_id || !params.country_id || !params.start_year || !params.end_year) {
    return;
  }
  const url = getURLFromParams(GET_DASHBOARD_PARAMETRISED_CHARTS_URL, params);

  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put(setToolCharts(data));
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) {
        console.error('Cancelled', params);
      }
      if (source) {
        source.cancel();
      }
    }
  }
}
