/* eslint-disable no-use-before-define */
import { feature as topojsonFeature } from 'topojson';
import { CARTO_NAMED_MAPS_BASE_URL } from 'constants';
import { GET_NODE_ATTRIBUTES_URL, getURLFromParams } from 'utils/getURLFromParams';
import contextLayersCarto from 'named-maps/tool_named_maps_carto';
import getNodeIdFromGeoId from 'actions/helpers/getNodeIdFromGeoId';
import setGeoJSONMeta from 'actions/helpers/setGeoJSONMeta';
import intesection from 'lodash/intersection';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import { getSelectedColumnsIds } from 'react-components/tool/tool.selectors';
import { getVisibleNodes } from 'react-components/tool-links/tool-links.selectors';
import { getSelectedMapDimensionsUids } from 'react-components/tool-layers/tool-layers.selectors';
import { getSelectedContext, getSelectedYears } from 'reducers/app.selectors';
import pSettle from 'p-settle';

import {
  selectView,
  collapseSankey,
  expandSankey,
  selectColumn,
  selectNodes,
  highlightNode,
  clearSankey
} from 'react-components/tool-links/tool-links.actions';

export const SET_MAP_LOADING_STATE = 'SET_MAP_LOADING_STATE';
export const SET_NODE_ATTRIBUTES = 'SET_NODE_ATTRIBUTES';
export const SELECT_BIOME_FILTER = 'SELECT_BIOME_FILTER';
export const SELECT_YEARS = 'SELECT_YEARS';
export const SELECT_RESIZE_BY = 'SELECT_RESIZE_BY';
export const SELECT_RECOLOR_BY = 'SELECT_RECOLOR_BY';
export const GET_MAP_VECTOR_DATA = 'GET_MAP_VECTOR_DATA';
export const GET_CONTEXT_LAYERS = 'GET_CONTEXT_LAYERS';
export const TOGGLE_MAP_DIMENSION = 'TOGGLE_MAP_DIMENSION';
export const SELECT_CONTEXTUAL_LAYERS = 'SELECT_CONTEXTUAL_LAYERS';
export const SELECT_BASEMAP = 'SELECT_BASEMAP';
export const TOGGLE_MAP = 'TOGGLE_MAP';
export const SAVE_MAP_VIEW = 'SAVE_MAP_VIEW';
export const SHOW_LINKS_ERROR = 'SHOW_LINKS_ERROR';
export const RESET_TOOL_STATE = 'RESET_TOOL_STATE';
export const SET_SELECTED_NODES_BY_SEARCH = 'SET_SELECTED_NODES_BY_SEARCH';

const _setRecolorByAction = (recolorBy, state) => {
  let selectedRecolorBy;
  if (recolorBy.value === 'none') {
    selectedRecolorBy = null;
  } else {
    const selectedContext = getSelectedContext(state);
    selectedRecolorBy = selectedContext.recolorBy.find(
      contextRecolorBy => contextRecolorBy.name === recolorBy.name
    );
  }

  return {
    type: SELECT_RECOLOR_BY,
    payload: selectedRecolorBy
  };
};

const _setResizeByAction = (resizeByName, state) => {
  let selectedResizeBy;
  if (resizeByName === 'none') {
    selectedResizeBy = { name: 'none' };
  } else {
    const selectedContext = getSelectedContext(state);
    selectedResizeBy = selectedContext.resizeBy.find(
      contextResizeBy => contextResizeBy.name === resizeByName
    );
  }

  return {
    type: SELECT_RESIZE_BY,
    payload: selectedResizeBy
  };
};

// TODO: test to see when this is needed.
// Resets sankey's params that may lead to no flows being returned from the API
export function resetSankey() {
  return (dispatch, getState) => {
    const state = getState();
    const selectedContext = getSelectedContext(state);
    const { columns, expandedNodesIds } = state.toolLinks;
    const { contexts } = state.app;
    const areNodesExpanded = !isEmpty(expandedNodesIds);
    const currentContext = contexts.find(context => context.id === selectedContext.id);
    const defaultColumns = columns ? Object.values(columns).filter(column => column.isDefault) : [];
    const defaultResizeBy =
      currentContext && currentContext.resizeBy.find(resizeBy => resizeBy.isDefault);
    const defaultRecolorBy =
      currentContext && currentContext.recolorBy.find(recolorBy => recolorBy.isDefault);

    dispatch({
      type: SELECT_YEARS,
      payload: { years: [currentContext.defaultYear, currentContext.defaultYear] }
    });

    defaultColumns.forEach(defaultColumn => {
      dispatch(selectColumn(defaultColumn.group, defaultColumn.id));
    });

    if (areNodesExpanded) {
      dispatch(collapseSankey());
    }

    dispatch(selectView(false, true));

    if (defaultRecolorBy) {
      dispatch(_setRecolorByAction({ value: defaultRecolorBy[0].name }, state));
    } else {
      dispatch(_setRecolorByAction({ value: 'none' }, state));
    }

    dispatch(_setResizeByAction(defaultResizeBy.name, state));

    dispatch(clearSankey());
  };
}

export function selectBiomeFilter(biomeFilterName) {
  return (dispatch, getState) => {
    let selectedBiomeFilter;
    if (biomeFilterName === 'none') {
      selectedBiomeFilter = { value: 'none', name: 'none' };
    } else {
      const state = getState();
      const selectedContext = getSelectedContext(state);
      const { toolLinks } = state;
      selectedBiomeFilter = Object.assign(
        {},
        selectedContext.filterBy[0].nodes.find(filterBy => filterBy.name === biomeFilterName)
      );
      const node = toolLinks.data.nodes[selectedBiomeFilter.nodeId];
      selectedBiomeFilter.geoId = node && node.geoId;
    }

    dispatch({
      type: SELECT_BIOME_FILTER,
      payload: selectedBiomeFilter
    });
  };
}

export function selectResizeBy(resizeByName) {
  return (dispatch, getState) => {
    let selectedResizeBy;
    if (resizeByName === 'none') {
      selectedResizeBy = { name: 'none' };
    } else {
      const selectedContext = getSelectedContext(getState());
      selectedResizeBy = selectedContext.resizeBy.find(
        contextResizeBy => contextResizeBy.name === resizeByName
      );
    }

    dispatch({
      type: SELECT_RESIZE_BY,
      payload: selectedResizeBy
    });
  };
}

export function selectRecolorBy(recolorBy) {
  return (dispatch, getState) => {
    let selectedRecolorBy;
    if (recolorBy.value === 'none') {
      selectedRecolorBy = null;
    } else {
      const selectedContext = getSelectedContext(getState());
      selectedRecolorBy = selectedContext.recolorBy.find(
        contextRecolorBy => contextRecolorBy.name === recolorBy.name
      );
    }

    dispatch({
      type: SELECT_RECOLOR_BY,
      payload: selectedRecolorBy
    });
  };
}

export function loadMapVectorData() {
  return (dispatch, getState) => {
    const { columns } = getState().toolLinks.data;
    const geoColumns = columns
      ? Object.values(columns).filter(column => column.isGeo === true)
      : [];

    const vectorMaps = geoColumns.map(geoColumn => {
      const vectorData = {
        id: geoColumn.id,
        name: geoColumn.name,
        useGeometryFromColumnId: geoColumn.useGeometryFromColumnId
      };
      if (geoColumn.useGeometryFromColumnId === undefined) {
        const selectedContext = getSelectedContext(getState());
        const countryName = selectedContext.countryName;
        const vectorLayerURL = `vector_layers/${countryName}_${geoColumn.name.replace(
          / /g,
          '_'
        )}.topo.json`;
        return fetch(vectorLayerURL)
          .then(res => res.json())
          .then(topoJSON => {
            const key = Object.keys(topoJSON.objects)[0];
            const geoJSON = topojsonFeature(topoJSON, topoJSON.objects[key]);
            setGeoJSONMeta(
              geoJSON,
              getState().toolLinks.data.nodes,
              getState().toolLinks.data.nodesByColumnGeoId,
              geoColumn.id
            );
            return {
              geoJSON,
              ...vectorData
            };
          })
          .catch(() => Promise.reject(vectorLayerURL));
      }
      return Promise.resolve(vectorData);
    });

    pSettle(vectorMaps).then(results => {
      const mapVectorData = results
        .map(res => {
          if (res.isFulfilled && !res.isRejected) {
            return {
              ...res.value,
              isPoint:
                !!res.value.geoJSON &&
                !!res.value.geoJSON.features.length &&
                res.value.geoJSON.features[0].geometry.type === 'Point'
            };
          }
          console.warn('missing vector layer file', res.reason);
          return null;
        })
        .filter(item => item !== null);
      dispatch({
        type: GET_MAP_VECTOR_DATA,
        mapVectorData
      });
      dispatch(loadMapChoropleth());
    });
  };
}

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
      if (!cartoData.rasterUrl && cartoIds) {
        contextLayer.cartoURL = `${CARTO_NAMED_MAPS_BASE_URL}${cartoIds.uid}/jsonp?callback=cb`;
        contextLayer.layergroupid = cartoIds.layergroupid;
      }
      return contextLayer;
    });

    Promise.all(
      mapContextualLayers
        .filter(l => l.cartoURL)
        .map(l => fetch(l.cartoURL).then(resp => resp.text()))
    ).then(() => {
      // we actually don't care about layergroupids because we already have them pregenerated
      // this is just about reinstanciating named maps, you know, because CARTO
      dispatch({
        type: GET_CONTEXT_LAYERS,
        mapContextualLayers
      });

      if (typeof contextualLayers !== 'undefined' && contextualLayers.length) {
        dispatch({
          type: GET_CONTEXT_LAYERS,
          mapContextualLayers
        });

        const { selectedMapContextualLayers } = getState().toolLayers;

        if (selectedMapContextualLayers && selectedMapContextualLayers.length) {
          dispatch({
            type: SELECT_CONTEXTUAL_LAYERS,
            contextualLayers: selectedMapContextualLayers
          });
        }
      }
    });
  };
}

export function selectNodeFromGeoId(geoId) {
  return (dispatch, getState) => {
    const state = getState();
    const selectedColumnsIds = getSelectedColumnsIds(state);
    const nodeId = getNodeIdFromGeoId(
      geoId,
      getState().toolLinks.data.nodes,
      selectedColumnsIds[0]
    );

    // node not in visible Nodes ---> expand node (same behavior as search)
    if (nodeId !== null) {
      dispatch(selectExpandedNode(nodeId));
    }
  };
}

export function selectExpandedNode(param) {
  const ids = Array.isArray(param) ? param : [param];
  return (dispatch, getState) => {
    const state = getState();
    const { toolLinks } = state;
    const visibleNodes = getVisibleNodes(state);
    const visibleNodesById = visibleNodes.reduce((acc, next) => ({ ...acc, [next.id]: true }), {});
    const hasInvisibleNodes = ids.some(id => !visibleNodesById[id]);

    if (
      toolLinks.selectedNodesIds.length === ids.length &&
      intesection(toolLinks.selectedNodesIds, ids).length === ids.length
    ) {
      dispatch(clearSankey());
    } else if (hasInvisibleNodes) {
      dispatch(selectNodes(ids));
      dispatch(expandSankey());
    } else {
      dispatch(selectNodes(ids));
    }
  };
}

export function selectSearchNode(results) {
  return {
    type: SET_SELECTED_NODES_BY_SEARCH,
    payload: { results }
  };
}

export function highlightNodeFromGeoId(geoId, coordinates) {
  return (dispatch, getState) => {
    const state = getState();
    const selectedColumnsIds = getSelectedColumnsIds(state);
    const {
      data: { nodes },
      highlightedNodeId
    } = state.toolLinks;

    const nodeId = getNodeIdFromGeoId(geoId, nodes, selectedColumnsIds[0]);
    if (nodeId === null) {
      if (highlightedNodeId) {
        dispatch(highlightNode(null));
      }
    } else {
      dispatch(highlightNode(nodeId, coordinates));
    }
  };
}

export function navigateToProfile(nodeId, year, contextId) {
  return (dispatch, getState) => {
    const node = getState().toolLinks.data.nodes[nodeId];
    dispatch({
      type: 'profileNode',
      payload: { query: { nodeId, year, contextId }, profileType: node.profileType }
    });
  };
}

export function saveMapView(latlng, zoom) {
  return {
    type: SAVE_MAP_VIEW,
    latlng,
    zoom
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

    fetch(getNodesURL)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(new Error(response.statusText));
      })
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
    contextualLayers
  };
}

export function selectMapBasemap(selectedMapBasemap) {
  return {
    type: SELECT_BASEMAP,
    selectedMapBasemap
  };
}
