/* eslint-disable no-use-before-define */
import axios from 'axios';
import { CARTO_NAMED_MAPS_BASE_URL } from 'constants';
import { GET_NODE_ATTRIBUTES_URL, getURLFromParams } from 'utils/getURLFromParams';
import contextLayersCarto from 'named-maps/tool_named_maps_carto';
import getNodeIdFromGeoId from 'utils/getNodeIdFromGeoId';
import compact from 'lodash/compact';
import { getVisibleNodes } from 'react-components/tool-links/tool-links.selectors';
import {
  getSelectedGeoColumn,
  getAllSelectedGeoColumns,
  getSelectedMapDimensionsUids
} from 'react-components/tool-layers/tool-layers.selectors';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';

import {
  expandSankey,
  selectNodes,
  highlightNode
} from 'react-components/tool-links/tool-links.actions';

export const SET_NODE_ATTRIBUTES = 'SET_NODE_ATTRIBUTES';
export const SELECT_YEARS = 'SELECT_YEARS';
export const GET_MAP_VECTOR_DATA = 'GET_MAP_VECTOR_DATA';
export const GET_CONTEXT_LAYERS = 'GET_CONTEXT_LAYERS';
export const SELECT_UNIT_LAYERS = 'SELECT_UNIT_LAYERS';
export const SELECT_CONTEXTUAL_LAYERS = 'SELECT_CONTEXTUAL_LAYERS';
export const SELECT_LOGISTIC_LAYERS = 'SELECT_LOGISTIC_LAYERS';
export const SELECT_BASEMAP = 'SELECT_BASEMAP';
export const CHANGE_LAYOUT = 'CHANGE_LAYOUT';
export const SET_SANKEY_SIZE = 'SET_SANKEY_SIZE';
export const TOGGLE_MAP_DIMENSION = 'TOGGLE_MAP_DIMENSION';
export const RESET_MAP_DIMENSIONS = 'RESET_MAP_DIMENSIONS';

export function setMapContextLayers(contextualLayers) {
  return (dispatch, getState) => {
    const mapContextualLayers = contextualLayers.map(layer => {
      const contextLayer = Object.assign({}, layer);
      if (!NAMED_MAPS_ENV || !contextLayersCarto[NAMED_MAPS_ENV]) {
        console.error('Invalid or missing NAMED_MAPS_ENV is preventing contextual layer loading.');
        return {};
      }
      const cartoIds = contextLayersCarto[NAMED_MAPS_ENV][layer.identifier];
      // TODO: implement multi-year support
      const cartoData = layer.cartoLayers[0];
      if (cartoData && !cartoData.rasterUrl && cartoIds) {
        contextLayer.cartoURL = `${CARTO_NAMED_MAPS_BASE_URL}${cartoIds.uid}/jsonp?callback=cb`;
        contextLayer.layergroupid = cartoIds.layergroupid;
      }
      return contextLayer;
    });

    Promise.all(
      mapContextualLayers
        .filter(l => l.cartoURL)
        .map(l => axios.get(l.cartoURL).then(resp => resp.data))
    ).then(() => {
      // we actually don't care about layergroupids because we already have them pregenerated
      // this is just about reinstanciating named maps, you know, because CARTO
      dispatch({
        type: GET_CONTEXT_LAYERS,
        payload: { mapContextualLayers }
      });

      if (typeof contextualLayers !== 'undefined' && contextualLayers.length) {
        dispatch({
          type: GET_CONTEXT_LAYERS,
          payload: { mapContextualLayers }
        });

        const { selectedMapContextualLayers } = getState().toolLayers;

        if (selectedMapContextualLayers && selectedMapContextualLayers.length) {
          dispatch({
            type: SELECT_CONTEXTUAL_LAYERS,
            payload: { contextualLayers: selectedMapContextualLayers }
          });
        }
      }
    });
  };
}

export function selectNodeFromGeoId(geoId) {
  return (dispatch, getState) => {
    const state = getState();
    const allSelectedGeoColumns = getAllSelectedGeoColumns(state);
    const selectedColumnsId = allSelectedGeoColumns && allSelectedGeoColumns.map(c => c.id);
    const nodes = getState().toolLinks.data.nodes;
    const nodeId = getNodeIdFromGeoId(geoId, nodes, selectedColumnsId);

    // node not in visible Nodes ---> expand node (same behavior as search)
    if (nodeId !== null) {
      dispatch(selectExpandedNode(nodeId));
    }
  };
}

function selectExpandedNode(param) {
  const ids = Array.isArray(param) ? param : [param];
  return (dispatch, getState) => {
    const state = getState();
    const visibleNodes = getVisibleNodes(state);
    const visibleNodesById =
      visibleNodes?.reduce((acc, next) => ({ ...acc, [next.id]: true }), {}) || {};
    const hasInvisibleNodes = ids.some(id => !visibleNodesById[id]);

    if (hasInvisibleNodes) {
      dispatch(selectNodes(ids));
      dispatch(expandSankey());
    } else {
      dispatch(selectNodes(ids));
    }
  };
}

export function highlightNodeFromGeoId(geoId, coordinates) {
  return (dispatch, getState) => {
    const state = getState();
    const selectedGeoColumn = getSelectedGeoColumn(state);
    const {
      data: { nodes },
      highlightedNodeId
    } = state.toolLinks;
    const selectedColumnsId = selectedGeoColumn && [selectedGeoColumn.id];
    const nodeId = getNodeIdFromGeoId(geoId, nodes, selectedColumnsId);
    if (nodeId === null) {
      if (highlightedNodeId) {
        dispatch(highlightNode(null));
      }
    } else {
      dispatch(highlightNode(nodeId, coordinates));
    }
  };
}

export function navigateToProfile(nodeId, contextId) {
  return (dispatch, getState) => {
    const node = getState().toolLinks.data.nodes[nodeId];
    dispatch({
      type: 'profile',
      payload: { query: { nodeId, contextId }, profileType: node.profileType }
    });
  };
}

export function toggleMapDimension(uid) {
  return (dispatch, getState) => {
    const state = getState();
    const selectedMapDimensions = getSelectedMapDimensionsUids(state);
    dispatch({
      type: TOGGLE_MAP_DIMENSION,
      payload: {
        uid,
        selectedMapDimensions
      }
    });
  };
}

export function resetSelectedMapDimensions() {
  return dispatch => {
    dispatch({
      type: RESET_MAP_DIMENSIONS
    });
  };
}

export function selectUnitLayers(uids) {
  return dispatch => {
    dispatch({
      type: SELECT_UNIT_LAYERS,
      payload: {
        uids
      }
    });

    dispatch(loadMapChoropleth());
  };
}

export function loadMapChoropleth() {
  return (dispatch, getState) => {
    const state = getState();

    const uids = getSelectedMapDimensionsUids(state);
    if (new Set(uids.filter(Boolean)).size === 0) {
      dispatch({
        type: SET_NODE_ATTRIBUTES,
        payload: { data: [] }
      });

      return;
    }

    const selectedMapDimensions = compact(uids).map(
      uid => state.toolLayers.data.mapDimensions[uid]
    );

    const selectedContext = getSelectedContext(state);
    const selectedYears = getSelectedYears(state);

    const params = {
      context_id: selectedContext.id,
      start_year: selectedYears[0],
      end_year: selectedYears[1],
      layer_ids: selectedMapDimensions.map(layer => layer.id)
    };

    const getNodesURL = getURLFromParams(GET_NODE_ATTRIBUTES_URL, params);

    axios
      .get(getNodesURL)
      .then(response => response.data)
      .then(payload => {
        dispatch({
          type: SET_NODE_ATTRIBUTES,
          payload
        });
      });
  };
}

export function selectContextualLayers(contextualLayers) {
  return {
    type: SELECT_CONTEXTUAL_LAYERS,
    payload: { contextualLayers }
  };
}

export function selectLogisticLayers(logisticLayers) {
  return {
    type: SELECT_LOGISTIC_LAYERS,
    payload: { logisticLayers }
  };
}

export function selectBasemap(selectedBasemap) {
  return {
    type: SELECT_BASEMAP,
    payload: { selectedBasemap }
  };
}
